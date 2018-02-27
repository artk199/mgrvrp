import {
  ComponentFactoryResolver,
  Injectable,
  Inject,
  ReflectiveInjector
} from '@angular/core';

import {RouteDialogComponent} from '../components/map/modals/route.dialog';
import {MatDialog} from '@angular/material';
import {VRPRoute} from '../domain/VRPRoute';

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

}
