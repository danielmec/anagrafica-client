import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente.model'; 

@Component({
  selector: 'app-client-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.css'
})
export class ClientFormComponent implements OnInit {
  
  clienteForm: FormGroup; //form nel html che contiene i campi del cliente
  isModifica = false;
  clienteId: number | null = null;
  
  loading = false;
  error: string | null = null;


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private clienteService: ClienteService //servizio per operazioni CRUD sui clienti
  ) {
    this.clienteForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.clienteId = +params['id'];
        this.isModifica = true;
        this.caricaCliente(this.clienteId);
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      cognome: ['', [Validators.required, Validators.minLength(2)]],
      indirizzo: [''],
      localita: [''],
      comune: [''],
      provincia: ['', [Validators.maxLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      note: ['']
    });
  }

  private caricaCliente(id: number): void {
    this.loading = true;
    this.error = null;
    
    this.clienteService.getClienteById(id).subscribe({
      next: (cliente) => {
        this.clienteForm.patchValue(cliente);
        this.loading = false;
      },
      error: (error) => {
        console.error('Errore nel caricamento del cliente:', error);
        this.error = 'Cliente non trovato';
        this.loading = false;
        
        Swal.fire({
          title: 'Errore!',
          text: 'Cliente non trovato o errore del server.',
          icon: 'error'
        }).then(() => {
          this.router.navigate(['/clienti']);
        });
      }
    });
  }

  onSubmit(): void {
    if (this.clienteForm.valid) {
      const formData = this.clienteForm.value;
      
      if (this.isModifica) {
        this.modificaCliente(formData);
      } else {
        this.creaCliente(formData);
      }
    } else {
      this.mostraErroriValidazione();
    }
  }

  private modificaCliente(dati: Cliente): void {
    if (!this.clienteId) return;
    
    this.loading = true;
    
    this.clienteService.updateCliente(this.clienteId, dati).subscribe({
      next: (clienteAggiornato) => {
        this.loading = false;
        
        Swal.fire({
          title: 'Successo!',
          text: 'Cliente modificato con successo',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        
        setTimeout(() => {
          this.router.navigate(['/clienti']);
        }, 2000);
      },
      error: (error) => {
        console.error('Errore nella modifica:', error);
        this.loading = false;
        
        Swal.fire({
          title: 'Errore!',
          text: 'Impossibile modificare il cliente. Verifica i dati inseriti.',
          icon: 'error'
        });
      }
    });
  }

  private creaCliente(dati: Cliente): void {
    this.loading = true;
    
    this.clienteService.createCliente(dati).subscribe({
      next: (nuovoCliente) => {
        this.loading = false;
        
        Swal.fire({
          title: 'Successo!',
          text: 'Cliente creato con successo',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        
        setTimeout(() => {
          this.router.navigate(['/clienti']);
        }, 2000);
      },
      error: (error) => {
        console.error('Errore nella creazione:', error);
        this.loading = false;
        
        let errorMessage = 'Impossibile creare il cliente.';
        if (error.status === 400) {
          errorMessage = 'Email già esistente o dati non validi.';
        }
        
        Swal.fire({
          title: 'Errore!',
          text: errorMessage,
          icon: 'error'
        });
      }
    });
  }

  private mostraErroriValidazione(): void {
    let errori: string[] = [];
    
    const controls = this.clienteForm.controls;
    
    if (controls['nome'].hasError('required')) {
      errori.push('Nome è obbligatorio');
    }
    if (controls['cognome'].hasError('required')) {
      errori.push('Cognome è obbligatorio');
    }
    if (controls['email'].hasError('required')) {
      errori.push('Email è obbligatoria');
    }
    if (controls['email'].hasError('email')) {
      errori.push('Email non valida');
    }

    Swal.fire({
      title: 'Errori di validazione',
      html: errori.join('<br>'),
      icon: 'error'
    });
  }

  annulla(): void {
    this.router.navigate(['/clienti']);
  }

  //Getters
  get nome() { return this.clienteForm.get('nome'); }
  get cognome() { return this.clienteForm.get('cognome'); }
  get email() { return this.clienteForm.get('email'); }
  get provincia() { return this.clienteForm.get('provincia'); }
}
