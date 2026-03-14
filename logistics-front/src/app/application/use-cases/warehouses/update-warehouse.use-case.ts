import { inject, Injectable } from '@angular/core';
import { WAREHOUSE_REPOSITORY } from '../../../infrastructure/di/tokens';
import { WarehouseRepository } from '../../../core/domain/ports/warehouse.repository';
import { WarehouseRequest } from '../../../core/domain/models/warehouse.model';

@Injectable({ providedIn: 'root' })
export class UpdateWarehouseUseCase {
  private readonly repo = inject<WarehouseRepository>(WAREHOUSE_REPOSITORY);
  execute(id: number, data: WarehouseRequest) { return this.repo.update(id, data); }
}