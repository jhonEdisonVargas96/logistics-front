import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WarehouseRepository } from '../../../core/domain/ports/warehouse.repository';
import { Warehouse, WarehouseRequest } from '../../../core/domain/models/warehouse.model';

@Injectable()
export class WarehouseHttpRepository implements WarehouseRepository {
  private readonly http = inject(HttpClient);
  private readonly base = 'http://localhost:8085/api/v1/warehouses';

  getAll(): Observable<Warehouse[]>                           { return this.http.get<Warehouse[]>(this.base); }
  getById(id: number): Observable<Warehouse>                  { return this.http.get<Warehouse>(`${this.base}/${id}`); }
  create(data: WarehouseRequest): Observable<Warehouse>       { return this.http.post<Warehouse>(this.base, data); }
  update(id: number, data: WarehouseRequest): Observable<Warehouse> { return this.http.put<Warehouse>(`${this.base}/${id}`, data); }
  delete(id: number): Observable<void>                        { return this.http.delete<void>(`${this.base}/${id}`); }
}