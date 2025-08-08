import { Routes } from '@angular/router';
import { Home } from './components/home/home';

export const routes: Routes = [
  {
    path: 'pl',
    component: Home,
    data: { lang: 'pl' }
  },
  {
    path: '',
    component: Home,
    data: { lang: 'en' }
  },
];
