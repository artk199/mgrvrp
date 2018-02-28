import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {VRPRoute} from '../../../domain/VRPRoute';

@Component({
  selector: 'vrp-route-dialog',
  templateUrl: './route.dialog.html',
  styleUrls: ['./route.dialog.css']
})
export class RouteDialogComponent {

  route: VRPRoute;

  constructor(public dialogRef: MatDialogRef<RouteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.route = data.route;
  }
}
