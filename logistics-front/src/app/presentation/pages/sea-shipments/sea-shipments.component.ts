import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { SeaShipment } from '../../../core/domain/models/sea-shipment.model';
import { Client } from '../../../core/domain/models/client.model';
import { ProductType } from '../../../core/domain/models/product-type.model';
import { Port } from '../../../core/domain/models/port.model';
import { GetAllClientsUseCase } from '../../../application/use-cases/clients/get-all-clients.use-case';
import { GetAllProductTypesUseCase } from '../../../application/use-cases/product-types/get-all-product-types.use-case';
import { GetAllPortsUseCase } from '../../../application/use-cases/ports/get-all-ports.use-case';
import { GetAllSeaShipmentsUseCase } from '../../../application/use-cases/sea-shipments/get-all-sea-shipments.use-case';
import { CreateSeaShipmentUseCase } from '../../../application/use-cases/sea-shipments/create-sea-shipment.use-case';
import { DeleteSeaShipmentUseCase } from '../../../application/use-cases/sea-shipments/delete-sea-shipment.use-case';
import { UpdateSeaShipmentUseCase } from '../../../application/use-cases/sea-shipments/update-sea-shipment.use-case';

declare const bootstrap: any;

@Component({
  selector: 'app-sea-shipments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="mb-0 fw-bold">Envíos marítimos</h4>
      <button class="btn btn-primary btn-sm" (click)="openCreate()">+ Nuevo envío</button>
    </div>

    @if (loading()) {
      <div class="text-center py-5"><div class="spinner-border text-primary"></div></div>
    }
    @if (error()) {
      <div class="alert alert-danger">{{ error() }}</div>
    }

    <div class="table-responsive">
      <table class="table table-bordered table-hover align-middle small">
        <thead class="table-dark">
          <tr>
            <th>#</th>
            <th>N° Guía</th>
            <th>Cliente</th>
            <th>Tipo producto</th>
            <th>Puerto</th>
            <th>Cantidad</th>
            <th>N° Flota</th>
            <th>Entrega</th>
            <th>Precio base</th>
            <th>Precio final</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          @for (s of shipments(); track s.id) {
            <tr>
              <td>{{ s.id }}</td>
              <td>
                <code>{{ s.trackingNumber }}</code>
              </td>
              <td>{{ clientName(s.clientId) }}</td>
              <td>{{ productTypeName(s.productTypeId) }}</td>
              <td>{{ portName(s.portId) }}</td>
              <td>{{ s.quantity }}</td>
              <td>{{ s.fleetNumber }}</td>
              <td>{{ s.deliveryDate }}</td>
              <td>{{ s.basePrice | number: '1.0-0' }}</td>
              <td>
                @if (s.quantity > 10) {
                  <span class="text-success fw-medium">
                    {{ s.finalPrice ?? s.basePrice * 0.97 | number: '1.0-0' }}
                    <small class="badge bg-success ms-1">-3%</small>
                  </span>
                } @else {
                  {{ s.basePrice | number: '1.0-0' }}
                }
              </td>
              <td class="text-center">
                <button class="btn btn-warning btn-sm me-1" (click)="openEdit(s)">Editar</button>
                <button class="btn btn-danger btn-sm" (click)="confirmDelete(s)">Eliminar</button>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="11" class="text-center text-muted">Sin registros</td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <!-- Modal crear/editar -->
    <div class="modal fade" id="seaModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingId() ? 'Editar' : 'Nuevo' }} envío marítimo</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            @if (formError()) {
              <div class="alert alert-danger py-2 small">{{ formError() }}</div>
            }
            <form [formGroup]="form">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label small fw-medium">Cliente</label>
                  <select
                    class="form-select"
                    formControlName="clientId"
                    [class.is-invalid]="isInvalid('clientId')"
                  >
                    <option value="">Seleccionar...</option>
                    @for (c of clients(); track c.id) {
                      <option [value]="c.id">{{ c.name }}</option>
                    }
                  </select>
                  <div class="invalid-feedback">Requerido</div>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label small fw-medium">Tipo de producto</label>
                  <select
                    class="form-select"
                    formControlName="productTypeId"
                    [class.is-invalid]="isInvalid('productTypeId')"
                  >
                    <option value="">Seleccionar...</option>
                    @for (pt of productTypes(); track pt.id) {
                      <option [value]="pt.id">{{ pt.name }}</option>
                    }
                  </select>
                  <div class="invalid-feedback">Requerido</div>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label small fw-medium">Puerto</label>
                  <select
                    class="form-select"
                    formControlName="portId"
                    [class.is-invalid]="isInvalid('portId')"
                  >
                    <option value="">Seleccionar...</option>
                    @for (p of ports(); track p.id) {
                      <option [value]="p.id">
                        {{ p.name }} — {{ p.portType === 'N' ? 'Nacional' : 'Internacional' }}
                      </option>
                    }
                  </select>
                  <div class="invalid-feedback">Requerido</div>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label small fw-medium">Cantidad</label>
                  <input
                    type="number"
                    class="form-control"
                    formControlName="quantity"
                    min="1"
                    [class.is-invalid]="isInvalid('quantity')"
                  />
                  <div class="invalid-feedback">Mínimo 1</div>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label small fw-medium">Fecha de entrega</label>
                  <input
                    type="date"
                    class="form-control"
                    formControlName="deliveryDate"
                    [class.is-invalid]="isInvalid('deliveryDate')"
                  />
                  <div class="invalid-feedback">Requerido</div>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label small fw-medium">
                    N° de flota
                    <small class="text-muted">(MAR1234A)</small>
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    formControlName="fleetNumber"
                    placeholder="MAR1234A"
                    maxlength="8"
                    [class.is-invalid]="isInvalid('fleetNumber')"
                  />
                  <div class="invalid-feedback">Formato: 3 letras + 4 números + 1 letra</div>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label small fw-medium">
                    N° de guía
                    <small class="text-muted">(10 caracteres)</small>
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    formControlName="trackingNumber"
                    placeholder="MAR1234567"
                    maxlength="10"
                    [class.is-invalid]="isInvalid('trackingNumber')"
                  />
                  <div class="invalid-feedback">10 caracteres alfanuméricos</div>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label small fw-medium">Precio base</label>
                  <input
                    type="number"
                    class="form-control"
                    formControlName="basePrice"
                    min="0"
                    [class.is-invalid]="isInvalid('basePrice')"
                  />
                  <div class="invalid-feedback">Requerido</div>
                </div>
              </div>

              <!-- Preview descuento -->
              @if (previewQuantity > 10 && previewBasePrice > 0) {
                <div class="alert alert-success py-2 small">
                  Descuento del 3% aplicado — Precio final:
                  <strong>{{ previewBasePrice * 0.97 | number: '1.0-0' }}</strong>
                </div>
              }
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cancelar</button>
            <button class="btn btn-primary btn-sm" [disabled]="saving()" (click)="save()">
              @if (saving()) {
                <span class="spinner-border spinner-border-sm me-1"></span>
              }
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal eliminar -->
    <div class="modal fade" id="seaDeleteModal" tabindex="-1">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmar</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            ¿Eliminar envío <strong>{{ deletingItem()?.trackingNumber }}</strong
            >?
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
export class SeaShipmentsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly getAll = inject(GetAllSeaShipmentsUseCase);
  private readonly create = inject(CreateSeaShipmentUseCase);
  private readonly update = inject(UpdateSeaShipmentUseCase);
  private readonly deleteUC = inject(DeleteSeaShipmentUseCase);
  private readonly getAllClients = inject(GetAllClientsUseCase);
  private readonly getAllPT = inject(GetAllProductTypesUseCase);
  private readonly getAllPorts = inject(GetAllPortsUseCase);

  get previewQuantity(): number {
    return this.form.get('quantity')?.value ?? 0;
  }
  get previewBasePrice(): number {
    return this.form.get('basePrice')?.value ?? 0;
  }

  shipments = signal<SeaShipment[]>([]);
  clients = signal<Client[]>([]);
  productTypes = signal<ProductType[]>([]);
  ports = signal<Port[]>([]);
  loading = signal(false);
  saving = signal(false);
  error = signal<string | null>(null);
  formError = signal<string | null>(null);
  editingId = signal<number | null>(null);
  deletingItem = signal<SeaShipment | null>(null);

  form = this.fb.group({
    clientId: ['', Validators.required],
    productTypeId: ['', Validators.required],
    portId: ['', Validators.required],
    quantity: [null as number | null, [Validators.required, Validators.min(1)]],
    deliveryDate: ['', Validators.required],
    trackingNumber: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{10}$/)]],
    fleetNumber: [
      '',
      [Validators.required, Validators.pattern(/^[a-zA-Z]{3}[0-9]{4}[a-zA-Z]{1}$/)],
    ],
    basePrice: [null as number | null, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    this.loading.set(true);
    forkJoin({
      shipments: this.getAll.execute(),
      clients: this.getAllClients.execute(),
      productTypes: this.getAllPT.execute(),
      ports: this.getAllPorts.execute(),
    }).subscribe({
      next: ({ shipments, clients, productTypes, ports }) => {
        this.shipments.set(shipments);
        this.clients.set(clients);
        this.productTypes.set(productTypes);
        this.ports.set(ports);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar datos');
        this.loading.set(false);
      },
    });
  }

  load(): void {
    this.getAll.execute().subscribe({
      next: (d) => this.shipments.set(d),
      error: () => this.error.set('Error al recargar'),
    });
  }

  clientName(id: number): string {
    return this.clients().find((c) => c.id === id)?.name ?? String(id);
  }
  productTypeName(id: number): string {
    return this.productTypes().find((p) => p.id === id)?.name ?? String(id);
  }
  portName(id: number): string {
    return this.ports().find((p) => p.id === id)?.name ?? String(id);
  }

  openCreate(): void {
    this.editingId.set(null);
    this.form.reset();
    this.formError.set(null);
    this.getModal('seaModal').show();
  }

  openEdit(s: SeaShipment): void {
    this.editingId.set(s.id);
    this.form.patchValue({
      clientId: String(s.clientId),
      productTypeId: String(s.productTypeId),
      portId: String(s.portId),
      quantity: s.quantity,
      deliveryDate: s.deliveryDate,
      trackingNumber: s.trackingNumber,
      fleetNumber: s.fleetNumber,
      basePrice: s.basePrice,
    });
    this.formError.set(null);
    this.getModal('seaModal').show();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.formError.set(null);
    const raw = this.form.getRawValue();
    const payload = {
      ...raw,
      clientId: Number(raw.clientId),
      productTypeId: Number(raw.productTypeId),
      portId: Number(raw.portId),
    } as any;
    const id = this.editingId();
    const op$ = id ? this.update.execute(id, payload) : this.create.execute(payload);
    op$.subscribe({
      next: () => {
        this.saving.set(false);
        this.getModal('seaModal').hide();
        this.load();
      },
      error: () => {
        this.formError.set('Error al guardar. Verifica los datos.');
        this.saving.set(false);
      },
    });
  }

  confirmDelete(s: SeaShipment): void {
    this.deletingItem.set(s);
    this.getModal('seaDeleteModal').show();
  }

  deleteConfirmed(): void {
    const id = this.deletingItem()?.id;
    if (!id) return;
    this.deleteUC.execute(id).subscribe({
      next: () => {
        this.getModal('seaDeleteModal').hide();
        this.load();
      },
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
