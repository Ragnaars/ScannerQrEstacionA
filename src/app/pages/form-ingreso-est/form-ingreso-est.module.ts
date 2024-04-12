import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormControl, FormGroup } from "@angular/forms"
import { IonicModule } from '@ionic/angular';

import { FormIngresoEstPageRoutingModule } from './form-ingreso-est-routing.module';

import { FormIngresoEstPage } from './form-ingreso-est.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    FormIngresoEstPageRoutingModule
  ],
  declarations: [FormIngresoEstPage]
})
export class FormIngresoEstPageModule { }
