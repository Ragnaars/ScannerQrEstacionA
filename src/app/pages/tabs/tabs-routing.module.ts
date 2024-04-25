import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'vista-est',
        loadChildren: () => import('../vista-est/vista-est.module').then(m => m.VistaEstPageModule)
      },
      {
        path: 'scanner',
        loadChildren: () => import('../scanner/scanner.module').then(m => m.ScannerPageModule)
      },
      {
        path: 'form-ingreso-est',
        loadChildren: () => import('../form-ingreso-est/form-ingreso-est.module').then(m => m.FormIngresoEstPageModule)
      },
      {
        path: 'dashboards',
        loadChildren: () => import('../dashboards/dashboards.module').then(m => m.DashboardsPageModule)
      },
      {
        path: '',
        redirectTo: 'vista-est',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule { }
