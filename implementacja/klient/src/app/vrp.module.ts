import {BrowserModule} from '@angular/platform-browser';
import 'reflect-metadata';
import {NgModule} from '@angular/core';
import {
  MatGridListModule, MatTabsModule, MatTableModule, MatListModule,
  MatButtonModule, MatDialogModule, MatCardModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatTooltipModule,
  MatProgressSpinnerModule, MatSnackBarModule, MatCheckboxModule, MatSortModule, MatButtonToggleModule, MatToolbarModule
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
import {ProblemsComponent} from './components/problems/problems.component';
import {SolutionsComponent} from './components/solutions/solutions.component';
import {RoutesComponent} from './components/routes/routes.component';
import {StompConfig, StompService} from '@stomp/ng2-stompjs';
import * as SockJS from 'sockjs-client';
import {RouteDialogComponent} from './components/map/modals/route.dialog';
import {DialogFactoryService} from './services/dialog.factory.service';
import {CustomerDialogComponent} from './components/map/modals/customer.dialog';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {MainComponent} from './components/main/main.component';

export function socketProvider() {
  return new SockJS('http://147.135.210.1:8080/stomp');
}

const stompConfig: StompConfig = {
  url: socketProvider,
  headers: {},
  heartbeat_in: 0,
  heartbeat_out: 20000,
  reconnect_delay: 5000,
  debug: false
};

const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: '**', component: MainComponent}
];

@NgModule({
  declarations: [
    VrpComponent,
    MainMenuComponent,
    CustomersListComponent,
    BaseInfoComponent,
    MapComponent,
    VrpAddDialogComponent,
    ProblemsComponent,
    SolutionsComponent,
    RoutesComponent,
    RouteDialogComponent,
    CustomerDialogComponent,
    LoginComponent,
    RegisterComponent,
    MainComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
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
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatSortModule,
    MatButtonToggleModule,
    MatToolbarModule
  ],
  entryComponents: [
    VrpAddDialogComponent,
    RouteDialogComponent,
    CustomerDialogComponent
  ],
  providers: [VRPService, MapService, ImportService, StompService, DialogFactoryService,
    {
      provide: StompConfig,
      useValue: stompConfig
    }],
  bootstrap: [VrpComponent]
})
export class VrpModule {
}
