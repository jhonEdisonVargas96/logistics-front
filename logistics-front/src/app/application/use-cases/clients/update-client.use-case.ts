import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CLIENT_REPOSITORY } from '../../../infrastructure/di/tokens';
import { ClientRepository } from '../../../core/domain/ports/client.repository';
import { Client, ClientRequest } from '../../../core/domain/models/client.model';

@Injectable({ providedIn: 'root' })
export class UpdateClientUseCase {
  private readonly repo = inject<ClientRepository>(CLIENT_REPOSITORY);
  execute(id: number, data: ClientRequest): Observable<Client> { return this.repo.update(id, data); }
}