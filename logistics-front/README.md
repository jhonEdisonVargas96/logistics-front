# logistics-front

Frontend de gestión logística terrestre y marítima. Desarrollado con Angular 21 y Bootstrap 5, conectado a una API REST con autenticación JWT.

---

## Requisitos

- Node.js v18 o superior
- Angular CLI v21 — `npm install -g @angular/cli`
- Backend corriendo en `http://localhost:8085`

---

## Instalación

```bash
npm install
```

---

## Scripts

```bash
npm run start     # Servidor de desarrollo en localhost:3004
npm run build     # Build de producción
npm run watch     # Build en modo watch
npm test          # Pruebas unitarias
```

---

## Estructura

```
src/app/
├── core/domain/           # Modelos e interfaces (sin dependencias de Angular)
├── application/use-cases/ # Casos de uso
├── infrastructure/        # Adaptadores HTTP, guards e interceptores
└── presentation/          # Componentes y layout
```

---

## Módulos

| Ruta | Descripción |
|---|---|
| `/dashboard/clients` | Clientes |
| `/dashboard/product-types` | Tipos de producto |
| `/dashboard/warehouses` | Bodegas |
| `/dashboard/ports` | Puertos |
| `/dashboard/land-shipments` | Envíos terrestres (descuento 5% si cantidad > 10) |
| `/dashboard/sea-shipments` | Envíos marítimos (descuento 3% si cantidad > 10) |

---

## Configuración

La URL base de la API se define en cada repositorio HTTP dentro de `src/app/infrastructure/adapters/http/`. Por defecto apunta a `http://localhost:8085/api/v1`.

El backend debe tener CORS habilitado para `http://localhost:3004`.