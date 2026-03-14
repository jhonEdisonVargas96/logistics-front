import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CLIENT_REPOSITORY } from '../../../infrastructure/di/tokens';
import { ClientRepository } from '../../../core/domain/ports/client.repository';

@Injectable({ providedIn: 'root' })
export class DeleteClientUseCase {
  private readonly repo = inject<ClientRepository>(CLIENT_REPOSITORY);
  execute(id: number): Observable<void> { return this.repo.delete(id); }
}