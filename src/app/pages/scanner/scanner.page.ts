import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxScannerQrcodeComponent } from 'ngx-scanner-qrcode/public-api';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FirestoreService } from "./../../services/firestore.service"
import { FireUsuariosService } from "./../../services/fire-usuarios.service"



@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
})
export class ScannerPage implements OnInit {
  @ViewChild('action')

  scanner!: NgxScannerQrcodeComponent;
  codigoQR: string = '';
  data!: any;
  uid: any;
  email: any;
  idEst: any;
  encontrado: Boolean = false;

  constructor(private fireEst: FirestoreService, private fireUsuarios: FireUsuariosService) { }


  ngOnInit() {
    this.fireUsuarios.obtenerDoc().subscribe((data: any) => {
      this.data = data;
      console.log("data", this.data);
    });

    this.gestEstDisp();
  }


  async onQRCodeScanned(event: any) {
    this.codigoQR = event[0].value
    const partes = this.codigoQR.split("//");
    if (partes.length === 2) {
      this.email = partes[1];
      this.uid = partes[0];


      console.log("uid", this.uid);
      console.log("email", this.email);

      const userExist = this.data.some((user: any) => {
        user.email === this.email
      })
      const estacionamientoId = ""
      if (userExist) {
        try {

        } catch (error) {

        }
      }
    } else {
      console.log("Formato QR incorrecto");
    }


    console.log("qr", this.codigoQR);
    this.fireUsuarios.obtenerDoc().subscribe((usuario: any) => {

    });
    // Puedes realizar acciones adicionales con el valor del código QR aquí
  }

  gestEstDisp() { // Variable para controlar si se ha encontrado un estacionamiento disponible

    this.fireEst.obtenerDoc().subscribe((estacionamientos: any) => {
      estacionamientos.some((estacionamiento: any) => {
        if (estacionamiento.disponible) {
          this.idEst = estacionamiento.id;
          this.encontrado = true;
          console.log("id", this.idEst);
          return this.idEst;
        }
        return false; // add this line to fix the issue
      })
    });
  }

}
