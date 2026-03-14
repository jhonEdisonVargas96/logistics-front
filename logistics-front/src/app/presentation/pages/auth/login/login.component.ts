import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginUseCase } from '../../../../application/use-cases/auth/login.use-case';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div class="card shadow-sm" style="width: 100%; max-width: 420px;">
        <div class="card-body p-4">

          <h4 class="card-title mb-1 fw-bold">Iniciar sesión</h4>
          <p class="text-muted small mb-4">Ingresa tus credenciales para continuar</p>

          @if (error()) {
            <div class="alert alert-danger alert-dismissible py-2" role="alert">
              <span class="small">{{ error() }}</span>
              <button type="button" class="btn-close btn-sm" (click)="error.set(null)"></button>
            </div>
          }

          <form [formGroup]="form" (ngSubmit)="submit()">
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
              class="btn btn-primary w-100"
              [disabled]="loading()"
            >
              @if (loading()) {
                <span class="spinner-border spinner-border-sm me-2"></span>
              }
              Entrar
            </button>
          </form>

          <hr class="my-3">
          <p class="text-center text-muted small mb-0">
            ¿No tienes cuenta?
            <a routerLink="/auth/register" class="text-decoration-none">Regístrate</a>
          </p>

        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly loginUseCase = inject(LoginUseCase);
  private readonly router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
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

    this.loginUseCase.execute(this.form.getRawValue() as any).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.error.set(err.status === 401 ? 'Credenciales incorrectas' : 'Error al iniciar sesión');
        this.loading.set(false);
      },
    });
  }
}