import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {RouteDialogComponent} from '../../map/modals/route.dialog';
import {ImportService} from '../../../services/import.service';

@Component({
  selector: 'vrp-customer-import-dialog',
  templateUrl: './customer-import.dialog.html'
})
export class CustomerImportDialog {

  importData = '';

  constructor(public dialogRef: MatDialogRef<RouteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private importService: ImportService) {
  }

  importToCustomers() {
    this.importService.importSimpleCustomers(this.importData);
  }

}
