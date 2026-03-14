import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PRODUCT_TYPE_REPOSITORY } from '../../../infrastructure/di/tokens';
import { ProductTypeRepository } from '../../../core/domain/ports/product-type.repository';
import { ProductType } from '../../../core/domain/models/product-type.model';

@Injectable({ providedIn: 'root' })
export class GetAllProductTypesUseCase {
  private readonly repo = inject<ProductTypeRepository>(PRODUCT_TYPE_REPOSITORY);

  execute(): Observable<ProductType[]> {
    return this.repo.getAll().pipe(
      map(res => Array.isArray(res) ? res : (res as any).content ?? (res as any).data ?? [])
    );
  }
}