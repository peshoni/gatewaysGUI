import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/index";
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api.response';
import { Device } from '../models/device.model';
import { Gateway } from '../models/gateway.model';


@Injectable()
export class ApiService {
  host: string = environment.restUrl + 'api/v1/';
  gatesPath: string = this.host + 'gateways/';
  devicePath: string = this.host + 'devices/';

  constructor(private http: HttpClient) {
  } 
  loadRandomData() {
    return this.http.get<ApiResponse>(this.gatesPath + 'load/');
  }
  dropData(){
    return this.http.get<ApiResponse>(this.gatesPath + 'drop/');
  }
  //Gateways
  genGatewayName(){
    return this.http.get<ApiResponse>(this.gatesPath + 'uniquename/');
  }
  addGateway(gateway: Gateway): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.gatesPath, gateway);
  }
  getGateways(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.gatesPath + 'all/');
  }
  
  //Devices
  addDevice(device: Device): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.devicePath, device);
  }
  detachDevice(device: Device): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.devicePath+'detach/', device);
  }
  setDeviceState(deviceId: number, state: boolean) {
    return this.http.get<ApiResponse>(this.devicePath + 'state/' + deviceId + '/' + state);
  }
  getAvailableDevices(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.devicePath + 'available/');
  } 
}