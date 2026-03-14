import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Port } from '../../../core/domain/models/port.model';
import { CreatePortUseCase } from '../../../application/use-cases/ports/create-port.use-case';
import { DeletePortUseCase } from '../../../application/use-cases/ports/delete-port.use-case';
import { GetAllPortsUseCase } from '../../../application/use-cases/ports/get-all-ports.use-case';
import { UpdatePortUseCase } from '../../../application/use-cases/ports/update-port.use-case';

@Component({
    selector: 'app-ports',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="mb-0 fw-bold">Puertos</h4>
      <button class="btn btn-primary btn-sm" (click)="openCreate()">+ Nuevo puerto</button>
    </div>

    @if (loading()) {
      <div class="text-center py-5"><div class="spinner-border text-primary"></div></div>
    }
    @if (error()) {
      <div class="alert alert-danger">{{ error() }}</div>
    }

    <div class="table-responsive">
      <table class="table table-bordered table-hover align-middle">
        <thead class="table-dark">
          <tr>
            <th>#</th><th>Nombre</th><th>Ciudad</th><th>País</th><th>Tipo</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          @for (p of ports(); track p.id) {
            <tr>
              <td>{{ p.id }}</td>
              <td>{{ p.name }}</td>
              <td>{{ p.city }}</td>
              <td>{{ p.country }}</td>
              <td>
                <span class="badge"
                  [class.bg-success]="p.portType === 'N'"
                  [class.bg-info]="p.portType === 'I'">
                  {{ p.portType === 'N' ? 'Nacional' : 'Internacional' }}
                </span>
              </td>
              <td class="text-center">
                <button class="btn btn-warning btn-sm me-1" (click)="openEdit(p)">Editar</button>
                <button class="btn btn-danger btn-sm" (click)="confirmDelete(p)">Eliminar</button>
              </td>
            </tr>
          } @empty {
            <tr><td colspan="6" class="text-center text-muted">Sin registros</td></tr>
          }
        </tbody>
      </table>
    </div>

    <!-- Modal crear/editar -->
    <div class="modal fade" id="portModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingId() ? 'Editar' : 'Nuevo' }} puerto</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            @if (formError()) {
              <div class="alert alert-danger py-2 small">{{ formError() }}</div>
            }
            <form [formGroup]="form">
              <div class="mb-3">
                <label class="form-label small fw-medium">Nombre</label>
                <input type="text" class="form-control" formControlName="name"
                  [class.is-invalid]="isInvalid('name')"/>
                <div class="invalid-feedback">Requerido</div>
              </div>
              <div class="row">
                <div class="col mb-3">
                  <label class="form-label small fw-medium">Ciudad</label>
                  <input type="text" class="form-control" formControlName="city"
                    [class.is-invalid]="isInvalid('city')"/>
                  <div class="invalid-feedback">Requerido</div>
                </div>
                <div class="col mb-3">
                  <label class="form-label small fw-medium">País</label>
                  <input type="text" class="form-control" formControlName="country"
                    [class.is-invalid]="isInvalid('country')"/>
                  <div class="invalid-feedback">Requerido</div>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label small fw-medium">Tipo de puerto</label>
                <select class="form-select" formControlName="portType"
                  [class.is-invalid]="isInvalid('portType')">
                  <option value="">Seleccionar...</option>
                  <option value="N">Nacional</option>
                  <option value="I">Internacional</option>
                </select>
                <div class="invalid-feedback">Requerido</div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cancelar</button>
            <button class="btn btn-primary btn-sm" [disabled]="saving()" (click)="save()">
              @if (saving()) { <span class="spinner-border spinner-border-sm me-1"></span> }
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal eliminar -->
    <div class="modal fade" id="portDeleteModal" tabindex="-1">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmar</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">¿Eliminar <strong>{{ deletingItem()?.name }}</strong>?</div>
          <div class="modal-footer">
            <button class="btn btn-secondary btn-sm" data-bs-dismiss="modal">No</button>
            <button class="btn btn-danger btn-sm" (click)="deleteConfirmed()">Sí, eliminar</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PortsComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly getAll = inject(GetAllPortsUseCase);
    private readonly create = inject(CreatePortUseCase);
    private readonly update = inject(UpdatePortUseCase);
    private readonly deleteUC = inject(DeletePortUseCase);

    ports = signal<Port[]>([]);
    loading = signal(false);
    saving = signal(false);
    error = signal<string | null>(null);
    formError = signal<string | null>(null);
    editingId = signal<number | null>(null);
    deletingItem = signal<Port | null>(null);

    form = this.fb.group({
        name: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        portType: ['', Validators.required],
    });

    ngOnInit(): void { this.load(); }

    load(): void {
        this.loading.set(true);
        this.getAll.execute().subscribe({
            next: (d) => { this.ports.set(d); this.loading.set(false); },
            error: () => { this.error.set('Error al cargar'); this.loading.set(false); },
        });
    }

    openCreate(): void {
        this.editingId.set(null);
        this.form.reset();
        this.formError.set(null);
        this.getModal('portModal').then(m => m.show());
    }

    openEdit(p: Port): void {
        this.editingId.set(p.id);
        this.form.patchValue({ name: p.name, city: p.city, country: p.country, portType: p.portType });
        this.formError.set(null);
        this.getModal('portModal').then(m => m.show());
    }

    save(): void {
        if (this.form.invalid) { this.form.markAllAsTouched(); return; }
        this.saving.set(true);
        this.formError.set(null);
        const payload = this.form.getRawValue() as any;
        const id = this.editingId();
        const op$ = id ? this.update.execute(id, payload) : this.create.execute(payload);
        op$.subscribe({
            next: () => { this.saving.set(false); this.getModal('portModal').then(m => m.hide()); this.load(); },
            error: () => { this.formError.set('Error al guardar'); this.saving.set(false); },
        });
    }

    confirmDelete(p: Port): void {
        this.deletingItem.set(p);
        this.getModal('portDeleteModal').then(m => m.show());
    }

    deleteConfirmed(): void {
        const id = this.deletingItem()?.id;
        if (!id) return;
        this.deleteUC.execute(id).subscribe({
            next: () => { this.getModal('portDeleteModal').then(m => m.hide()); this.load(); },
            error: () => this.error.set('Error al eliminar'),
        });
    }

    isInvalid(f: string): boolean {
        const c = this.form.get(f);
        return !!(c?.invalid && c?.touched);
    }

    private async getModal(id: string): Promise<any> {
        const { Modal } = await import('bootstrap');
        return Modal.getOrCreateInstance(document.getElementById(id)!);
    }
}