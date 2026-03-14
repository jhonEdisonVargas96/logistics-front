export interface Warehouse {
  id: number;
  name: string;
  address: string;
  city: string;
}

export interface WarehouseRequest {
  name: string;
  address: string;
  city: string;
}