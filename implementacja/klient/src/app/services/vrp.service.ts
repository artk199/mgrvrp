import {VRPCustomer} from '../domain/VRPCustomer';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {VRPDepot} from '../domain/VRPDepot';
import {MapService} from './map.service';

/**
 * Serwis opowiedzialny za centralne zarządzanie aplikacją.
 */
@Injectable()
export class VRPService {

  constructor(private mapService: MapService) {
  }

  private customers: BehaviorSubject<VRPCustomer[]> = new BehaviorSubject<VRPCustomer[]>([]);
  private depots: BehaviorSubject<VRPDepot[]> = new BehaviorSubject<VRPDepot[]>([]);

  get depotsData(): VRPDepot[] {
    return this.depots.value;
  }

  get customersData(): VRPCustomer[] {
    return this.customers.value;
  }

  /**
   * Zwraca wszystkich odbiorców jako Observable.
   * Przykład użycia
   * getCustomers().subscribe();
   * @returns {Observable<VRPCustomer[]>} - lista wszystkich odbiorców
   */
  getCustomers(): Observable<VRPCustomer[]> {
    return this.customers;
  }

  /**
   * Dodaje odbiorcę do listy wszystkich odbiorców i notyfikuje o zmianie wszystkich obserwatorów.
   * @param {VRPCustomer} customer - odbiorca która ma zostać dodany
   */
  addCustomer(customer: VRPCustomer) {
    const copiedData = this.customersData.slice();
    copiedData.push(customer);
    this.customers.next(copiedData);
    this.mapService.addCustomerToMap(customer);
  }

  /**
   * Zwraca magazyn jako Observable.
   * Przykład użycia:
   * getDepot().subscribe( response => this.depot = response[0] );
   * @returns {Observable<VRPDepot[]>} - obserwable zwracający magazyn
   */
  getDepot(): Observable<VRPDepot[]> {
    return this.depots;
  }

  /**
   * Zamienia magazyn na nowy.
   * @param {VRPDepot} depot - nowy magazyn
   */
  addDepot(depot: VRPDepot) {
    let copiedData = this.depotsData.slice();
    copiedData = [depot];
    this.depots.next(copiedData);
    this.mapService.addDepotToMap(depot);
  }

}
