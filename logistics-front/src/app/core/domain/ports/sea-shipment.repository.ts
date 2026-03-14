import { Observable } from 'rxjs';
import { SeaShipment, SeaShipmentRequest } from '../models/sea-shipment.model';

export interface SeaShipmentRepository {
  getAll(): Observable<SeaShipment[]>;
  getById(id: number): Observable<SeaShipment>;
  create(data: SeaShipmentRequest): Observable<SeaShipment>;
  update(id: number, data: SeaShipmentRequest): Observable<SeaShipment>;
  delete(id: number): Observable<void>;
}