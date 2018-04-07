import {
  Injectable,
} from '@angular/core';

import {RouteDialogComponent} from '../components/map/modals/route.dialog';
import {MatDialog} from '@angular/material';
import {VRPRoute} from '../domain/VRPRoute';
import {VRPCustomer} from '../domain/VRPCustomer';
import {CustomerDialogComponent} from '../components/map/modals/customer.dialog';
import {SettingsDialogComponent} from '../components/main/modals/settings.dialog';

@Injectable()
export class DialogFactoryService {

  private rootViewContainer: any;

  constructor(public dialog: MatDialog) {
  }

  setRootViewContainerRef(viewContainerRef) {
    this.rootViewContainer = viewContainerRef;
  }

  showRouteDialog(route: VRPRoute) {
    this.rootViewContainer.dialog.open(RouteDialogComponent, {data: {route: route}});
  }

  showCustomerDialog(customer: VRPCustomer) {
    this.rootViewContainer.dialog.open(CustomerDialogComponent, {data: {customer: customer}});
  }

  showSettingsDialog() {
    this.rootViewContainer.dialog.open(SettingsDialogComponent, {});
  }

}
