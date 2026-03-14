import { inject, Injectable } from '@angular/core';
import { LAND_SHIPMENT_REPOSITORY } from '../../../infrastructure/di/tokens';
import { LandShipmentRepository } from '../../../core/domain/ports/land-shipment.repository';
import { LandShipmentRequest } from '../../../core/domain/models/land-shipment.model';

@Injectable({ providedIn: 'root' })
export class CreateLandShipmentUseCase {
  private readonly repo = inject<LandShipmentRepository>(LAND_SHIPMENT_REPOSITORY);
  execute(data: LandShipmentRequest) { return this.repo.create(data); }
}