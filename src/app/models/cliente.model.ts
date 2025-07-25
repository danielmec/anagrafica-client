export interface Cliente {
  id?: number;
  nome: string;
  cognome: string;
  indirizzo?: string;
  localita?: string;
  comune?: string;
  provincia?: string;
  email: string;
  note?: string;
}