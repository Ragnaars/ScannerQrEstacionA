import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, query, orderBy, limit, collectionChanges } from '@angular/fire/firestore'
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
}
