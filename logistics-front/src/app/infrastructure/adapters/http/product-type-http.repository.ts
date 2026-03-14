import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductTypeRepository } from '../../../core/domain/ports/product-type.repository';
import { ProductType, ProductTypeRequest } from '../../../core/domain/models/product-type.model';

@Injectable()
export class ProductTypeHttpRepository implements ProductTypeRepository {
  private readonly http = inject(HttpClient);
  private readonly base = 'http://localhost:8085/api/v1/product-types';

  getAll(): Observable<ProductType[]>                           { return this.http.get<ProductType[]>(this.base); }
  getById(id: number): Observable<ProductType>                  { return this.http.get<ProductType>(`${this.base}/${id}`); }
  create(data: ProductTypeRequest): Observable<ProductType>     { return this.http.post<ProductType>(this.base, data); }
  update(id: number, data: ProductTypeRequest): Observable<ProductType> { return this.http.put<ProductType>(`${this.base}/${id}`, data); }
  delete(id: number): Observable<void>                          { return this.http.delete<void>(`${this.base}/${id}`); }
}