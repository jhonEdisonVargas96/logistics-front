import { Observable } from 'rxjs';
import { LandShipment, LandShipmentRequest } from '../models/land-shipment.model';

export interface LandShipmentRepository {
  getAll(): Observable<LandShipment[]>;
  getById(id: number): Observable<LandShipment>;
  create(data: LandShipmentRequest): Observable<LandShipment>;
  update(id: number, data: LandShipmentRequest): Observable<LandShipment>;
  delete(id: number): Observable<void>;
}