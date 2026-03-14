import { Observable } from 'rxjs';
import { Port, PortRequest } from '../models/port.model';

export interface PortRepository {
  getAll(): Observable<Port[]>;
  getById(id: number): Observable<Port>;
  create(data: PortRequest): Observable<Port>;
  update(id: number, data: PortRequest): Observable<Port>;
  delete(id: number): Observable<void>;
}