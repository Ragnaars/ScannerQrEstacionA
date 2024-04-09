import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VistaEstPageRoutingModule } from './vista-est-routing.module';

import { VistaEstPage } from './vista-est.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VistaEstPageRoutingModule
  ],
  declarations: [VistaEstPage]
})
export class VistaEstPageModule {}
