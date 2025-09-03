// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'tabs',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  { path: '', redirectTo: '/tabs/tab1', pathMatch: 'full' },
  {
    path: 'detail/:id/:termin_id',
    loadComponent: () =>
      import('./pages/detail/detail.page').then((m) => m.DetailPage),
  },
  {
    path: 'impressum',
    loadComponent: () =>
      import('./pages/impressum/impressum.page').then((m) => m.ImpressumPage),
  },
  { path: '**', redirectTo: '/tabs/tab1' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
