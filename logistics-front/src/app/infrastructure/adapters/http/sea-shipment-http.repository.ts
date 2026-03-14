import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SeaShipmentRepository } from '../../../core/domain/ports/sea-shipment.repository';
import { SeaShipment, SeaShipmentRequest } from '../../../core/domain/models/sea-shipment.model';

@Injectable()
export class SeaShipmentHttpRepository implements SeaShipmentRepository {
  private readonly http = inject(HttpClient);
  private readonly base = 'http://localhost:8085/api/v1/sea-shipments';

  getAll(): Observable<SeaShipment[]>                              { return this.http.get<SeaShipment[]>(this.base); }
  getById(id: number): Observable<SeaShipment>                     { return this.http.get<SeaShipment>(`${this.base}/${id}`); }
  create(data: SeaShipmentRequest): Observable<SeaShipment>        { return this.http.post<SeaShipment>(this.base, data); }
  update(id: number, data: SeaShipmentRequest): Observable<SeaShipment> { return this.http.put<SeaShipment>(`${this.base}/${id}`, data); }
  delete(id: number): Observable<void>                             { return this.http.delete<void>(`${this.base}/${id}`); }
}