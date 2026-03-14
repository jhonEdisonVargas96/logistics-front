import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AUTH_REPOSITORY } from '../../../infrastructure/di/tokens';
import { AuthRepository } from '../../../core/domain/ports/auth.repository';
import { AuthResponse, RegisterRequest } from '../../../core/domain/models/auth.model';

@Injectable({ providedIn: 'root' })
export class RegisterUseCase {
  private readonly repo = inject<AuthRepository>(AUTH_REPOSITORY);

  execute(request: RegisterRequest): Observable<AuthResponse> {
    return this.repo.register(request).pipe(
      tap(({ token }) => localStorage.setItem('token', token))
    );
  }
}