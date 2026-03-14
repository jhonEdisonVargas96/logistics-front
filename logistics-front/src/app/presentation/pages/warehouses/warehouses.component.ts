import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Warehouse } from '../../../core/domain/models/warehouse.model';
import { GetAllWarehousesUseCase } from '../../../application/use-cases/warehouses/get-all-warehouses.use-case';
import { CreateWarehouseUseCase }  from '../../../application/use-cases/warehouses/create-warehouse.use-case';
import { UpdateWarehouseUseCase }  from '../../../application/use-cases/warehouses/update-warehouse.use-case';
import { DeleteWarehouseUseCase }  from '../../../application/use-cases/warehouses/delete-warehouse.use-case';

declare const bootstrap: any;

@Component({
  selector: 'app-warehouses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="mb-0 fw-bold">Bodegas</h4>
      <button class="btn btn-primary btn-sm" (click)="openCreate()">+ Nueva bodega</button>
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
            <th>#</th><th>Nombre</th><th>Dirección</th><th>Ciudad</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          @for (w of warehouses(); track w.id) {
            <tr>
              <td>{{ w.id }}</td>
              <td>{{ w.name }}</td>
              <td>{{ w.address }}</td>
              <td>{{ w.city }}</td>
              <td class="text-center">
                <button class="btn btn-warning btn-sm me-1" (click)="openEdit(w)">Editar</button>
                <button class="btn btn-danger btn-sm" (click)="confirmDelete(w)">Eliminar</button>
              </td>
            </tr>
          } @empty {
            <tr><td colspan="5" class="text-center text-muted">Sin registros</td></tr>
          }
        </tbody>
      </table>
    </div>

    <!-- Modal crear/editar -->
    <div class="modal fade" id="warehouseModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingId() ? 'Editar' : 'Nueva' }} bodega</h5>
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
                <label class="form-label small fw-medium">Dirección</label>
                <input type="text" class="form-control" formControlName="address"
                  [class.is-invalid]="isInvalid('address')"/>
                <div class="invalid-feedback">Requerido</div>
              </div>
              <div class="mb-3">
                <label class="form-label small fw-medium">Ciudad</label>
                <input type="text" class="form-control" formControlName="city"
                  [class.is-invalid]="isInvalid('city')"/>
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
    <div class="modal fade" id="warehouseDeleteModal" tabindex="-1">
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
export class WarehousesComponent implements OnInit {
  private readonly fb       = inject(FormBuilder);
  private readonly getAll   = inject(GetAllWarehousesUseCase);
  private readonly create   = inject(CreateWarehouseUseCase);
  private readonly update   = inject(UpdateWarehouseUseCase);
  private readonly deleteUC = inject(DeleteWarehouseUseCase);

  warehouses   = signal<Warehouse[]>([]);
  loading      = signal(false);
  saving       = signal(false);
  error        = signal<string | null>(null);
  formError    = signal<string | null>(null);
  editingId    = signal<number | null>(null);
  deletingItem = signal<Warehouse | null>(null);

  form = this.fb.group({
    name:    ['', Validators.required],
    address: ['', Validators.required],
    city:    ['', Validators.required],
  });

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.getAll.execute().subscribe({
      next: (d) => { this.warehouses.set(d); this.loading.set(false); },
      error: ()  => { this.error.set('Error al cargar'); this.loading.set(false); },
    });
  }

  openCreate(): void {
    this.editingId.set(null);
    this.form.reset();
    this.formError.set(null);
    this.getModal('warehouseModal').show();
  }

  openEdit(w: Warehouse): void {
    this.editingId.set(w.id);
    this.form.patchValue({ name: w.name, address: w.address, city: w.city });
    this.formError.set(null);
    this.getModal('warehouseModal').show();
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    this.formError.set(null);
    const payload = this.form.getRawValue() as any;
    const id = this.editingId();
    const op$ = id ? this.update.execute(id, payload) : this.create.execute(payload);
    op$.subscribe({
      next: () => { this.saving.set(false); this.getModal('warehouseModal').hide(); this.load(); },
      error: () => { this.formError.set('Error al guardar'); this.saving.set(false); },
    });
  }

  confirmDelete(w: Warehouse): void {
    this.deletingItem.set(w);
    this.getModal('warehouseDeleteModal').show();
  }

  deleteConfirmed(): void {
    const id = this.deletingItem()?.id;
    if (!id) return;
    this.deleteUC.execute(id).subscribe({
      next: () => { this.getModal('warehouseDeleteModal').hide(); this.load(); },
      error: () => this.error.set('Error al eliminar'),
    });
  }

  isInvalid(f: string): boolean {
    const c = this.form.get(f);
    return !!(c?.invalid && c?.touched);
  }

  private getModal(id: string): any {
    return bootstrap.Modal.getOrCreateInstance(document.getElementById(id)!);
  }
}