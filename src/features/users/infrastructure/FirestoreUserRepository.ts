/**
 * @file FirestoreUserRepository.ts
 * @description Adaptador de infraestructura que implementa IUserRepository para la gestión de usuarios en Firestore.
 * @architecture Infrastructure Layer - Users Repository Adapter (Repository Pattern)
 */

import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/shared/lib/firebase";
import type { IUserRepository } from "@/features/users/domain/repositories/IUserRepository";
import type { IUserProfileDocument } from "@/features/users/infrastructure/usersFirestore";

const USERS_COLLECTION = "users";

/**
 * @class FirestoreUserRepository
 * @description Repositorio para la administración de perfiles y estados de suspensión de usuarios.
 */
export class FirestoreUserRepository implements IUserRepository {
  /**
   * Obtiene todos los perfiles de usuario registrados.
   */
  public async getAllUsers(): Promise<IUserProfileDocument[]> {
    try {
      const usersRef = collection(db, USERS_COLLECTION);
      const snapshot = await getDocs(usersRef);
      const users: IUserProfileDocument[] = [];
      snapshot.forEach((docSnap) => {
        users.push({ uid: docSnap.id, ...docSnap.data() } as IUserProfileDocument);
      });
      return users;
    } catch (error) {
      console.error("FirestoreUserRepository: Error al obtener usuarios:", error);
      return [];
    }
  }

  /**
   * Modifica el estado de suspensión de un usuario.
   */
  public async setUserSuspension(uid: string, isSuspended: boolean): Promise<void> {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userDocRef, {
      isSuspended,
    });
  }
}

/** Instancia singleton del repositorio de usuarios */
export const firestoreUserRepository = new FirestoreUserRepository();
