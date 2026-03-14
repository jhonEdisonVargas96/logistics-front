import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PortRepository } from '../../../core/domain/ports/port.repository';
import { Port, PortRequest } from '../../../core/domain/models/port.model';
import { environment } from '../../../../environments/environment';

@Injectable()
export class PortHttpRepository implements PortRepository {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/ports`;

  getAll(): Observable<Port[]>                       { return this.http.get<Port[]>(this.base); }
  getById(id: number): Observable<Port>              { return this.http.get<Port>(`${this.base}/${id}`); }
  create(data: PortRequest): Observable<Port>        { return this.http.post<Port>(this.base, data); }
  update(id: number, data: PortRequest): Observable<Port> { return this.http.put<Port>(`${this.base}/${id}`, data); }
  delete(id: number): Observable<void>               { return this.http.delete<void>(`${this.base}/${id}`); }
}