import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LandShipmentRepository } from '../../../core/domain/ports/land-shipment.repository';
import { LandShipment, LandShipmentRequest } from '../../../core/domain/models/land-shipment.model';

@Injectable()
export class LandShipmentHttpRepository implements LandShipmentRepository {
  private readonly http = inject(HttpClient);
  private readonly base = 'http://localhost:8085/api/v1/land-shipments';

  getAll(): Observable<LandShipment[]>                              { return this.http.get<LandShipment[]>(this.base); }
  getById(id: number): Observable<LandShipment>                     { return this.http.get<LandShipment>(`${this.base}/${id}`); }
  create(data: LandShipmentRequest): Observable<LandShipment>       { return this.http.post<LandShipment>(this.base, data); }
  update(id: number, data: LandShipmentRequest): Observable<LandShipment> { return this.http.put<LandShipment>(`${this.base}/${id}`, data); }
  delete(id: number): Observable<void>                              { return this.http.delete<void>(`${this.base}/${id}`); }
}