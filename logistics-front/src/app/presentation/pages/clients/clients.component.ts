import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Client } from '../../../core/domain/models/client.model';
import { GetAllClientsUseCase } from '../../../application/use-cases/clients/get-all-clients.use-case';
import { CreateClientUseCase } from '../../../application/use-cases/clients/create-client.use-case';
import { UpdateClientUseCase } from '../../../application/use-cases/clients/update-client.use-case';
import { DeleteClientUseCase } from '../../../application/use-cases/clients/delete-client.use-case';

@Component({
    selector: 'app-clients',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="mb-0 fw-bold">Clientes</h4>
      <button class="btn btn-primary btn-sm" (click)="openCreate()">
        + Nuevo cliente
      </button>
    </div>

    @if (loading()) {
      <div class="text-center py-5">
        <div class="spinner-border text-primary"></div>
      </div>
    }

    @if (error()) {
      <div class="alert alert-danger">{{ error() }}</div>
    }

    <div class="table-responsive">
      <table class="table table-bordered table-hover align-middle">
        <thead class="table-dark">
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          @for (c of clients(); track c.id) {
            <tr>
              <td>{{ c.id }}</td>
              <td>{{ c.name }}</td>
              <td>{{ c.email }}</td>
              <td>{{ c.phone }}</td>
              <td class="text-center">
                <button class="btn btn-warning btn-sm me-1" (click)="openEdit(c)">Editar</button>
                <button class="btn btn-danger btn-sm" (click)="confirmDelete(c)">Eliminar</button>
              </td>
            </tr>
          } @empty {
            <tr><td colspan="5" class="text-center text-muted">Sin registros</td></tr>
          }
        </tbody>
      </table>
    </div>

    <!-- Modal crear/editar -->
    <div class="modal fade" id="clientModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingId() ? 'Editar' : 'Nuevo' }} cliente</h5>
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
              <div class="mb-3">
                <label class="form-label small fw-medium">Email</label>
                <input type="email" class="form-control" formControlName="email"
                  [class.is-invalid]="isInvalid('email')"/>
                <div class="invalid-feedback">Email inválido</div>
              </div>
              <div class="mb-3">
                <label class="form-label small fw-medium">Teléfono</label>
                <input type="text" class="form-control" formControlName="phone"
                  [class.is-invalid]="isInvalid('phone')"/>
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

    <!-- Modal confirmar eliminar -->
    <div class="modal fade" id="deleteModal" tabindex="-1">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmar</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            ¿Eliminar a <strong>{{ deletingClient()?.name }}</strong>?
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary btn-sm" data-bs-dismiss="modal">No</button>
            <button class="btn btn-danger btn-sm" (click)="deleteConfirmed()">Sí, eliminar</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ClientsComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly getAllClients = inject(GetAllClientsUseCase);
    private readonly createClient = inject(CreateClientUseCase);
    private readonly updateClient = inject(UpdateClientUseCase);
    private readonly deleteClient = inject(DeleteClientUseCase);

    clients = signal<Client[]>([]);
    loading = signal(false);
    saving = signal(false);
    error = signal<string | null>(null);
    formError = signal<string | null>(null);
    editingId = signal<number | null>(null);
    deletingClient = signal<Client | null>(null);

    form = this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
    });

    private modal!: any;
    private deleteModal!: any;

    ngOnInit(): void {
        this.load();
    }

    load(): void {
        this.loading.set(true);
        this.getAllClients.execute().subscribe({
            next: (data) => { this.clients.set(data); this.loading.set(false); },
            error: () => { this.error.set('Error al cargar clientes'); this.loading.set(false); },
        });
    }

openCreate(): void {
  this.editingId.set(null);
  this.form.reset();
  this.formError.set(null);
  this.getModal('clientModal').then(m => m.show());
}

openEdit(c: Client): void {
  this.editingId.set(c.id);
  this.form.patchValue({ name: c.name, email: c.email, phone: c.phone });
  this.formError.set(null);
  this.getModal('clientModal').then(m => m.show());
}

    save(): void {
        if (this.form.invalid) { this.form.markAllAsTouched(); return; }

        this.saving.set(true);
        this.formError.set(null);
        const payload = this.form.getRawValue() as any;
        const id = this.editingId();

        const op$ = id
            ? this.updateClient.execute(id, payload)
            : this.createClient.execute(payload);

        op$.subscribe({
            next: () => {
                this.saving.set(false);
                this.getModal('clientModal').then(m => m.hide());
                this.load();
            },
            error: () => {
                this.formError.set('Error al guardar. Verifica los datos.');
                this.saving.set(false);
            },
        });
    }

    confirmDelete(c: Client): void {
        this.deletingClient.set(c);
        this.getModal('deleteModal').then(m => m.show()); 
    }

    deleteConfirmed(): void {
        const id = this.deletingClient()?.id;
        if (!id) return;

        this.deleteClient.execute(id).subscribe({
            next: () => {
                this.getModal('deleteModal').then(m => m.hide()); 
                this.load();
            },
            error: () => this.error.set('Error al eliminar'),
        });
    }

    isInvalid(field: string): boolean {
        const c = this.form.get(field);
        return !!(c?.invalid && c?.touched);
    }

    private async getModal(id: string): Promise<any> {
        const { Modal } = await import('bootstrap');
        return Modal.getOrCreateInstance(document.getElementById(id)!);
    }
}