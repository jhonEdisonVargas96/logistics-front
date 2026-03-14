import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AUTH_REPOSITORY } from '../../../infrastructure/di/tokens';
import { AuthRepository } from '../../../core/domain/ports/auth.repository';
import { AuthResponse, LoginRequest } from '../../../core/domain/models/auth.model';

@Injectable({ providedIn: 'root' })
export class LoginUseCase {
  private readonly repo = inject<AuthRepository>(AUTH_REPOSITORY);

  execute(request: LoginRequest): Observable<AuthResponse> {
    return this.repo.login(request).pipe(
      tap(({ token }) => localStorage.setItem('token', token))
    );
  }
}