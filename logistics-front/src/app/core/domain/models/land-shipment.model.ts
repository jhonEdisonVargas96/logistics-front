export interface LandShipment {
  id: number;
  clientId: number;
  productTypeId: number;
  warehouseId: number;
  quantity: number;
  deliveryDate: string;
  trackingNumber: string;
  vehiclePlate: string;
  basePrice: number;
  finalPrice?: number;
}

export interface LandShipmentRequest {
  clientId: number;
  productTypeId: number;
  warehouseId: number;
  quantity: number;
  deliveryDate: string;
  trackingNumber: string;
  vehiclePlate: string;
  basePrice: number;
}