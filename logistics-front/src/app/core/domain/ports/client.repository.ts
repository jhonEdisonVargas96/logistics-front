import { Observable } from 'rxjs';
import { Client, ClientRequest } from '../models/client.model';

export interface ClientRepository {
  getAll(): Observable<Client[]>;
  getById(id: number): Observable<Client>;
  create(data: ClientRequest): Observable<Client>;
  update(id: number, data: ClientRequest): Observable<Client>;
  delete(id: number): Observable<void>;
}