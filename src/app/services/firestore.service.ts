import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, query, orderBy, doc, setDoc, limit, collectionChanges, updateDoc } from '@angular/fire/firestore'
import { Estacionamiento } from "./../interfaces/estacionamiento";
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) { }

  createDoc(estacionamiento: Estacionamiento) {
    const est = collection(this.firestore, 'estacionamiento');
    return addDoc(est, estacionamiento);
  }
  obtenerDoc(): Observable<Estacionamiento[]> {
    const est = collection(this.firestore, 'estacionamiento');
    const sortedquery = query(est, orderBy('disponible', 'desc'));
    return collectionData(est, { idField: 'id' }) as Observable<Estacionamiento[]>;

  }

  // Método para actualizar un documento de estacionamiento
  async updateDoc(documentId: string, newData: Partial<Estacionamiento>): Promise<void> {
    const estDocRef = doc(this.firestore, 'estacionamiento', documentId);

    try {
      await updateDoc(estDocRef, newData);
      console.log('Documento actualizado con éxito');
    } catch (error) {
      console.error('Error al actualizar el documento:', error);
      throw error;
    }
  }



}
