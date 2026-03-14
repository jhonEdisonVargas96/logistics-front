import { Observable } from 'rxjs';
import { Warehouse, WarehouseRequest } from '../models/warehouse.model';

export interface WarehouseRepository {
  getAll(): Observable<Warehouse[]>;
  getById(id: number): Observable<Warehouse>;
  create(data: WarehouseRequest): Observable<Warehouse>;
  update(id: number, data: WarehouseRequest): Observable<Warehouse>;
  delete(id: number): Observable<void>;
}