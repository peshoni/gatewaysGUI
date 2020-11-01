import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/api.service';
import { Utility } from 'src/app/core/utility';
import { Device } from 'src/app/models/device.model';
import { Gateway } from 'src/app/models/gateway.model';

@Component({
  selector: 'app-dialog-modal',
  templateUrl: './dialog-modal.component.html',
  styleUrls: ['./dialog-modal.component.scss']
})
export class DialogModalComponent implements OnInit {
  private ipPattern: string = '([0-9]{1,3}\\.){3}[0-9]{1,3}';
  form: FormGroup;
  type: string;
  parent: Gateway;
  availableDevices: Device[] = [];

  constructor(public dialogRef: MatDialogRef<DialogModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder, private api: ApiService) {
    if (data) {
      this.type = data.type;
      this.parent = data.parent;
    }
  }

  ngOnInit(): void {
    if (this.type) {
      switch (this.type) {
        case 'gateway':
          this.buildAddGatewayForm();
          break;
        case 'device':
          this.api.getAvailableDevices().subscribe(
            data => {
              if (data) {
                this.availableDevices = data.result;
              }
            }
          );
          this.buildAddDeviceForm();
          break;
      }
    }
  }
  /**
   * Gets generated string from api service
   */
  getUniqueString() {
    this.api.genGatewayName().subscribe(
      data => {
        if (data) {
          this.form.get('serialNumber').patchValue(data.result);
        }
      }
    );
  }
  /**
   * Builds form to add gateway data.
   */
  buildAddGatewayForm() {
    this.form = this.formBuilder.group({
      serialNumber: ['', Validators.required],
      name: ['', Validators.required],
      ipAddress: ['', [Validators.required, Validators.pattern(this.ipPattern)]]
    });
  }
  /**
   * Builds form to add device data
   */
  buildAddDeviceForm() {
    this.form = this.formBuilder.group({
      parentId: [this.parent.id, Validators.required],
      id: [0],
      created: [],
      vendor: ['', Validators.required]
    });
  }
  /**
   * Choosing from existing devices was made
   * @param id 
   */
  deviceSelected(id: any) {
    let selected = this.availableDevices.find(d => d.id === id);
    selected.parentId = this.parent.id;
    this.form.patchValue(selected);
  }

  /**
   * Sends data if any to parent component.
   */
  save() {
    if (this.form.valid) {
      if (this.type == 'gateway') {
        let gateway: Gateway = this.form.value;
        this.dialogRef.close({ event: this.type, data: gateway, type: this.type });
      } else if (this.type == 'device') {
        let device: Device = this.form.value;
        this.dialogRef.close({ event: this.type, data: device, type: this.type });
      } else {
        this.close();
      }
    } else {
      Utility.validateAllFormFields(this.form);
    }
  }

  /**
   * is the field dirty and invalid
   * @param field 
   * @param form 
   */
  isFieldValid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }
  /**
   * Closes the current dialog
   */
  close() {
    this.dialogRef.close();
  }
}
