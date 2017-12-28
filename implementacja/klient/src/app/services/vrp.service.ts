import {VRPCustomer} from '../domain/VRPCustomer';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {VRPDepot} from '../domain/VRPDepot';
import {VRPProblem} from '../domain/VRPProblem';
import {MapService} from './map.service';
import {StompService} from '@stomp/ng2-stompjs';
import {Message} from '@stomp/stompjs';
import {deserializeArray, serialize} from 'class-transformer';

/**
 * Serwis opowiedzialny za centralne zarządzanie aplikacją.
 */
@Injectable()
export class VRPService {


  currentProblem: VRPProblem;
  private problems: BehaviorSubject<VRPProblem[]> = new BehaviorSubject<VRPProblem[]>([]);
  private customers: BehaviorSubject<VRPCustomer[]> = new BehaviorSubject<VRPCustomer[]>([]);
  private depots: BehaviorSubject<VRPDepot[]> = new BehaviorSubject<VRPDepot[]>([]);

  private PROBLEMS_KEY: string = 'problems';

  constructor(private mapService: MapService, private _stompService: StompService) {
    //Wczytywanie zapisanych problemow do storeage
    let p: VRPProblem[] = deserializeArray(VRPProblem, window.localStorage.getItem(this.PROBLEMS_KEY));
    if (p) {
      this.problems.next(p);
    } else {
      this.problems.next([new VRPProblem('0')]);
    }
    this.loadProblem(this.problems.value[0].id);
  }


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

    this.saveProblemsToStorage();
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

    this.saveProblemsToStorage();
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
    this.loadProblemAndRefreshMap(problem.id);
  }

  /**
   * Pokazuje na mapie wybrany problem
   * @param id - id problemu
   */
  loadProblemAndRefreshMap(id) {
    this.loadProblem(id);
    this.refreshMap();

  }

  refreshMap() {
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
    let stomp_subscription = this._stompService.subscribe('/topic/hello');

    stomp_subscription.map((message: Message) => {
      return message.body;
    }).subscribe((msg: string) => {
      console.log(JSON.parse(msg));
      console.log(msg['content']['type']);
      if (msg['content']['type'] === 'END') {
        console.log('KONIEC');
      }
    });

    this._stompService.publish('/app/vrp', JSON.stringify(this.currentProblem));
  }

  private saveProblemsToStorage() {
    window.localStorage.setItem(this.PROBLEMS_KEY, serialize(this.problems.value));
  }

  private loadProblem(id) {
    if (this.currentProblem && this.currentProblem.id === id) {
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
    } else {
      console.log('Nie mozna wczytac problemu - nie znaleziono problemu o podanym ID.');
    }
  }

}
