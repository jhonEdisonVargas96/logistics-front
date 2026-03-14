import { inject, Injectable } from '@angular/core';
import { PORT_REPOSITORY } from '../../../infrastructure/di/tokens';
import { PortRepository } from '../../../core/domain/ports/port.repository';

@Injectable({ providedIn: 'root' })
export class GetAllPortsUseCase {
  private readonly repo = inject<PortRepository>(PORT_REPOSITORY);
  execute() { return this.repo.getAll(); }
}