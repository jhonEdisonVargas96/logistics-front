import { inject, Injectable } from '@angular/core';
import { PRODUCT_TYPE_REPOSITORY } from '../../../infrastructure/di/tokens';
import { ProductTypeRepository } from '../../../core/domain/ports/product-type.repository';

@Injectable({ providedIn: 'root' })
export class DeleteProductTypeUseCase {
  private readonly repo = inject<ProductTypeRepository>(PRODUCT_TYPE_REPOSITORY);
  execute(id: number) { return this.repo.delete(id); }
}