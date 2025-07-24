import { Routes } from '@angular/router';
import { DataClientComponent } from './components/data-client/data-client.component';
import { ClientFormComponent } from './components/client-form/client-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/clienti', pathMatch: 'full' },
  { path: 'clienti', component: DataClientComponent },
  { path: 'cliente/nuovo', component: ClientFormComponent },
  { path: 'cliente/:id', component: ClientFormComponent },
  { path: '**', redirectTo: '/clienti' }
];
