import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormControl, AbstractControl, ValidatorFn, Validators } from "@angular/forms"

@Component({
  selector: 'app-form-ingreso-est',
  templateUrl: './form-ingreso-est.page.html',
  styleUrls: ['./form-ingreso-est.page.scss'],
})
export class FormIngresoEstPage implements OnInit {

  formIngresoEst: FormGroup;
  estacionamientos: any[] = [1,2,3,4,5,6,7,8];
  constructor() {

    this.formIngresoEst = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      patente: new FormControl('', [Validators.required]),
      tipoEst: new FormControl('regular', [Validators.required])
    })
  }

  ngOnInit() {

    

  }

  registrarEntradaEst() {
    console.log(this.formIngresoEst)
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

}
