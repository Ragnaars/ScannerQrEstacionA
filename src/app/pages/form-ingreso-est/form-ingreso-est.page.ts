import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormControl, AbstractControl, ValidatorFn, Validators } from "@angular/forms"

@Component({
  selector: 'app-form-ingreso-est',
  templateUrl: './form-ingreso-est.page.html',
  styleUrls: ['./form-ingreso-est.page.scss'],
})
export class FormIngresoEstPage implements OnInit {

  formIngresoEst: FormGroup;

  constructor() {

    this.formIngresoEst = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      patente: new FormControl('', [Validators.required, this.patenteChilenaValidator()]),
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
      const patron = /^[A-Za-z]{2}\d{2}(\d{1}|[A-Za-z]{1})\d{2}$/;

      if (patron.test(patente)) {
        return null; // Patente válida, devuelve null
      } else {
        return { 'patenteInvalida': { value: patente } }; // Patente inválida, devuelve un objeto con la clave 'patenteInvalida'
      }
    };
  }

}
