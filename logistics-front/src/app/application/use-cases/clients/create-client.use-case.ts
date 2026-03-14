import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CLIENT_REPOSITORY } from '../../../infrastructure/di/tokens';
import { ClientRepository } from '../../../core/domain/ports/client.repository';
import { Client, ClientRequest } from '../../../core/domain/models/client.model';

@Injectable({ providedIn: 'root' })
export class CreateClientUseCase {
  private readonly repo = inject<ClientRepository>(CLIENT_REPOSITORY);
  execute(data: ClientRequest): Observable<Client> { return this.repo.create(data); }
}