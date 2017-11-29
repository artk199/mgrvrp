import {Component, OnInit} from '@angular/core';
import {VRPService} from '../../services/vrp.service';
import {VRPCustomer} from '../../domain/VRPCustomer';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Component({
  selector: 'vrp-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.css']
})
export class CustomersListComponent implements OnInit {

  displayedColumns = ['actions', 'id', 'coords', 'demand'];
  dataSource;

  constructor(private vrpService: VRPService) {
    this.dataSource = new CustomersDataSource(this.vrpService.getCustomers());
  }

  ngOnInit() {
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
