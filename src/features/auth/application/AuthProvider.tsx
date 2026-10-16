/**
 * @file AuthProvider.tsx
 * @description Proveedor de contexto para autenticación de Firebase con sincronización de roles en Firestore.
 * @architecture Application & Infrastructure Layer
 */

import React, { useState, useEffect, useMemo } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "@/shared/lib/firebase";
import { reportServiceRuntimeError } from "@/shared/lib/credentialsValidator";
import { AuthContext } from "./AuthContext";
import type { IUserProfile, IAuthContextValue, UserRole } from "../domain/authTypes";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<IUserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Si Firebase no está configurado (variables ausentes o clave por defecto), no bloquear la app
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (firebaseUser) {
          try {
            // Obtiene los datos del usuario y rol desde Firestore
            const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
            if (userDoc.exists()) {
              const data = userDoc.data();
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email || "",
                role: data.role as UserRole,
              });
            } else {
              // Fallback por si el documento de Firestore no existe aún
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email || "",
                role: "buyer",
              });
            }
          } catch (error) {
            console.error("Error al obtener perfil de usuario:", error);
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              role: "buyer",
            });
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      },
      (error) => {
        console.warn("Error en el estado de autenticación de Firebase:", error);
        reportServiceRuntimeError("firebase", error.message);
        setUser(null);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    if (!isFirebaseConfigured) {
      throw new Error(
        "El servicio de Firebase no esta configurado. Define las variables VITE_FIREBASE_* en tu archivo .env local para habilitar la autenticacion."
      );
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      setLoading(false);
      if (error instanceof Error) {
        reportServiceRuntimeError("firebase", error.message);
      }
      throw error;
    }
  };

  const signup = async (email: string, pass: string, role: UserRole) => {
    if (!isFirebaseConfigured) {
      throw new Error(
        "El servicio de Firebase no esta configurado. Define las variables VITE_FIREBASE_* en tu archivo .env local para habilitar el registro."
      );
    }
    setLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, pass);
      const uid = credential.user.uid;
      
      // Registra en la colección Firestore "users"
      await setDoc(doc(db, "users", uid), {
        uid,
        email,
        role,
        createdAt: serverTimestamp()
      });

      setUser({
        uid,
        email,
        role
      });
    } catch (error) {
      setLoading(false);
      if (error instanceof Error) {
        reportServiceRuntimeError("firebase", error.message);
      }
      throw error;
    }
  };

  const logout = async () => {
    if (!isFirebaseConfigured) {
      setUser(null);
      return;
    }
    setLoading(true);
    try {
      await signOut(auth);
    } finally {
      setLoading(false);
    }
  };

  const val = useMemo<IAuthContextValue>(
    () => ({
      user,
      loading,
      login,
      signup,
      logout
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={val}>{children}</AuthContext.Provider>;
};
