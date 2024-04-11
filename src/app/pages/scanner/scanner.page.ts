import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxScannerQrcodeComponent } from 'ngx-scanner-qrcode/public-api';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FirestoreService } from "./../../services/firestore.service"
import { FireUsuariosService } from "./../../services/fire-usuarios.service"
import { regEstacionamiento } from "./../../interfaces/regEstacionamiento"
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
  segundos!: number

  constructor(private fireEst: FirestoreService, private fireUsuarios: FireUsuariosService) { }


  ngOnInit() {


    // Modifica el color de fondo del canvas
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

  async onQRCodeScanned(event: any) {
    //si no hay bloqueo de lectura entonces se ejecuta el codigo
    if (!this.bloqueoLecturaQR) {
      this.bloqueoLecturaQR = true; // Activar el bloqueo de lectura
      this.segundos = 6; // Cambiar este valor según sea necesario
      this.codigoQR = event[0].value; // Obtener el valor del código QR
      const partes = this.codigoQR.split("//"); // separar el código QR en partes basado por la sintaxis del valor


      // Función para actualizar el contador cada segundo
      const actualizarContador = () => {
        this.segundos--;
        if (this.segundos > 0) {
          setTimeout(actualizarContador, 1000); // Llama a esta función nuevamente después de 1 segundo
        } else {
          // Cuando se acaben los segundos, desactiva el bloqueo de lectura
          this.bloqueoLecturaQR = false;
        }
      };
      // Iniciar el contador

      actualizarContador();


      //filtrar los estacionamientos disponibles y los guardamos en la variable verificador
      const verificador = this.estacionamientos.filter((estacionamiento: any) => estacionamiento.disponible === true)

      //si las partes del valor del codigo QR son 2 entonces se ejecuta el codigo (deberian ser siempre 2 partes)
      if (partes.length === 2) {
        //obtenemos la fecha actual para registrarla en el historico
        const now = new Date().getTime();

        //separamos el valor del codigo QR en dos partes, el uid y el email
        this.email = partes[1];
        this.uid = partes[0];

        // Podemos observar sus valores descomentando estas 2 lineas 
        // console.log("uid", this.uid);
        // console.log("email", this.email);

        // Verificar si el usuario ya es propietario de un estacionamiento
        const estacionamientoPropietario = this.estacionamientos.find((estacionamiento: any) => estacionamiento.email === this.email);

        // Buscamos al usuario en la base de datos
        const datosEstacionado = this.data.find((usuario: any) => usuario.email === this.email);
        console.log("datos estacionado", datosEstacionado)

        // Si el usuario ya es propietario de un estacionamiento, entonces liberamos ese estacionamiento
        if (estacionamientoPropietario) {

          console.log("usuario a actualizar", estacionamientoPropietario)

          //actualizamos el estacionamiento a disponible y eliminamos el email y la patente
          this.fireEst.updateDoc(estacionamientoPropietario.id, { disponible: true, email: '', patente: '' });
          //actualizamos el usuario a sin estacionamiento
          this.fireUsuarios.updateDoc(datosEstacionado.id, { id_est: '', nro_est: 0 });
          this.est_asig = 0;


          //registro historico de salida de estacionamiento

          const regEstHist = {
            nro_est: estacionamientoPropietario.nro_est,
            hora: new Date(),
            usuario: this.email
          }

          this.fireEst.createDocRegHistoricoEstSalida(regEstHist);



          //SI NO ES PROPIETARIO DE UN ESTACIONAMIENTO SE EJECUTA ESTA PARTE DEL CODIGO
        } else {
          //verificando si hay estacionamientos disponibles
          const verificador = this.estacionamientos.filter((estacionamiento: any) => estacionamiento.disponible === true)
          //si no hay estacionamientos disponibles se muestra un mensaje de alerta
          if (verificador.length == 0) {
            alert("no hay estacionamientos disponibles")

            //si hay estacionamientos disponibles se ejecuta este codigo
          } else {
            //primero verificamos si el usuario es preferencial
            if (datosEstacionado.preferencial === true) {
              console.log("preferencial")
              //obtenemos los estacionamientos preferenciales disponibles
              this.getEstDispPref2();
              //si no hay estacionamientos preferenciales disponibles se ejecuta este codigo
              if (this.cantEstPref == 0) {

                this.getEstDisp2();
                console.log("id a actt", this.idEst, this.nroEst);

                this.fireEst.updateDoc(this.idEst, { disponible: false, email: this.email, patente: 'ABC12345' });
                this.fireUsuarios.updateDoc(datosEstacionado.id, { id_est: this.idEst, nro_est: this.nroEst });
                this.est_asig = this.nroEst
                //registro hiustorico

                const regEstHist = {
                  nro_est: this.est_asig,
                  hora: new Date(),
                  usuario: this.email
                }

                this.fireEst.createDocRegHistoricoEstEntrada(regEstHist);
              } else {
                console.log("id a act", this.idEstPref, this.nroEstPref);
                //AQUI SE DEBE ACTUALIZAR EL ESTACIONAMIENTO PREFERENCIAL
                this.fireEst.updateDoc(this.idEstPref, { disponible: false, email: this.email, patente: 'ABC12345' });
                this.fireUsuarios.updateDoc(datosEstacionado.id, { id_est: this.idEstPref, nro_est: this.nroEstPref });
                this.est_asig = this.nroEstPref
                //registro historico
                const regEstHist = {
                  nro_est: this.est_asig,
                  hora: new Date(),
                  usuario: this.email
                }

                this.fireEst.createDocRegHistoricoEstEntrada(regEstHist);
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

                //reg historico est entrada (solo info)
                const regEstHist = {
                  nro_est: this.est_asig,
                  hora: new Date(),
                  usuario: this.email
                }

                this.fireEst.createDocRegHistoricoEstEntrada(regEstHist);


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
      }, 6000); // 5000 milisegundos = 5 segundos (ajusta este valor según tus necesidades)
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
