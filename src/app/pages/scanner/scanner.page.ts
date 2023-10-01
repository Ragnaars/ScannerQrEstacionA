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
  idEst!: string;
  encontrado: Boolean = false;
  bloqueoLecturaQR: boolean = false;

  constructor(private fireEst: FirestoreService, private fireUsuarios: FireUsuariosService) { }


  ngOnInit() {
    this.fireUsuarios.obtenerDoc().subscribe((data: any) => {
      this.data = data;
      console.log("data", this.data);
    });

    this.getEstDisp();
  }


  // async onQRCodeScanned(event: any) {
  //   console.log('datita', this.data)
  //   if (!this.bloqueoLecturaQR) {
  //     this.bloqueoLecturaQR = true; // Activar el bloqueo de lectura
  //     this.codigoQR = event[0].value;
  //     const partes = this.codigoQR.split("//");

  //     if (partes.length === 2) {
  //       this.email = partes[1];
  //       this.uid = partes[0];

  //       console.log("uid", this.uid);
  //       console.log("email", this.email);

  //       // Verificar si el usuario ya es email de un estacionamiento
  //       const estacionamientoPropietario = this.data.find((estacionamiento: any) => estacionamiento.email === this.email);
  //       console.log("ai", estacionamientoPropietario)

  //       if (estacionamientoPropietario) {
  //         console.log('encontrado')
  //         // Si el usuario ya es email de un estacionamiento, libera ese estacionamiento
  //         this.fireEst.updateDoc(estacionamientoPropietario.id, { disponible: true, email: '', patente: '' });
  //         console.log("saliste del estacionamiento")
  //       } else {

  //         this.getEstDisp();

  //         this.fireEst.updateDoc(this.idEst, { disponible: false, email: this.email, patente: 'ABC12345' });
  //       }


  //       this.fireUsuarios.obtenerDoc().subscribe((usuario: any) => {
  //         // Aquí puedes realizar acciones adicionales con el valor del código QR
  //       });

  //       setTimeout(() => {
  //         this.bloqueoLecturaQR = false; // Desactivar el bloqueo de lectura después de un período de tiempo
  //       }, 5500);
  //     }
  //   }
  // }

  async onQRCodeScanned(event: any) {
    if (!this.bloqueoLecturaQR) {
      this.bloqueoLecturaQR = true; // Activar el bloqueo de lectura
      this.codigoQR = event[0].value;
      const partes = this.codigoQR.split("//");

      if (partes.length === 2) {
        this.email = partes[1];
        this.uid = partes[0];

        console.log("uid", this.uid);
        console.log("email", this.email);

        // this.fireEst.obtenerDoc().subscribe((estacionamientos: any) => {
        //   estacionamientos.some((estacionamiento: any) => {
        //     if (estacionamiento.propietario === this.email) {
        //       this.fireEst.updateDoc(estacionamiento.id, { disponible: true, uid: '', propietario: '', patente: '' });
        //     }
        //   })
        // })
        const estacionamientoPropietario = this.data.find((estacionamiento: any) => estacionamiento.email === this.email);

        if (estacionamientoPropietario) {
          // Si el usuario ya es propietario de un estacionamiento, libera ese estacionamiento
          console.log("usuario a actualizar", estacionamientoPropietario)
          this.fireEst.updateDoc(this.idEst, { disponible: true, email: '', patente: '' });
          this.fireUsuarios.updateDoc(estacionamientoPropietario.id, { id_est: '' });
        }

        this.getEstDisp();

        this.fireEst.updateDoc(this.idEst, { disponible: false, email: this.email, patente: 'ABC12345' });
        this.fireUsuarios.updateDoc(this.uid, { id_est: this.idEst });
      }


      this.fireUsuarios.obtenerDoc().subscribe((usuario: any) => {
        // Aquí puedes realizar acciones adicionales con el valor del código QR
      });

      setTimeout(() => {
        this.bloqueoLecturaQR = false; // Desactivar el bloqueo de lectura después de un período de tiempo
      }, 7000); // 5000 milisegundos = 5 segundos (ajusta este valor según tus necesidades)
    }
  }

  getEstDisp() { // Variable para controlar si se ha encontrado un estacionamiento disponible

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
