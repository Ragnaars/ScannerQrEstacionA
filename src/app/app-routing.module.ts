import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs/vista-est',
    pathMatch: 'full'
  },
  {
    path: 'scanner',
    loadChildren: () => import('./pages/scanner/scanner.module').then(m => m.ScannerPageModule)
  },
  {
    path: 'vista-est',
    loadChildren: () => import('./pages/vista-est/vista-est.module').then(m => m.VistaEstPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },  {
    path: 'form-ingreso-est',
    loadChildren: () => import('./pages/form-ingreso-est/form-ingreso-est.module').then( m => m.FormIngresoEstPageModule)
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
