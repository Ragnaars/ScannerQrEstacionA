import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VistaEstPage } from './vista-est.page';

const routes: Routes = [
  {
    path: '',
    component: VistaEstPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VistaEstPageRoutingModule {}
