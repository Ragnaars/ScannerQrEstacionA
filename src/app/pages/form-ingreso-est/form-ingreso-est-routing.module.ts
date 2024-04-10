import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormIngresoEstPage } from './form-ingreso-est.page';

const routes: Routes = [
  {
    path: '',
    component: FormIngresoEstPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormIngresoEstPageRoutingModule {}
