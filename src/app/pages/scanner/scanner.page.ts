import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxScannerQrcodeComponent } from 'ngx-scanner-qrcode/public-api';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FirestoreService } from "./../../services/firestore.service"
import { FireUsuariosService } from "./../../services/fire-usuarios.service"
import {
  get,
  getMs,
  getTime,
  getDate,
  getCompareDate,
  getFormatDate,
} from "util-tiempo";




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
  estacionamientos: any;
  nroEst: number = 0;
  est_asig: number = 0;
  idEstPref!: string;
  nroEstPref: number = 0;
  cantEstPref!: number;

  constructor(private fireEst: FirestoreService, private fireUsuarios: FireUsuariosService) { }


  ngOnInit() {
    this.fireUsuarios.obtenerDoc().subscribe((data: any) => {
      this.data = data;
      console.log("data", this.data);
    });

    this.fireEst.obtenerDoc().subscribe((estacionamientos: any) => {
      this.estacionamientos = estacionamientos;
      console.log("estacionamientostotales", this.estacionamientos);
    })

    // this.getEstDisp();
    // this.getEstDispPref();
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

      const verificador = this.estacionamientos.filter((estacionamiento: any) => estacionamiento.disponible === true)

      if (partes.length === 2) {
        const now = new Date().getTime();
        console.log("fecha", now)
        this.email = partes[1];
        this.uid = partes[0];

        console.log("uid", this.uid);
        console.log("email", this.email);

        const estacionamientoPropietario = this.estacionamientos.find((estacionamiento: any) => estacionamiento.email === this.email);

        const datosEstacionado = this.data.find((usuario: any) => usuario.email === this.email);
        console.log("datos estacionado", datosEstacionado)

        if (estacionamientoPropietario) {
          // Si el usuario ya es propietario de un estacionamiento, libera ese estacionamiento
          console.log("usuario a actualizar", estacionamientoPropietario)
          this.fireEst.updateDoc(estacionamientoPropietario.id, { disponible: true, email: '', patente: '' });
          this.fireUsuarios.updateDoc(datosEstacionado.id, { id_est: '', nro_est: 0 });
          this.est_asig = 0;
        } else {
          const verificador = this.estacionamientos.filter((estacionamiento: any) => estacionamiento.disponible === true)
          if (verificador.length == 0) {
            alert("no hay estacionamiento")
          } else {
            if (datosEstacionado.preferencial === true) {
              console.log("preferencial")
              this.getEstDispPref2();
              if (this.cantEstPref == 0) {
                this.getEstDisp2();
                console.log("id a actt", this.idEst, this.nroEst);
                this.fireEst.updateDoc(this.idEst, { disponible: false, email: this.email, patente: 'ABC12345' });
                this.fireUsuarios.updateDoc(datosEstacionado.id, { id_est: this.idEst, nro_est: this.nroEst });
                this.est_asig = this.nroEst
              } else {
                console.log("id a act", this.idEstPref, this.nroEstPref);
                //AQUI SE DEBE ACTUALIZAR EL ESTACIONAMIENTO PREFERENCIAL
                this.fireEst.updateDoc(this.idEstPref, { disponible: false, email: this.email, patente: 'ABC12345' });
                this.fireUsuarios.updateDoc(datosEstacionado.id, { id_est: this.idEstPref, nro_est: this.nroEstPref });
                this.est_asig = this.nroEstPref
              }
            } else {
              console.log("no preferencial")
              const estMod = this.estacionamientos.filter((estacionamiento: any) => estacionamiento.tipo === false)

              const verifica = estMod.filter((estacionamiento: any) => estacionamiento.disponible === true)
              console.log("veri", verifica)

              if (verifica.length == 0) {
                alert("No hay estacionamientos")

              } else {
                this.getEstDisp2();
                this.fireEst.updateDoc(this.idEst, { disponible: false, email: this.email, patente: 'ABC12345' });
                this.fireUsuarios.updateDoc(datosEstacionado.id, { id_est: this.idEst, nro_est: this.nroEst });
                this.est_asig = this.nroEst
              }
            }
          }
        }
      }
      this.fireUsuarios.obtenerDoc().subscribe((usuario: any) => {
        // Aquí puedes realizar acciones adicionales con el valor del código QR
      });
      setTimeout(() => {
        this.bloqueoLecturaQR = false; // Desactivar el bloqueo de lectura después de un período de tiempo
        return;
      }, 7000); // 5000 milisegundos = 5 segundos (ajusta este valor según tus necesidades)
    }
  }

  getEstDisp() { // Variable para controlar si se ha encontrado un estacionamiento disponible

    this.fireEst.obtenerDoc().subscribe((estacionamientos: any) => {
      estacionamientos.some((estacionamiento: any) => {
        if (estacionamiento.disponible != estacionamiento.tipo) {
          this.idEst = estacionamiento.id;
          this.nroEst = estacionamiento.nro_est;
          this.encontrado = true;
          console.log("id", this.idEst);
          return this.idEst && this.nroEst;
        }
        return false; // add this line to fix the issue
      })
    });
  }

  getEstDisp2() { // Variable para controlar si se ha encontrado un estacionamiento disponible
    this.estacionamientos.some((estacionamiento: any) => {
      if (estacionamiento.disponible && estacionamiento.tipo != true) {
        this.idEst = estacionamiento.id;
        this.nroEst = estacionamiento.nro_est;
        this.encontrado = true;
        console.log("id", this.idEst);
        return this.idEst && this.nroEst;
      }
      return false; // add this line to fix the issue
    })

  }

  getEstDispPref() { // Variable para controlar si se ha encontrado un estacionamiento disponible
    this.fireEst.obtenerDocPref().subscribe((estacionamientos: any) => {
      console.log("estacionamientos", estacionamientos)
      if (estacionamientos.length == 0) {
        this.cantEstPref = 0;
        return this.cantEstPref;
      } else
        this.idEstPref = estacionamientos[0].id;
      this.nroEstPref = estacionamientos[0].nro_est;
      this.encontrado = true;
      console.log("idPref", this.idEst, this.nroEst);
      return this.idEstPref && this.nroEstPref;
    });
  }


  getEstDispPref2() {
    this.encontrado = false; // Reiniciamos la bandera

    for (const estacionamiento of this.estacionamientos) {
      if (estacionamiento.tipo === true && estacionamiento.disponible === true) {
        this.idEstPref = estacionamiento.id;
        this.nroEstPref = estacionamiento.nro_est;
        this.encontrado = true;
        console.log("idPref", this.idEstPref, this.nroEstPref);
        break; // Detenemos el bucle una vez que se encuentra un estacionamiento preferencial disponible
      }
    }

    // Si no se encontró ningún estacionamiento preferencial disponible, establecemos this.cantEstPref en 0
    if (!this.encontrado) {
      this.cantEstPref = 0;
      console.log("cantPref", this.cantEstPref);
    }
  }

}
