import { inject, Injectable } from '@angular/core';
import { PRODUCT_TYPE_REPOSITORY } from '../../../infrastructure/di/tokens';
import { ProductTypeRepository } from '../../../core/domain/ports/product-type.repository';

@Injectable({ providedIn: 'root' })
export class GetAllProductTypesUseCase {
  private readonly repo = inject<ProductTypeRepository>(PRODUCT_TYPE_REPOSITORY);
  execute() { return this.repo.getAll(); }
}