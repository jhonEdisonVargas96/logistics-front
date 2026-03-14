import { inject, Injectable } from '@angular/core';
import { PORT_REPOSITORY } from '../../../infrastructure/di/tokens';
import { PortRepository } from '../../../core/domain/ports/port.repository';

@Injectable({ providedIn: 'root' })
export class DeletePortUseCase {
  private readonly repo = inject<PortRepository>(PORT_REPOSITORY);
  execute(id: number) { return this.repo.delete(id); }
}