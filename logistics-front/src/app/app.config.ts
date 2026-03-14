import { ApplicationConfig } from '@angular/core';
import { provideRouter }     from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { jwtInterceptor } from './infrastructure/interceptors/jwt.interceptor';

import { AUTH_REPOSITORY }          from './infrastructure/di/tokens';
import { CLIENT_REPOSITORY }        from './infrastructure/di/tokens';
import { PRODUCT_TYPE_REPOSITORY }  from './infrastructure/di/tokens';
import { WAREHOUSE_REPOSITORY }     from './infrastructure/di/tokens';
import { PORT_REPOSITORY }          from './infrastructure/di/tokens';
import { LAND_SHIPMENT_REPOSITORY } from './infrastructure/di/tokens';
import { SEA_SHIPMENT_REPOSITORY }  from './infrastructure/di/tokens';

import { AuthHttpRepository }         from './infrastructure/adapters/http/auth-http.repository';
import { ClientHttpRepository }       from './infrastructure/adapters/http/client-http.repository';
import { ProductTypeHttpRepository }  from './infrastructure/adapters/http/product-type-http.repository';
import { WarehouseHttpRepository }    from './infrastructure/adapters/http/warehouse-http.repository';
import { PortHttpRepository }         from './infrastructure/adapters/http/port-http.repository';
import { LandShipmentHttpRepository } from './infrastructure/adapters/http/land-shipment-http.repository';
import { SeaShipmentHttpRepository }  from './infrastructure/adapters/http/sea-shipment-http.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    { provide: AUTH_REPOSITORY,          useClass: AuthHttpRepository },
    { provide: CLIENT_REPOSITORY,        useClass: ClientHttpRepository },
    { provide: PRODUCT_TYPE_REPOSITORY,  useClass: ProductTypeHttpRepository },
    { provide: WAREHOUSE_REPOSITORY,     useClass: WarehouseHttpRepository },
    { provide: PORT_REPOSITORY,          useClass: PortHttpRepository },
    { provide: LAND_SHIPMENT_REPOSITORY, useClass: LandShipmentHttpRepository },
    { provide: SEA_SHIPMENT_REPOSITORY,  useClass: SeaShipmentHttpRepository },
  ],
};