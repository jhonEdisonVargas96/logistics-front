import { Observable } from 'rxjs';
import { ProductType, ProductTypeRequest } from '../models/product-type.model';

export interface ProductTypeRepository {
  getAll(): Observable<ProductType[]>;
  getById(id: number): Observable<ProductType>;
  create(data: ProductTypeRequest): Observable<ProductType>;
  update(id: number, data: ProductTypeRequest): Observable<ProductType>;
  delete(id: number): Observable<void>;
}