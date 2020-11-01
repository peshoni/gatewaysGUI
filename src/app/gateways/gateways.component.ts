import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../core/api.service';
import { PepeInjector } from '../core/injector.service';
import { DialogModalComponent } from '../dialogs/dialog-modal/dialog-modal.component';
import { ApiResponse } from '../models/api.response';
import { Device } from '../models/device.model';
import { Gateway } from '../models/gateway.model';

@Component({
  selector: 'app-gateways',
  templateUrl: './gateways.component.html',
  styleUrls: ['./gateways.component.scss']
})
/**
 * Main `gataway task` component.
 */
export class GatewaysComponent implements OnInit {
  private appInjector = PepeInjector.getInjector();
  private apiService: ApiService;
  private snack: MatSnackBar;
  private dialog: MatDialog;
  private interval: any;
  gateways: Gateway[] = [];
  displayedColumns = ['id', 'parentId', 'vendor', 'created', 'updated', 'online', 'changeState', 'detach'];
  lastExpandedGateWayID: number = 0;

  constructor() {
    this.apiService = this.appInjector.get(ApiService);
    this.snack = this.appInjector.get(MatSnackBar);
    this.dialog = this.appInjector.get(MatDialog);
  }

  ngOnInit() {
    this.createInterval();
  }

  createInterval() {
    this.loadGateways();
    this.interval = setInterval(() => {
      this.loadGateways();
    }, 5 * 1000);
  }

  /**
   * Leaves just current gateway panel opened.
   * @param gateway 
   */
  toggleExpandStates(gateway: Gateway) {
    let currentState = gateway.expanded;
    if (currentState) {//onClose event
      this.lastExpandedGateWayID = 0;
      return;
    }
    this.lastExpandedGateWayID = gateway.id;
    gateway.expanded = !currentState;
    this.gateways.filter(g => g.id != this.lastExpandedGateWayID).forEach(
      other => {
        other.expanded = currentState;
      }
    );
  }
  /**
   * Opens a dialog to add gateway data.
   */
  addGateway() {
    this.openDialog('gateway', undefined);
  }
  /**
     * Opens a dialog to add device data. 
     */
  addDevice(gateway: Gateway) {
    let devicesCount: number = gateway.devices.length;
    if (devicesCount < 10) {
      this.openDialog('device', gateway);
    } else {
      this.showSnack("You have reached the maximum of gateway slots and can't add another device.", "", 3000);
    }
  }
  /**
   * Removes device from gateway list with devices.
   * @param device 
   */
  detachDeviceFromGateway(device: Device) {
    this.apiService.detachDevice(device).subscribe(
      data => {
        this.notifyUserAndRefreshCollection(data);
      }
    );
  }
  /**
   *  Dialog for adding data for new gateway or device entryies.
   * @param type the context
   * @param gateWay optional gateway 
   */
  openDialog(type: string, gateWay: Gateway) {
    const dialogRef = this.dialog.open(DialogModalComponent, {
      width: '40vw',
      height: 'fit-content',
      panelClass: 'gate-dialog',
      data: { type: type, parent: gateWay }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let object: any = result.data;
        let objectType: string = result.type;
        if (objectType === 'gateway') {
          this.saveGateway(object);
        } else if (objectType === 'device') {
          this.saveDevice(object);
        }
      }
    });
  }
  /**
   * Adds a gateway into database.
   * @param gateway 
   */
  saveGateway(gateway: Gateway) {
    this.apiService.addGateway(gateway).subscribe(
      data => {
        this.notifyUserAndRefreshCollection(data);
      }
    );
  }


  saveDevice(object: any) {
    this.apiService.addDevice(object).subscribe(
      data => {
        this.notifyUserAndRefreshCollection(data);
      }
    );
  }
  /**
   * Shows message from api response. If it succeed refreshes the gateways collection.
   * @param data the api response
   */
  notifyUserAndRefreshCollection(data: ApiResponse) {
    if (data) {
      this.showSnack(data.message, "", 2000);
      this.loadGateways();
    } else {
      this.showSnack('Data saving was failed', "", 3000);
    }
  }
  /**
   * `Lazy` loader
   */
  loadRandomCollection() {
    this.apiService.loadRandomData().subscribe(
      data => {
        if (data.result === true) {
          this.loadGateways();
        }
      }
    );
  }
  clearAllDataCollection() {
    this.apiService.dropData().subscribe(
      data => {
        this.notifyUserAndRefreshCollection(data);
      }
    );
  }
  /**
   * Loads a collection with gateways and their devices from database
   */
  loadGateways() {
    this.apiService.getGateways().subscribe(
      data => {
        if (data) {
          this.gateways = data.result;
          this.gateways.forEach(g => {
            g.expanded = this.lastExpandedGateWayID === g.id;
          });
        }
      }
    );
  }
  /**
   * Changes `online` state of device according slide value - online if checked, offline otherwise
   * @param event onClick event
   * @param device the subject
   */
  changeDeviceState(event: any, device: Device) {
    this.apiService.setDeviceState(device.id, event.checked).subscribe(data => {
      if (data) {
        this.loadGateways();
        this.showSnack(data.message, "", 2000);
      } else {
        this.showSnack("Something went wrong", "", 2000);
      }
    });
  }
  /**
   * Util for snack messages
   * @param text 
   * @param action 
   * @param duration  in millis
   * @param MatSnakbarRef for onClose and actions pricessing
   */

  showSnack(text: string, action: string, duration: number): MatSnackBarRef<SimpleSnackBar> {
    return this.snack.open(text, action, {
      duration: duration,
    });
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}
