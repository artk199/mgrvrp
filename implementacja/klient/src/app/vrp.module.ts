import {BrowserModule} from '@angular/platform-browser';
import "reflect-metadata";
import {NgModule} from '@angular/core';
import {
  MatGridListModule, MatTabsModule, MatTableModule, MatListModule,
  MatButtonModule, MatDialogModule, MatCardModule, MatIconModule, MatFormFieldModule, MatInputModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {VrpComponent} from './vrp.component';
import {MainMenuComponent} from './components/main-menu/main-menu.component';
import {CustomersListComponent} from './components/customers-list/customers-list.component';
import {BaseInfoComponent} from './components/base-info/base-info.component';
import {MapComponent, VrpAddDialogComponent} from './components/map/map.component';
import {VRPService} from './services/vrp.service';
import {FormsModule} from '@angular/forms';
import {MapService} from './services/map.service';
import {ImportService} from './services/import.service';
import {DepotInfoComponent} from './components/depot-info/depot-info.component';
import {LogService} from './shared/log/log.service';
import {LogPublishersService} from './shared/log/log-publishers.service';
import {ProblemsComponent} from './components/problems/problems.component';
import {SolutionsComponent} from './components/solutions/solutions.component';
import {RoutesComponent} from './components/routes/routes.component';
import {StompConfig, StompService} from '@stomp/ng2-stompjs';
import * as SockJS from 'sockjs-client';

export function socketProvider() {
  return new SockJS('http://localhost:9090/stomp');
}

const stompConfig: StompConfig = {
  url: socketProvider,
  headers: {},
  heartbeat_in: 0,
  heartbeat_out: 20000,
  reconnect_delay: 5000,
  debug: false
};

@NgModule({
  declarations: [
    VrpComponent,
    MainMenuComponent,
    CustomersListComponent,
    BaseInfoComponent,
    MapComponent,
    VrpAddDialogComponent,
    DepotInfoComponent,
    ProblemsComponent,
    SolutionsComponent,
    RoutesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatGridListModule,
    MatTabsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatListModule,
    MatButtonModule,
    MatDialogModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  entryComponents: [
    VrpAddDialogComponent
  ],
  providers: [VRPService, MapService, LogService, LogPublishersService, ImportService, StompService,
    {
      provide: StompConfig,
      useValue: stompConfig
    }],
  bootstrap: [VrpComponent]
})
export class VrpModule {
}
