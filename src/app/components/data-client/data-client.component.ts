import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-client',
  imports: [CommonModule],
  templateUrl: './data-client.component.html',
  styleUrl: './data-client.component.css'
})
export class DataClientComponent {
  clienti = [
    { nome: 'Mario', cognome: 'Rossi', comune: 'Roma', email: 'mario.rossi@email.com' },
    { nome: 'Lucia', cognome: 'Bianchi', comune: 'Milano', email: 'lucia.bianchi@email.com' },
    { nome: 'Giuseppe', cognome: 'Verdi', comune: 'Napoli', email: 'giuseppe.verdi@email.com' }
  ];
}
