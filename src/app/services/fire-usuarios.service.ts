import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, query, orderBy, limit, collectionChanges, doc, updateDoc } from '@angular/fire/firestore'
import { Observable } from 'rxjs';
import { Usuarios } from "../interfaces/usuarios"


@Injectable({
  providedIn: 'root'
})
export class FireUsuariosService {

  constructor(private firestore: Firestore) { }

  createDoc(usuarios: Usuarios) {
    const est = collection(this.firestore, 'usuarios');
    return addDoc(est, usuarios);
  }


  obtenerDoc(): Observable<Usuarios[]> {
    const est = collection(this.firestore, 'usuarios');
    return collectionData(est, { idField: 'id' }) as Observable<Usuarios[]>;

  }

  async updateDoc(documentId: string, newData: Partial<Usuarios>): Promise<void> {
    const estDocRef = doc(this.firestore, 'usuarios', documentId);

    try {
      await updateDoc(estDocRef, newData);
      console.log('Documento actualizado con éxito');
    } catch (error) {
      console.error('Error al actualizar el documento:', error);
      throw error;
    }
  }
}
