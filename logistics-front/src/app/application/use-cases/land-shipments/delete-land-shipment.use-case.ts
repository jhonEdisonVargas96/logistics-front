import { inject, Injectable } from '@angular/core';
import { LAND_SHIPMENT_REPOSITORY } from '../../../infrastructure/di/tokens';
import { LandShipmentRepository } from '../../../core/domain/ports/land-shipment.repository';

@Injectable({ providedIn: 'root' })
export class DeleteLandShipmentUseCase {
  private readonly repo = inject<LandShipmentRepository>(LAND_SHIPMENT_REPOSITORY);
  execute(id: number) { return this.repo.delete(id); }
}