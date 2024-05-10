import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule, FormGroup, FormBuilder, FormControl, AbstractControl, ValidatorFn,
  Validators
} from "@angular/forms"
import { FirestoreService } from 'src/app/services/firestore.service';
import { FireUsuariosService } from 'src/app/services/fire-usuarios.service';
import { Observable, map } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-form-ingreso-est',
  templateUrl: './form-ingreso-est.page.html',
  styleUrls: ['./form-ingreso-est.page.scss'],
})
export class FormIngresoEstPage implements OnInit {
  idEst!: string;
  encontrado: Boolean = false;
  formIngresoEst: FormGroup;
  estacionamientos: any[] = [1, 2, 3, 4, 5, 6, 7, 8];
  nroEst: number = 0;
  idEstPref!: string;
  nroEstPref: number = 0;
  data: any;
  cantEstReg: any[] = [];
  cantEstPref: any[] = [];
  constructor(private fireEst: FirestoreService, private fireUsuarios: FireUsuariosService, private alertCtrl: AlertController) {

    this.formIngresoEst = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      patente: new FormControl('', [Validators.required]),
      tipoEst: new FormControl('regular', [Validators.required]),
      est: new FormControl('', [Validators.required])
    })
  }

  ngOnInit() {


    // Modifica el color de fondo del canvas
    this.fireUsuarios.obtenerDoc().subscribe((data: any) => {
      this.data = data;
      console.log("data", this.data);
    });

    this.fireEst.obtenerDoc().subscribe((estacionamientos: any) => {
      this.estacionamientos = estacionamientos;
      console.log("estacionamientostotales", this.estacionamientos);
      //conseguir estacionamiento regular disponible
      this.getCantEstDisp2();

      //conseguir estacionamiento preferencial disponible
      this.getCantEstDispPref2();
    })

    // this.getEstDisp();
    // this.getEstDispPref();
  }

  registrarEntradaEst() {
    const formData = this.formIngresoEst.value;
    const email = formData.email;

    this.verificarEmailRegistrado(email).subscribe((emialEncontrado: boolean) => {
      if (!emialEncontrado) {
        this.emailNoFound();
        return;
      }

      const { patente, tipoEst, est } = formData;

      // Lógica para registrar la entrada

      this.fireUsuarios.obtenerDoc().subscribe((usuarios: any) => {
        const usuario = usuarios.find((u: any) => u.email === email);

        if (!usuario) {
          console.log("Usuario no encontrado");
          return;
        }

        if (usuario.nro_est !== 0) {
          console.log("Usuario ya estacionado", usuario);
          this.alreadyPark();
          return;
        }

        console.log("Usuario no estacionado");

      });
    });
  }

  patenteChilenaValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const patente = control.value;
      console.log("patente", patente);
      const patron = /^[A-Z]{2}-[A-Z]{2}\d{2}$/;

      if (patron.test(patente)) {
        return null; // Patente válida, devuelve null
      } else {
        return { 'patenteInvalida': { value: patente } }; // Patente inválida, devuelve un objeto con la clave 'patenteInvalida'
      }
    };
  }


  getCantEstDisp2() { // Variable para controlar si se ha encontrado un estacionamiento disponible
    const estReg: any = [];
    this.estacionamientos.forEach(estacionamiento => {
      if (estacionamiento.tipo === false && estacionamiento.disponible === true) {
        estReg.push(estacionamiento.nro_est);
      }
    })
    this.cantEstReg = estReg;
    console.log("cantEstReg", this.cantEstReg);
  }


  getCantEstDispPref2() {
    const estPref: any = [];
    this.estacionamientos.forEach(estacionamiento => {
      if (estacionamiento.tipo === true && estacionamiento.disponible === true) {
        estPref.push(estacionamiento.nro_est);
      }
    })
    this.cantEstPref = estPref;
    console.log("cantEstPref", this.cantEstPref);

  }

  verificarEmailRegistrado(email: string): Observable<boolean> {
    return this.fireUsuarios.obtenerDoc().pipe(
      map((usuarios: any[]) => {
        return usuarios.some(usuario => usuario.email === email);
      })
    );
  }

  //alertas
  async emailNoFound() {
    const alert = await this.alertCtrl.create({
      header: 'Email no encontrado',
      message: 'El correo electrónico ingresado no está registrado.',
      buttons: ['OK'],
      cssClass: 'custom-alert' // Agregar la clase personalizada aquí
    });

    await alert.present();
  }

  async alreadyPark() {
    const alert = await this.alertCtrl.create({
      header: 'Usuario ya estacionado',
      message: 'El usuario ya se encuentra ocupando un estacionamiento.',
      buttons: ['OK'],
      cssClass: 'custom-alert' // Agregar la clase personalizada aquí
    });

    await alert.present();
  }



}
