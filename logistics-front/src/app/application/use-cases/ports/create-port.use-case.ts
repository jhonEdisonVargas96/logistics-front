import { inject, Injectable } from '@angular/core';
import { PORT_REPOSITORY } from '../../../infrastructure/di/tokens';
import { PortRepository } from '../../../core/domain/ports/port.repository';
import { PortRequest } from '../../../core/domain/models/port.model';

@Injectable({ providedIn: 'root' })
export class CreatePortUseCase {
  private readonly repo = inject<PortRepository>(PORT_REPOSITORY);
  execute(data: PortRequest) { return this.repo.create(data); }
}