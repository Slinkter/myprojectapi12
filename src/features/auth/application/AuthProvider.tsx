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
import { auth, db, firebaseReady } from "@/shared/lib/firebase";
import { AuthContext } from "@features/auth/application/AuthContext";
import type { IUserProfile, IAuthContextValue, UserRole } from "@features/auth/domain/authTypes";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<IUserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Sin configuración de Firebase (builds de CI) no hay sesión: degrada a invitado.
    if (!firebaseReady) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Obtiene los datos del usuario y rol desde Firestore
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.isSuspended) {
              alert("Tu cuenta ha sido suspendida por el administrador.");
              await signOut(auth);
              setUser(null);
            } else {
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email || "",
                role: data.role as UserRole,
              });
            }
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
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    if (!firebaseReady) throw new Error("La autenticación no está disponible en este entorno.");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signup = async (email: string, pass: string, role: UserRole) => {
    if (!firebaseReady) throw new Error("El registro no está disponible en este entorno.");
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
      throw error;
    }
  };

  const logout = async () => {
    if (!firebaseReady) return;
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
