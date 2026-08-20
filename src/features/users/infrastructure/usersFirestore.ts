/**
 * @file usersFirestore.ts
 * @description Servicio para gestionar la colección de perfiles de usuario en Firestore.
 * @architecture Infrastructure Layer - Users Management
 */

import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/shared/lib/firebase";

export interface IUserProfileDocument {
  uid: string;
  email: string;
  role: string;
  createdAt?: string;
  isSuspended?: boolean;
}

const USERS_COLLECTION = "users";

/**
 * Obtiene todos los usuarios registrados en Firestore.
 */
export const getAllUsers = async (): Promise<IUserProfileDocument[]> => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const snapshot = await getDocs(usersRef);
    const users: IUserProfileDocument[] = [];
    snapshot.forEach((doc) => {
      users.push({ uid: doc.id, ...doc.data() } as IUserProfileDocument);
    });
    return users;
  } catch (error) {
    console.error("Error al obtener usuarios de Firestore:", error);
    return [];
  }
};

/**
 * Cambia el estado de suspensión de un usuario.
 */
export const setUserSuspension = async (uid: string, isSuspended: boolean): Promise<void> => {
  const userDocRef = doc(db, USERS_COLLECTION, uid);
  await updateDoc(userDocRef, {
    isSuspended,
  });
};
