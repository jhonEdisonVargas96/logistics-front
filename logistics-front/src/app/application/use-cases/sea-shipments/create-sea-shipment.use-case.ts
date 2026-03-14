import { inject, Injectable } from '@angular/core';
import { SEA_SHIPMENT_REPOSITORY } from '../../../infrastructure/di/tokens';
import { SeaShipmentRepository } from '../../../core/domain/ports/sea-shipment.repository';
import { SeaShipmentRequest } from '../../../core/domain/models/sea-shipment.model';

@Injectable({ providedIn: 'root' })
export class CreateSeaShipmentUseCase {
  private readonly repo = inject<SeaShipmentRepository>(SEA_SHIPMENT_REPOSITORY);
  execute(data: SeaShipmentRequest) { return this.repo.create(data); }
}