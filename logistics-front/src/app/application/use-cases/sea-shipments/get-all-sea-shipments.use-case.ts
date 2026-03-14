import { inject, Injectable } from '@angular/core';
import { SEA_SHIPMENT_REPOSITORY } from '../../../infrastructure/di/tokens';
import { SeaShipmentRepository } from '../../../core/domain/ports/sea-shipment.repository';
import { Observable, map } from 'rxjs';
import { SeaShipment } from '../../../core/domain/models/sea-shipment.model';

@Injectable({ providedIn: 'root' })
export class GetAllSeaShipmentsUseCase {
  private readonly repo = inject<SeaShipmentRepository>(SEA_SHIPMENT_REPOSITORY);
  execute(): Observable<SeaShipment[]> {
  return this.repo.getAll().pipe(
    map(res => Array.isArray(res) ? res : (res as any).content ?? (res as any).data ?? [])
  );
}
}