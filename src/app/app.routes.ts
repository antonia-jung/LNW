import { Routes } from '@angular/router';
import { TabsPage } from './tabs/tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
  },
  {
    path: 'detail/:id/:termin_id',
    loadComponent: () =>
      import('./pages/detail/detail.page').then((m) => m.DetailPage),
  },
  {
    path: 'impressum',
    loadComponent: () => import('./pages/impressum/impressum.page').then( m => m.ImpressumPage)
  },
];
