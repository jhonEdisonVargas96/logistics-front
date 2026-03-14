import { inject, Injectable } from '@angular/core';
import { SEA_SHIPMENT_REPOSITORY } from '../../../infrastructure/di/tokens';
import { SeaShipmentRepository } from '../../../core/domain/ports/sea-shipment.repository';

@Injectable({ providedIn: 'root' })
export class DeleteSeaShipmentUseCase {
  private readonly repo = inject<SeaShipmentRepository>(SEA_SHIPMENT_REPOSITORY);
  execute(id: number) { return this.repo.delete(id); }
}