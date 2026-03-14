export type PortType = 'N' | 'I';

export interface Port {
  id: number;
  name: string;
  city: string;
  country: string;
  portType: PortType;
}

export interface PortRequest {
  name: string;
  city: string;
  country: string;
  portType: PortType;
}