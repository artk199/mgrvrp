import {Component, Inject, OnInit, ViewContainerRef} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {VRPService} from '../../services/vrp.service';
import {VRPCustomer} from '../../domain/VRPCustomer';
import {MapService} from '../../services/map.service';
import {VRPDepot} from '../../domain/VRPDepot';
import {Coordinate} from '../../domain/Coordinate';
import {DialogFactoryService} from '../../services/dialog.factory.service';

@Component({
  selector: 'vrp-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor(private mapService: MapService, public dialog: MatDialog, private vRPService: VRPService, private dialogFactoryService: DialogFactoryService, viewContainerRef: ViewContainerRef) {
    dialogFactoryService.setRootViewContainerRef(this);
  }

  ngOnInit() {
    const c = this;
    this.mapService.setupClickEvent(function (e) {
      c.dialog.open(VrpAddDialogComponent, {
        data: {coordinate: new Coordinate(e.latlng.lat, e.latlng.lng)}
      });
    });
    this.vRPService.forceRefresh();
  }

}

@Component({
  selector: 'vrp-add-dialog',
  templateUrl: './add.dialog.html',
})
export class VrpAddDialogComponent {

  name: any = '';

  constructor(private vRPService: VRPService,
              public dialogRef: MatDialogRef<VrpAddDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.name = '' + this.vRPService.getCustomersData().length;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addCustomer() {
    try {
      this.vRPService.addCustomer(new VRPCustomer(this.name, this.data.coordinate));
      this.dialogRef.close();
    } catch (e) {
      console.error(e);
      alert(e);
    }
  }

  addDepot() {
    this.vRPService.addDepot(new VRPDepot(this.name, this.data.coordinate));
    this.dialogRef.close();
  }

}
