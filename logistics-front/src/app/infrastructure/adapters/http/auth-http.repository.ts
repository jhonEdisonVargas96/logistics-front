import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthRepository } from '../../../core/domain/ports/auth.repository';
import { AuthResponse, LoginRequest, RegisterRequest } from '../../../core/domain/models/auth.model';
import { environment } from '../../../../environments/environment';

@Injectable()
export class AuthHttpRepository implements AuthRepository {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/auth`;

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/login`, request);
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/register`, request);
  }
}