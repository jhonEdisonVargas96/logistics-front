import { Routes } from '@angular/router';
import { authGuard } from './infrastructure/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./presentation/pages/auth/login/login.component').then(m => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () => import('./presentation/pages/auth/register/register.component').then(m => m.RegisterComponent),
      },
    ],
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./presentation/layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    children: [
      { path: '', redirectTo: 'clients', pathMatch: 'full' },
      {
        path: 'clients',
        loadComponent: () => import('./presentation/pages/clients/clients.component').then(m => m.ClientsComponent),
      },
      {
        path: 'product-types',
        loadComponent: () => import('./presentation/pages/product-types/product-types.component').then(m => m.ProductTypesComponent),
      },
      {
        path: 'warehouses',
        loadComponent: () => import('./presentation/pages/warehouses/warehouses.component').then(m => m.WarehousesComponent),
      },
      {
        path: 'ports',
        loadComponent: () => import('./presentation/pages/ports/ports.component').then(m => m.PortsComponent),
      },
      {
        path: 'land-shipments',
        loadComponent: () => import('./presentation/pages/land-shipments/land-shipments.component').then(m => m.LandShipmentsComponent),
      },
      {
        path: 'sea-shipments',
        loadComponent: () => import('./presentation/pages/sea-shipments/sea-shipments.component').then(m => m.SeaShipmentsComponent),
      },
    ],
  },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
];