import {VRPCustomer} from '../domain/VRPCustomer';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {VRPDepot} from '../domain/VRPDepot';
import {VRPProblem} from '../domain/VRPProblem';
import {MapService} from './map.service';
import {StompService} from '@stomp/ng2-stompjs';
import {Message} from '@stomp/stompjs';
import {deserialize, deserializeArray, serialize} from 'class-transformer';
import {VRPSolution} from '../domain/VRPSolution';

/**
 * Serwis opowiedzialny za centralne zarządzanie aplikacją.
 */
@Injectable()
export class VRPService {


  currentProblem: VRPProblem;
  private problems: BehaviorSubject<VRPProblem[]> = new BehaviorSubject<VRPProblem[]>([]);
  private customers: BehaviorSubject<VRPCustomer[]> = new BehaviorSubject<VRPCustomer[]>([]);
  private depots: BehaviorSubject<VRPDepot[]> = new BehaviorSubject<VRPDepot[]>([]);
  private solutions: BehaviorSubject<VRPSolution[]> = new BehaviorSubject<VRPSolution[]>([]);

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
    if (this.currentProblem.customers.some(x => x.id == customer.id)) {
      throw new Error('Customer with given name already exists.');
    }
    this.currentProblem.addCustomer(customer);
    this.customers.next(this.currentProblem.customers);
    this.mapService.addCustomerToMap(customer);

    this.saveProblemsToStorage();
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
    let copiedData = this.depots.value.slice();
    copiedData = [depot];
    this.depots.next(copiedData);
    this.mapService.addDepotToMap(depot);

    this.saveProblemsToStorage();
  }

  /**
   * Zwraca wszystkie problemy
   * @returns {BehaviorSubject<VRPProblem[]>}
   */
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

  /**
   * Odświeża mapę z aktualnymi odbiorcami oraz magazynami
   */
  refreshMap() {
    this.mapService.clearMap();
    for (let customer of this.customers.value) {
      this.mapService.addCustomerToMap(customer);
    }

    for (let depot of this.depots.value) {
      this.mapService.addDepotToMap(depot);
    }
  }

  /**
   * Wysyla problem do serwera ktory zwraca wynik.
   */
  solveCurrentProblem() {
    VRPService.startLoading();
    let stomp_subscription = this._stompService.subscribe('/topic/hello');

    let obs = stomp_subscription.map((message: Message) => {
      return message.body;
    }).subscribe((msg: string) => {
      let m = JSON.parse(msg);
      let messageType = m.content ? m.content.type : '';
      switch (messageType) {
        case 'STEP':
          let s : VRPSolution = deserialize(VRPSolution, JSON.stringify(m.content.message));
          this.setColors(s);
          this.loadSolution(s);
          break;
        case 'END':
          let solution: VRPSolution = deserialize(VRPSolution, JSON.stringify(m.content.message));
          this.addSolution(solution);
          VRPService.stopLoading();
          obs.unsubscribe();
          break;
        case 'INFO':
          console.log(m.content.message);
          break;
      }
    });

    this._stompService.publish('/app/vrp', serialize(this.currentProblem, {excludePrefixes: ['solutions']}));
  }

  /**
   * Zwraca liste solucji jako Observable
   */
  getSolutions() {
    return this.solutions;
  }

  /**
   * Rysuje rozwiazanie na mapie
   * @param solution
   */
  loadSolution(solution) {
    this.mapService.drawSolution(solution);
  };

  /**
   * Usuwa rozwiazanie
   */
  deleteSolution(solution) {
    let index = this.currentProblem.solutions.indexOf(solution, 0);
    if (index > -1) {
      this.currentProblem.solutions.splice(index, 1);
    }
    this.solutions.next(this.currentProblem.solutions);
  }

  /**
   * Dodaje odpowiedz do aktualnie wybranego problemu
   * @param {VRPSolution} solution
   */
  private addSolution(solution: VRPSolution) {
    this.setColors(solution);
    this.currentProblem.solutions.push(solution);
    this.solutions.next(this.currentProblem.solutions);

    this.loadSolution(solution);
  }


  /**
   * Zapisuje problemy do pamieci podrecznej przeglaradki co po odswiezeniu storny bedzie nadal taki jak jest
   */
  private saveProblemsToStorage() {
    window.localStorage.setItem(this.PROBLEMS_KEY, serialize(this.problems.value));
  }

  /**
   * Wczytuje problem na podstawie ID -> jeżeli nie ma to nic nie wyświetli
   * @param id
   */
  private loadProblem(id) {
    if (this.currentProblem && this.currentProblem.id === id) {
      console.log('Problem juz wczytany');
      return;
    }

    let problem: VRPProblem = this.problems.value.find(x => x.id == id);

    if (problem) {
      console.log('Wczytywanie problemu:');
      this.currentProblem = problem;
      this.customers.next(problem.customers);
      this.depots.next(problem.depots);
      this.solutions.next(problem.solutions);
    } else {
      console.log('Nie mozna wczytac problemu - nie znaleziono problemu o podanym ID.');
    }
  }

  getCustomersData() {
    return this.customers.value;
  }

  private static stopLoading() {
    document.getElementById('loading-screen').style.display = 'none';
  }

  private static startLoading() {
    document.getElementById('loading-screen').style.display = 'block';
  }

  /**
   * Przypisuje kolory do poszczegolnych tras
   * @param {VRPSolution} solution
   */
  private setColors(solution: VRPSolution) {
    const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

    let i = 0;
    for (let route of solution.routes) {
      route.color = colors[i % colors.length];
      i++;
    }
  }
}
