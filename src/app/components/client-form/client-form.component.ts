import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

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
  
  //dati fittizi per la demo
  clienti = [
    { id: 1, nome: 'Mario', cognome: 'Rossi', indirizzo: 'Via Roma 1', localita: 'Centro', comune: 'Roma', provincia: 'RM', email: 'mario.rossi@email.com', note: 'Cliente VIP' },
    { id: 2, nome: 'Lucia', cognome: 'Bianchi', indirizzo: 'Via Milano 2', localita: 'Isola', comune: 'Milano', provincia: 'MI', email: 'lucia.bianchi@email.com', note: '' },
    { id: 3, nome: 'Giuseppe', cognome: 'Verdi', indirizzo: 'Via Napoli 3', localita: 'Vomero', comune: 'Napoli', provincia: 'NA', email: 'giuseppe.verdi@email.com', note: 'Musicista' },
    { id: 4, nome: 'Anna', cognome: 'Neri', indirizzo: 'Corso Buenos Aires 4', localita: 'Porta Venezia', comune: 'Milano', provincia: 'MI', email: 'anna.neri@email.com', note: 'Designer' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.clienteForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.clienteId = +params['id']; //converte l'id in numero passato da pagina precedente
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
    const cliente = this.clienti.find(c => c.id === id);
    if (cliente) {
      this.clienteForm.patchValue(cliente); //popola il form con i dati del cliente da modificare
    }
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

  private modificaCliente(dati: any): void {
    console.log('Modifica cliente:', dati);
    
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
  }

  private creaCliente(dati: any): void {
    console.log('Crea cliente:', dati);
    
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
