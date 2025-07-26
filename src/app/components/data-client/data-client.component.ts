import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-data-client',
  imports: [CommonModule, FormsModule],
  templateUrl: './data-client.component.html',
  styleUrl: './data-client.component.css'
})
export class DataClientComponent implements OnInit {

  //variabili locali
  clienti: Cliente[] = [];
  loading = false;
  error: string | null = null;
  clientiFiltrati: Cliente[] = [];
  highlightedClientId: number | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clienteService: ClienteService //gestisce operazioni CRUD sui clienti
  ) {}

  ngOnInit(): void {
    // controlla cliente da evidenziare
    this.route.queryParams.subscribe(params => {
      if (params['highlight']) {
        this.highlightedClientId = +params['highlight'];
      }
    });
    
    this.caricaClienti();
  }

  caricaClienti(): void {
    this.loading = true;
    this.error = null;
    
    this.clienteService.getAllClienti().subscribe({
      next: (clienti) => {
        this.clienti = clienti;
        this.clientiFiltrati = [...clienti]; //per non avere riferimenti diretti
        this.loading = false;
        
        //cliente da evidenziare, scorri fino ad esso
        if (this.highlightedClientId) {
          setTimeout(() => this.scrollToClient(this.highlightedClientId!), 500);
        }
      },
      error: (error) => {
        console.error('Errore nel caricamento dei clienti:', error);
        this.error = 'Errore nel caricamento dei clienti';
        this.loading = false;
        
        Swal.fire({
          title: 'Errore!',
          text: 'Impossibile caricare i clienti. Verifica che il server sia attivo.',
          icon: 'error'
        });
      }
    });
  }

  
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
             (cliente.comune || '').toLowerCase().includes(this.filtri.comune.toLowerCase()) &&
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
  private ordinaArray(array: Cliente[], campo: string, direzione: 'asc' | 'desc') {
    return array.sort((a, b) => {
      const valorA = (a[campo as keyof Cliente] || '').toString().toLowerCase();
      const valorB = (b[campo as keyof Cliente] || '').toString().toLowerCase();
      
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

  modificaCliente(cliente: Cliente) {
    console.log('Modifica cliente:', cliente, "id:", cliente.id);
    this.router.navigate(['/cliente', cliente.id]); //passa l'id del cliente da modificare
  }

  eliminaCliente(cliente: Cliente) {
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
      if (result.isConfirmed && cliente.id) {
        this.clienteService.deleteCliente(cliente.id).subscribe({
          next: () => {
            this.caricaClienti();
            
            Swal.fire({
              title: 'Eliminato!',
              text: `${cliente.nome} ${cliente.cognome} è stato eliminato.`,
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (error) => {
            console.error('Errore nell\'eliminazione:', error);
            Swal.fire({
              title: 'Errore!',
              text: 'Impossibile eliminare il cliente.',
              icon: 'error'
            });
          }
        });
      }
    });
  }

  /**
   * Funzione per scorrere fino al cliente evidenziato
   * @param clienteId ID del cliente da evidenziare
   */
  private scrollToClient(clienteId: number, retryCount: number = 0): void {
    const element = document.getElementById(`cliente-${clienteId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // timer dopo 3 secondi
      setTimeout(() => {
        this.highlightedClientId = null;
        // rimuove il query param dall'URL senza ricaricare la pagina
        this.router.navigate([], { 
          relativeTo: this.route,
          queryParams: {},
          replaceUrl: true
        });
      }, 3000);
    } else if (retryCount < 3) {

      setTimeout(() => this.scrollToClient(clienteId, retryCount + 1), 300);
    }
  }
}
