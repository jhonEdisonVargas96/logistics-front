import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductType } from '../../../core/domain/models/product-type.model';
import { CreateProductTypeUseCase } from '../../../application/use-cases/product-types/create-product-type.use-case';
import { DeleteProductTypeUseCase } from '../../../application/use-cases/product-types/delete-product-type.use-case';
import { GetAllProductTypesUseCase } from '../../../application/use-cases/product-types/get-all-product-types.use-case';
import { UpdateProductTypeUseCase } from '../../../application/use-cases/product-types/update-product-type.use-case';

declare const bootstrap: any;

@Component({
  selector: 'app-product-types',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="mb-0 fw-bold">Tipos de producto</h4>
      <button class="btn btn-primary btn-sm" (click)="openCreate()">+ Nuevo tipo</button>
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
            <th>#</th><th>Nombre</th><th>Descripción</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          @for (pt of productTypes(); track pt.id) {
            <tr>
              <td>{{ pt.id }}</td>
              <td>{{ pt.name }}</td>
              <td>{{ pt.description }}</td>
              <td class="text-center">
                <button class="btn btn-warning btn-sm me-1" (click)="openEdit(pt)">Editar</button>
                <button class="btn btn-danger btn-sm" (click)="confirmDelete(pt)">Eliminar</button>
              </td>
            </tr>
          } @empty {
            <tr><td colspan="4" class="text-center text-muted">Sin registros</td></tr>
          }
        </tbody>
      </table>
    </div>

    <!-- Modal crear/editar -->
    <div class="modal fade" id="ptModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingId() ? 'Editar' : 'Nuevo' }} tipo de producto</h5>
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
                <label class="form-label small fw-medium">Descripción</label>
                <textarea class="form-control" formControlName="description" rows="3"
                  [class.is-invalid]="isInvalid('description')"></textarea>
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
    <div class="modal fade" id="ptDeleteModal" tabindex="-1">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmar</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            ¿Eliminar <strong>{{ deletingItem()?.name }}</strong>?
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
export class ProductTypesComponent implements OnInit {
  private readonly fb        = inject(FormBuilder);
  private readonly getAll    = inject(GetAllProductTypesUseCase);
  private readonly create    = inject(CreateProductTypeUseCase);
  private readonly update    = inject(UpdateProductTypeUseCase);
  private readonly deleteUC  = inject(DeleteProductTypeUseCase);

  productTypes  = signal<ProductType[]>([]);
  loading       = signal(false);
  saving        = signal(false);
  error         = signal<string | null>(null);
  formError     = signal<string | null>(null);
  editingId     = signal<number | null>(null);
  deletingItem  = signal<ProductType | null>(null);

  form = this.fb.group({
    name:        ['', Validators.required],
    description: ['', Validators.required],
  });

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.getAll.execute().subscribe({
      next: (d) => { this.productTypes.set(d); this.loading.set(false); },
      error: ()  => { this.error.set('Error al cargar'); this.loading.set(false); },
    });
  }

  openCreate(): void {
    this.editingId.set(null);
    this.form.reset();
    this.formError.set(null);
    this.getModal('ptModal').show();
  }

  openEdit(pt: ProductType): void {
    this.editingId.set(pt.id);
    this.form.patchValue({ name: pt.name, description: pt.description });
    this.formError.set(null);
    this.getModal('ptModal').show();
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    this.formError.set(null);
    const payload = this.form.getRawValue() as any;
    const id = this.editingId();
    const op$ = id ? this.update.execute(id, payload) : this.create.execute(payload);
    op$.subscribe({
      next: () => { this.saving.set(false); this.getModal('ptModal').hide(); this.load(); },
      error: () => { this.formError.set('Error al guardar'); this.saving.set(false); },
    });
  }

  confirmDelete(pt: ProductType): void {
    this.deletingItem.set(pt);
    this.getModal('ptDeleteModal').show();
  }

  deleteConfirmed(): void {
    const id = this.deletingItem()?.id;
    if (!id) return;
    this.deleteUC.execute(id).subscribe({
      next: () => { this.getModal('ptDeleteModal').hide(); this.load(); },
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