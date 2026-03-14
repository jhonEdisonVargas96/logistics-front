import { inject, Injectable } from '@angular/core';
import { PORT_REPOSITORY } from '../../../infrastructure/di/tokens';
import { PortRepository } from '../../../core/domain/ports/port.repository';
import { Observable, map } from 'rxjs';
import { Port } from '../../../core/domain/models/port.model';

@Injectable({ providedIn: 'root' })
export class GetAllPortsUseCase {
  private readonly repo = inject<PortRepository>(PORT_REPOSITORY);
execute(): Observable<Port[]> {
  return this.repo.getAll().pipe(
    map(res => Array.isArray(res) ? res : (res as any).content ?? (res as any).data ?? [])
  );
}
}