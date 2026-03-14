export interface SeaShipment {
  id: number;
  clientId: number;
  productTypeId: number;
  portId: number;
  quantity: number;
  deliveryDate: string;
  trackingNumber: string;
  fleetNumber: string;
  basePrice: number;
  finalPrice?: number;
}

export interface SeaShipmentRequest {
  clientId: number;
  productTypeId: number;
  portId: number;
  quantity: number;
  deliveryDate: string;
  trackingNumber: string;
  fleetNumber: string;
  basePrice: number;
}