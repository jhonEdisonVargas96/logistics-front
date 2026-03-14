import { inject, Injectable } from '@angular/core';
import { PRODUCT_TYPE_REPOSITORY } from '../../../infrastructure/di/tokens';
import { ProductTypeRepository } from '../../../core/domain/ports/product-type.repository';
import { ProductTypeRequest } from '../../../core/domain/models/product-type.model';

@Injectable({ providedIn: 'root' })
export class CreateProductTypeUseCase {
  private readonly repo = inject<ProductTypeRepository>(PRODUCT_TYPE_REPOSITORY);
  execute(data: ProductTypeRequest) { return this.repo.create(data); }
}