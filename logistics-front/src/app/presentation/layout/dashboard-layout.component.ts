import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand fw-bold" routerLink="/dashboard">
          Logistics
        </a>
        <button class="navbar-toggler" type="button"
          data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navMenu">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" routerLink="/dashboard/clients"
                routerLinkActive="active">Clientes</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/dashboard/product-types"
                routerLinkActive="active">Tipos de producto</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/dashboard/warehouses"
                routerLinkActive="active">Bodegas</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/dashboard/ports"
                routerLinkActive="active">Puertos</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/dashboard/land-shipments"
                routerLinkActive="active">Envíos terrestres</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/dashboard/sea-shipments"
                routerLinkActive="active">Envíos marítimos</a>
            </li>
          </ul>

          <ul class="navbar-nav">
            <li class="nav-item">
              <button class="btn btn-outline-light btn-sm" (click)="logout()">
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="container-fluid py-4">
      <router-outlet />
    </main>
  `,
})
export class DashboardLayoutComponent {
  private readonly router = inject(Router);

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/auth/login']);
  }
}