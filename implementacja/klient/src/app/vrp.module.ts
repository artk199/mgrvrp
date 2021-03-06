import {BrowserModule} from '@angular/platform-browser';
import 'reflect-metadata';
import {NgModule} from '@angular/core';
import {
  MatGridListModule, MatTabsModule, MatTableModule, MatListModule,
  MatButtonModule, MatDialogModule, MatCardModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatTooltipModule,
  MatProgressSpinnerModule, MatSnackBarModule, MatCheckboxModule, MatSortModule, MatButtonToggleModule, MatToolbarModule, MatMenuModule
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
import {RouteDialogComponent} from './components/map/modals/route.dialog';
import {DialogFactoryService} from './services/dialog.factory.service';
import {CustomerDialogComponent} from './components/map/modals/customer.dialog';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {MainComponent} from './components/main/main.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {SecurityService} from './services/security.service';
import {AuthInterceptor} from './interceptors/auth.interceptor';
import {ChangePasswordComponent} from './components/change-password/change-password.component';
import {VrpSolverService} from './services/vrp-solver.service';
import {SettingsDialogComponent} from './components/main/modals/settings.dialog';
import {CustomerImportDialog} from './components/customers-list/modals/customer-import.dialog';

const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'password', component: ChangePasswordComponent},
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
    SettingsDialogComponent,
    CustomerImportDialog,
    LoginComponent,
    RegisterComponent,
    MainComponent,
    ChangePasswordComponent
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
    MatToolbarModule,
    MatMenuModule,
    HttpClientModule
  ],
  entryComponents: [
    VrpAddDialogComponent,
    RouteDialogComponent,
    CustomerDialogComponent,
    SettingsDialogComponent,
    CustomerImportDialog
  ],
  providers: [VRPService, MapService, ImportService, DialogFactoryService, SecurityService, VrpSolverService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }],
  bootstrap: [VrpComponent]
})
export class VrpModule {
}
