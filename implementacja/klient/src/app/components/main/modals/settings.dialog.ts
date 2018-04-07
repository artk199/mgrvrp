import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {RouteDialogComponent} from '../../map/modals/route.dialog';
import {Config} from '../../../config';

@Component({
  selector: 'vrp-settings-dialog',
  templateUrl: './settings.dialog.html'
})
export class SettingsDialogComponent {

  interval: number;
  apiURL: string;
  communicationType: string;

  constructor(public dialogRef: MatDialogRef<RouteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

    this.interval = Config.SHORT_POLL_INTERVAL;
    this.apiURL = Config.API_URL;
    console.log(this.apiURL);
    this.communicationType = Config.getCommunicationType();

  }

  changeInterval() {
    Config.SHORT_POLL_INTERVAL = this.interval;
  }

  changeApiUrl() {
    Config.API_URL = this.apiURL;
  }

  changeCommunicationType() {
    Config.setCommunicationType(this.communicationType);
  }

  isSSEDisabled() {
    return Config.isSSEDisabled();
  }

  isWebSocketDisabled() {
    return Config.isWebSocketDisabled();
  }

}
