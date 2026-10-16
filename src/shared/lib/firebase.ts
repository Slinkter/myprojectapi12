/**
 * @file firebase.ts
 * @description Inicialización del SDK de Firebase y configuración de analíticas.
 * Detecta la presencia de las variables de entorno y degrada de forma segura cuando
 * faltan (por ejemplo, en builds de CI sin `.env`), evitando que la aplicación se
 * rompa al arrancar y sin exponer credenciales en el repositorio.
 * @architecture Shared Library Layer
 */

import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";
import { reportServiceRuntimeError } from "./credentialsValidator";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

/** Indica si todas las credenciales requeridas de Firebase están presentes y no son la clave por defecto revocada. */
const hasConfig = 
  Boolean(firebaseConfig.apiKey) &&
  firebaseConfig.apiKey !== "AIzaSyBn37QK_KuiHPWma02UOD7-IwE25QiXYSA" &&
  Object.values(firebaseConfig).every(
    (value) => typeof value === "string" && value.length > 0
  );

/**
 * Indica si Firebase está configurado y disponible en este entorno.
 * @remarks Permite a los consumidores degradar de forma segura (p. ej. `AuthProvider`)
 * sin arriesgar un crash al arrancar en builds de CI sin variables de entorno.
 */
export const firebaseReady: boolean = hasConfig;
export const isFirebaseConfigured: boolean = hasConfig;

/**
 * Crea un "stub" que lanza un error descriptivo si algún módulo intenta usar
 * un servicio de Firebase sin configuración. Mantiene los tipos del SDK intactos
 * para que los consumidores no necesiten guardas de nulidad.
 *
 * @param name - Nombre del servicio no disponible (app, auth, db, etc.).
 * @returns Un proxy tipado que falla con un mensaje claro al ser usado.
 */
function createUnavailable<T>(name: string): T {
  return new Proxy(
    {},
    {
      get(_target, prop) {
        if (typeof prop === "symbol") return undefined;
        throw new Error(
          `Firebase "${name}" no está configurado. Define las variables VITE_FIREBASE_* en tu archivo .env local.`
        );
      },
      set() {
        throw new Error(
          `Firebase "${name}" no está configurado. Define las variables VITE_FIREBASE_* en tu archivo .env local.`
        );
      },
    }
  ) as unknown as T;
}

// Inicializa Firebase únicamente si la configuración es válida
export const app: FirebaseApp = hasConfig
  ? initializeApp(firebaseConfig)
  : createUnavailable<FirebaseApp>("app");

// Analytics se inicializa de manera condicional y segura (solo cliente/navegador y si el entorno lo soporta)
export let analytics: Analytics | null = null;

if (typeof window !== "undefined" && hasConfig) {
  isSupported()
    .then((supported) => {
      if (supported && firebaseConfig.measurementId) {
        analytics = getAnalytics(app);
      }
    })
    .catch((err) => {
      if (err instanceof Error) {
        reportServiceRuntimeError("firebase", err.message);
      }
    });
}

// Firestore y Auth degradan a un stub descriptivo cuando no hay configuración
export const db: Firestore = hasConfig
  ? getFirestore(app)
  : createUnavailable<Firestore>("db");

export const auth: Auth = hasConfig
  ? getAuth(app)
  : createUnavailable<Auth>("auth");
