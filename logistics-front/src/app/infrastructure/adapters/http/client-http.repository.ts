import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClientRepository } from '../../../core/domain/ports/client.repository';
import { Client, ClientRequest } from '../../../core/domain/models/client.model';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ClientHttpRepository implements ClientRepository {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/clients`;

  getAll(): Observable<Client[]>                      { return this.http.get<Client[]>(this.base); }
  getById(id: number): Observable<Client>             { return this.http.get<Client>(`${this.base}/${id}`); }
  create(data: ClientRequest): Observable<Client>     { return this.http.post<Client>(this.base, data); }
  update(id: number, data: ClientRequest): Observable<Client> { return this.http.put<Client>(`${this.base}/${id}`, data); }
  delete(id: number): Observable<void>                { return this.http.delete<void>(`${this.base}/${id}`); }
}