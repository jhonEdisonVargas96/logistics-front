import { inject, Injectable } from '@angular/core';
import { WAREHOUSE_REPOSITORY } from '../../../infrastructure/di/tokens';
import { WarehouseRepository } from '../../../core/domain/ports/warehouse.repository';

@Injectable({ providedIn: 'root' })
export class DeleteWarehouseUseCase {
  private readonly repo = inject<WarehouseRepository>(WAREHOUSE_REPOSITORY);
  execute(id: number) { return this.repo.delete(id); }
}