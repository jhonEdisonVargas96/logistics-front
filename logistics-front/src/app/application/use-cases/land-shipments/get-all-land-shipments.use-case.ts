import { inject, Injectable } from '@angular/core';
import { LAND_SHIPMENT_REPOSITORY } from '../../../infrastructure/di/tokens';
import { LandShipmentRepository } from '../../../core/domain/ports/land-shipment.repository';
import { LandShipment } from '../../../core/domain/models/land-shipment.model';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GetAllLandShipmentsUseCase {
  private readonly repo = inject<LandShipmentRepository>(LAND_SHIPMENT_REPOSITORY);
  execute(): Observable<LandShipment[]> {
  return this.repo.getAll().pipe(
    map(res => Array.isArray(res) ? res : (res as any).content ?? (res as any).data ?? [])
  );
}
}