/**
 * @file firebase.ts
 * @description Inicialización del SDK de Firebase y configuración de analíticas.
 * @architecture Shared Library Layer
 */

import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { reportServiceRuntimeError } from "./credentialsValidator";

const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyBn37QK_KuiHPWma02UOD7-IwE25QiXYSA",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "slinkter-ea443.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "slinkter-ea443",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "slinkter-ea443.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "401688208094",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:401688208094:web:33225652db68c34eb4584f",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-FXPW7VRE3W",
};

/**
 * Determina si Firebase ha sido configurado con credenciales validas desde variables de entorno.
 * Excluye la clave por defecto revocada para prevenir llamadas fallidas a Google APIs.
 */
export const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID &&
  import.meta.env.VITE_FIREBASE_API_KEY !== "AIzaSyBn37QK_KuiHPWma02UOD7-IwE25QiXYSA"
);

// Inicializa Firebase
export const app = initializeApp(firebaseConfig);

// Inicializa Analytics de manera condicional y segura (solo en navegador si el entorno lo soporta y esta configurado)
export let analytics: Analytics | null = null;

if (typeof window !== "undefined" && isFirebaseConfigured) {
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

// Inicializa Firestore y Auth
export const db = getFirestore(app);
export const auth = getAuth(app);

