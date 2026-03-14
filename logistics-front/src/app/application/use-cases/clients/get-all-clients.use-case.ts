import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CLIENT_REPOSITORY } from '../../../infrastructure/di/tokens';
import { ClientRepository } from '../../../core/domain/ports/client.repository';
import { Client } from '../../../core/domain/models/client.model';

import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GetAllClientsUseCase {
  private readonly repo = inject<ClientRepository>(CLIENT_REPOSITORY);

  execute(): Observable<Client[]> {
    return this.repo.getAll().pipe(
      map(res => Array.isArray(res) ? res : (res as any).content ?? (res as any).data ?? [])
    );
  }
}