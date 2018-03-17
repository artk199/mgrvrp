import {Component, OnInit} from '@angular/core';
import {VRPService} from '../../services/vrp.service';
import {VRPCustomer} from '../../domain/VRPCustomer';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Component({
  selector: 'vrp-customers-list',
  templateUrl: './customers-list.component.html'
})
export class CustomersListComponent implements OnInit {

  displayedColumns = ['id', 'coords', 'demand', 'actions'];
  dataSource;
  editEnabled: boolean;

  constructor(private vrpService: VRPService) {
    this.dataSource = new CustomersDataSource(this.vrpService.getCustomers());
    this.vrpService.getSolutions().subscribe((v) => {
      if (!v || v.length == 0) {
        this.editEnabled = true;
      } else {
        this.editEnabled = false;
      }
    });
  }

  ngOnInit() {
  }

  deleteCustomer(customer){
    this.vrpService.deleteCustomer(customer);
  }

}

export class CustomersDataSource extends DataSource<any> {

  constructor(private customers: Observable<VRPCustomer[]>) {
    super();
  }

  connect(): Observable<VRPCustomer[]> {
    return this.customers;
  }

  disconnect() {
  }
}
