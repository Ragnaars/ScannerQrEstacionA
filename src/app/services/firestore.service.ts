import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, query, orderBy, doc, setDoc, limit, collectionChanges, updateDoc, where } from '@angular/fire/firestore'
import { Estacionamiento } from "./../interfaces/estacionamiento";
import { Observable } from 'rxjs';
import { regEstacionamiento } from "../interfaces/regEstacionamiento"


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) { }

  createDoc(estacionamiento: Estacionamiento) {
    const est = collection(this.firestore, 'estacionamiento');
    return addDoc(est, estacionamiento);
  }

  // Método para crear un documento historico de entrada al estacionamiento
  createDocRegHistoricoEstEntrada(regEstacionamiento: regEstacionamiento) {
    const est = collection(this.firestore, 'regHistoricoEst');
    return addDoc(est, regEstacionamiento);
  }


  // Método para crear un documento historico de salida al estacionamiento
  createDocRegHistoricoEstSalida(regEstacionamiento: regEstacionamiento) {
    const est = collection(this.firestore, 'regHistoricoEstSalida');
    return addDoc(est, regEstacionamiento);
  }

  obtenerDataHistoricaEntrada() {
    const est = collection(this.firestore, 'regHistoricoEst');
    return collectionData(est, { idField: 'id' }) as Observable<regEstacionamiento[]>

  }

  obtenerDataHistoricaSalida() {
    const est = collection(this.firestore, 'regHistoricoEstSalida');
    const sortedquery = query(est, orderBy('fecha', 'desc'));
    return collectionData(sortedquery, { idField: 'id' }) as Observable<regEstacionamiento[]>


  }


  obtenerDoc(): Observable<Estacionamiento[]> {
    const est = collection(this.firestore, 'estacionamiento');
    const sortedquery = query(est, orderBy('disponible', 'desc'));
    return collectionData(est, { idField: 'id' }) as Observable<Estacionamiento[]>;
  }

  obtenerDocPref(): Observable<Estacionamiento[]> {
    const est = collection(this.firestore, 'estacionamiento');
    const sortedquery = query(est, where('tipo', '==', true),
      where('disponible', '==', true),
      orderBy('nro_est', 'asc'));
    return collectionData(sortedquery, { idField: 'id' }) as Observable<Estacionamiento[]>

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
