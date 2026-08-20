/**
 * @file firebase.ts
 * @description Inicialización del SDK de Firebase y configuración de analíticas.
 * @architecture Shared Library Layer
 */

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBn37QK_KuiHPWma02UOD7-IwE25QiXYSA",
  authDomain: "slinkter-ea443.firebaseapp.com",
  projectId: "slinkter-ea443",
  storageBucket: "slinkter-ea443.firebasestorage.app",
  messagingSenderId: "401688208094",
  appId: "1:401688208094:web:33225652db68c34eb4584f",
  measurementId: "G-FXPW7VRE3W"
};

// Inicializa Firebase
export const app = initializeApp(firebaseConfig);

// Inicializa Analytics de manera condicional (solo en cliente/navegador)
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

// Inicializa Firestore y Auth
export const db = getFirestore(app);
export const auth = getAuth(app);
