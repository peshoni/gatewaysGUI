import { Device } from './device.model';

export class Gateway {
    id: number;
    serialNumber: string;
    name: string;
    ipAddress: string;
    devices: Device[]; 
    expanded: boolean;
}  