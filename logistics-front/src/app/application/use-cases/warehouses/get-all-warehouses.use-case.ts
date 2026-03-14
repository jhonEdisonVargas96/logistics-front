import { inject, Injectable } from '@angular/core';
import { WAREHOUSE_REPOSITORY } from '../../../infrastructure/di/tokens';
import { WarehouseRepository } from '../../../core/domain/ports/warehouse.repository';
import { map, Observable } from 'rxjs';
import { Warehouse } from '../../../core/domain/models/warehouse.model';

@Injectable({ providedIn: 'root' })
export class GetAllWarehousesUseCase {
  private readonly repo = inject<WarehouseRepository>(WAREHOUSE_REPOSITORY);
    execute(): Observable<Warehouse[]> {
    return this.repo.getAll().pipe(
      map(res => Array.isArray(res) ? res : (res as any).content ?? (res as any).data ?? [])
    );
  }
}
