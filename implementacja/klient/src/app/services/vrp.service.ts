import {VRPCustomer} from '../domain/VRPCustomer';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {VRPDepot} from '../domain/VRPDepot';
import {VRPProblem} from '../domain/VRPProblem';
import {MapService} from './map.service';

/**
 * Serwis opowiedzialny za centralne zarządzanie aplikacją.
 */
@Injectable()
export class VRPService {


  currentProblem: VRPProblem = new VRPProblem('1');


  constructor(private mapService: MapService) {
  }

  private problems: BehaviorSubject<VRPProblem[]> = new BehaviorSubject<VRPProblem[]>([this.currentProblem]);
  private customers: BehaviorSubject<VRPCustomer[]> = new BehaviorSubject<VRPCustomer[]>(this.currentProblem.customers);
  private depots: BehaviorSubject<VRPDepot[]> = new BehaviorSubject<VRPDepot[]>(this.currentProblem.depots);

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
    this.currentProblem.addCustomer(customer);
    this.customers.next(this.currentProblem.customers);
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
    this.currentProblem.setDepot(depot);
    let copiedData = this.depotsData.slice();
    copiedData = [depot];
    this.depots.next(copiedData);
    this.mapService.addDepotToMap(depot);
  }

  getProblems() {
    return this.problems;
  }

  /**
   * Dodaje nowy problem do listy problemow ostatnio rozwiązywanych
   */
  addProblem(problem: VRPProblem) {
    //Dodanie do listy problemów
    let copiedData = this.problems.value.slice();
    copiedData.push(problem);
    this.problems.next(copiedData);
    this.loadProblem(problem.id);
  }

  /**
   * Pokazuje na mapie wybrany problem
   * @param id - id problemu
   */
  loadProblem(id) {

    if (this.currentProblem.id === id) {
      console.log('Problem juz wczytany');
      return;
    }

    let problem: VRPProblem = this.problems.value.find(x => x.id == id);

    if (problem) {
      console.log('Wczytywanie problemu:');
      console.log(problem);
      this.currentProblem = problem;
      this.customers.next(problem.customers);
      this.depots.next(problem.depots);
      this.refreshMap();

    } else {
      console.log('Nie mozna wczytac problemu - nie znaleziono problemu o podanym ID.');
    }

  }

  private refreshMap() {
    this.mapService.clearMap();
    for (let customer of this.customersData) {
      this.mapService.addCustomerToMap(customer);
    }

    for (let depot of this.depotsData) {
      this.mapService.addDepotToMap(depot);
    }
  }

  /**
   * Usuwa customera z aktualnego problemu
   * @param {VRPCustomer} customer
   */
  deleteCustomer(customer: VRPCustomer) {
    var index = this.currentProblem.customers.indexOf(customer, 0);
    if (index > -1) {
      this.currentProblem.customers.splice(index, 1);
    }
    this.customers.next(this.currentProblem.customers);
    this.refreshMap(); //TODO: Usunac tylko aktualny marker! jak? dunno.
  }


  /**
   * Wysyla problem do serwera ktory zwraca wynik.
   */
  solveCurrentProblem() {
    console.log("Po pomoc do serwera");
  }

}
