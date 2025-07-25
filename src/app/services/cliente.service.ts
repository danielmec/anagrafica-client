import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  
  private apiUrl = 'http://localhost:8080/api/clienti';

  constructor(private http: HttpClient) { }

  getAllClienti(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  getClienteById(id: number): Observable<Cliente> {
    console.log(`Fetching cliente with ID: ${id}`);
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  createCliente(cliente: Cliente): Observable<Cliente> {
    console.log('Creating new cliente:', cliente);
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }

  updateCliente(id: number, cliente: Cliente): Observable<Cliente> {
    console.log(`Updating cliente with ID: ${id}`, cliente);
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, cliente);
  }

  deleteCliente(id: number): Observable<void> {
    console.log(`Deleting cliente with ID: ${id}`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchClienti(nome?: string, cognome?: string): Observable<Cliente[]> {
    console.log('Searching clienti with filters:', { nome, cognome });
    const params = new URLSearchParams();
    if (nome) params.append('nome', nome);
    if (cognome) params.append('cognome', cognome);
    
    return this.http.get<Cliente[]>(`${this.apiUrl}/search?${params.toString()}`);
  }
}