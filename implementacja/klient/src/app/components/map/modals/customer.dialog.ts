import {Component, Inject} from '@angular/core';
import {VRPCustomer} from '../../../domain/VRPCustomer';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {RouteDialogComponent} from './route.dialog';

@Component({
  selector: 'vrp-customer-dialog',
  templateUrl: './customer.dialog.html',
  styleUrls: ['./customer.dialog.css']
})
export class CustomerDialogComponent {
  customer: VRPCustomer;

  constructor(public dialogRef: MatDialogRef<RouteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.customer = data.customer;
  }
}
