import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-data-client',
  imports: [CommonModule, FormsModule],
  templateUrl: './data-client.component.html',
  styleUrl: './data-client.component.css'
})
export class DataClientComponent {

  clienti = [
    { id: 1, nome: 'Mario', cognome: 'Rossi', comune: 'Roma', email: 'mario.rossi@email.com' },
    { id: 2, nome: 'Lucia', cognome: 'Bianchi', comune: 'Milano', email: 'lucia.bianchi@email.com' },
    { id: 3, nome: 'Giuseppe', cognome: 'Verdi', comune: 'Napoli', email: 'giuseppe.verdi@email.com' },
    { id: 4, nome: 'Anna', cognome: 'Neri', comune: 'Milano', email: 'anna.neri@email.com' }
  ];

  constructor(private router: Router) {}

  clientiFiltrati = [...this.clienti];

  //variabili pubbliche per i filtri e l'ordinamento
  filtri = {
    nome: '',
    cognome: '',
    comune: '',
    email: ''
  };

  ordinamento = { 
    campo: '',
    direzione: 'asc' as 'asc' | 'desc'
  }; 


    /**  
    * Funzione per assegnare i valori alla variabile locale in base ai filtri e all'ordinamento clicccato
    */
    ordinaPer(campo: string) {
    if (this.ordinamento.campo === campo) {
      this.ordinamento.direzione = this.ordinamento.direzione === 'asc' ? 'desc' : 'asc';
    } else {
      this.ordinamento.campo = campo;
      this.ordinamento.direzione = 'asc';
    }
    this.applicaFiltri(); 
  }

  /** 
   * Funzione per applicare i filtri e l'ordinamento ai clienti
   */
  applicaFiltri() {
    let risultato = this.clienti.filter(cliente => {
      return cliente.nome.toLowerCase().includes(this.filtri.nome.toLowerCase()) &&
             cliente.cognome.toLowerCase().includes(this.filtri.cognome.toLowerCase()) &&
             cliente.comune.toLowerCase().includes(this.filtri.comune.toLowerCase()) &&
             cliente.email.toLowerCase().includes(this.filtri.email.toLowerCase());
    });

    if (this.ordinamento.campo) {
      risultato = this.ordinaArray(risultato, this.ordinamento.campo, this.ordinamento.direzione);
    }

    this.clientiFiltrati = risultato;
  }

  /**
   * Funzione ausiliare per ordinare l'array in base al dato e alla direzione già specificati
   */
  private ordinaArray(array: any[], campo: string, direzione: 'asc' | 'desc') {
    return array.sort((a, b) => {
      const valorA = a[campo].toLowerCase();
      const valorB = b[campo].toLowerCase();
      
      //sort ha bisogno di -1, 1, 0 per determinare l'ordinamento
      if (direzione === 'asc') {
        return valorA < valorB ? -1 : valorA > valorB ? 1 : 0;
      } else {
        return valorA > valorB ? -1 : valorA < valorB ? 1 : 0;
      }
    });
  }


  nuovaAnagrafica() {
    this.router.navigate(['/cliente/nuovo']);
  }

  modificaCliente(cliente: any) {
    this.router.navigate(['/cliente', cliente.id]); //passa l'id del cliente da modificare
  }

  eliminaCliente(cliente: any) {
    //uso di SweetAlert per l'eliminazione
    Swal.fire({
      title: 'Conferma eliminazione',
      text: `Sei sicuro di voler eliminare ${cliente.nome} ${cliente.cognome}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Si, elimina!',
      cancelButtonText: 'Annulla'
    }).then((result) => {
      if (result.isConfirmed) {
        //va sostituito con la logica di eliminazione del cliente nel database
        const index = this.clienti.indexOf(cliente);
        if (index > -1) {
          this.clienti.splice(index, 1);

          this.applicaFiltri();
          
          //messaggio di successo
          Swal.fire({
            title: 'Eliminato!',
            text: `${cliente.nome} ${cliente.cognome} è stato eliminato.`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        }
      }
    });
  }
}
