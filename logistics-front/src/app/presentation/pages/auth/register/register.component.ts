import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegisterUseCase } from '../../../../application/use-cases/auth/register.use-case';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div class="card shadow-sm" style="width: 100%; max-width: 420px;">
        <div class="card-body p-4">

          <h4 class="card-title mb-1 fw-bold">Crear cuenta</h4>
          <p class="text-muted small mb-4">Completa el formulario para registrarte</p>

          @if (error()) {
            <div class="alert alert-danger alert-dismissible py-2" role="alert">
              <span class="small">{{ error() }}</span>
              <button type="button" class="btn-close btn-sm" (click)="error.set(null)"></button>
            </div>
          }

          @if (success()) {
            <div class="alert alert-success py-2">
              <span class="small">Cuenta creada, redirigiendo...</span>
            </div>
          }

          <form [formGroup]="form" (ngSubmit)="submit()">
            <div class="mb-3">
              <label class="form-label small fw-medium">Nombre de usuario</label>
              <input
                type="text"
                class="form-control"
                formControlName="username"
                placeholder="Tu nombre"
                [class.is-invalid]="isInvalid('username')"
              />
              @if (isInvalid('username')) {
                <div class="invalid-feedback">El nombre es requerido</div>
              }
            </div>

            <div class="mb-3">
              <label class="form-label small fw-medium">Email</label>
              <input
                type="email"
                class="form-control"
                formControlName="email"
                placeholder="correo@ejemplo.com"
                [class.is-invalid]="isInvalid('email')"
              />
              @if (isInvalid('email')) {
                <div class="invalid-feedback">Ingresa un email válido</div>
              }
            </div>

            <div class="mb-4">
              <label class="form-label small fw-medium">Contraseña</label>
              <input
                type="password"
                class="form-control"
                formControlName="password"
                placeholder="••••••••"
                [class.is-invalid]="isInvalid('password')"
              />
              @if (isInvalid('password')) {
                <div class="invalid-feedback">Mínimo 6 caracteres</div>
              }
            </div>

            <button
              type="submit"
              class="btn btn-success w-100"
              [disabled]="loading()"
            >
              @if (loading()) {
                <span class="spinner-border spinner-border-sm me-2"></span>
              }
              Registrarse
            </button>
          </form>

          <hr class="my-3">
          <p class="text-center text-muted small mb-0">
            ¿Ya tienes cuenta?
            <a routerLink="/auth/login" class="text-decoration-none">Inicia sesión</a>
          </p>

        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly registerUseCase = inject(RegisterUseCase);
  private readonly router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  form = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.registerUseCase.execute(this.form.getRawValue() as any).subscribe({
      next: () => {
        this.success.set(true);
        setTimeout(() => this.router.navigate(['/dashboard']), 1000);
      },
      error: (err) => {
        this.error.set(err.status === 409 ? 'El email ya está en uso' : 'Error al registrarse');
        this.loading.set(false);
      },
    });
  }
}