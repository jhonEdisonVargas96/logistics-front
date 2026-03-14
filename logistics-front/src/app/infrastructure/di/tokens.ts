import { InjectionToken } from '@angular/core';
import { AuthRepository }         from '../../core/domain/ports/auth.repository';
import { ClientRepository }       from '../../core/domain/ports/client.repository';
import { ProductTypeRepository }  from '../../core/domain/ports/product-type.repository';
import { WarehouseRepository }    from '../../core/domain/ports/warehouse.repository';
import { PortRepository }         from '../../core/domain/ports/port.repository';
import { LandShipmentRepository } from '../../core/domain/ports/land-shipment.repository';
import { SeaShipmentRepository }  from '../../core/domain/ports/sea-shipment.repository';

export const AUTH_REPOSITORY          = new InjectionToken<AuthRepository>('AuthRepository');
export const CLIENT_REPOSITORY        = new InjectionToken<ClientRepository>('ClientRepository');
export const PRODUCT_TYPE_REPOSITORY  = new InjectionToken<ProductTypeRepository>('ProductTypeRepository');
export const WAREHOUSE_REPOSITORY     = new InjectionToken<WarehouseRepository>('WarehouseRepository');
export const PORT_REPOSITORY          = new InjectionToken<PortRepository>('PortRepository');
export const LAND_SHIPMENT_REPOSITORY = new InjectionToken<LandShipmentRepository>('LandShipmentRepository');
export const SEA_SHIPMENT_REPOSITORY  = new InjectionToken<SeaShipmentRepository>('SeaShipmentRepository');