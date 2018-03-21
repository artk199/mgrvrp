import {VRPCustomer} from '../domain/VRPCustomer';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {VRPDepot} from '../domain/VRPDepot';
import {VRPProblem} from '../domain/VRPProblem';
import {MapService} from './map.service';
import {deserialize, deserializeArray, serialize} from 'class-transformer';
import {VRPSolution} from '../domain/VRPSolution';
import {MatSnackBar} from '@angular/material';
import {VRPSolutionStep} from '../domain/VRPSolutionStep';
import {WsVrpSolverService} from './vrp-solvers/ws-vrp-solver.service';
import {XhrVrpSolverService} from './vrp-solvers/xhr-vrp-solver.service';
import {VRPSolutionEvent, VRPSolutionEventType, VrpSolverService} from './vrp-solvers/vrp-solver.service';
import {VRPAdditionalSetting} from '../domain/VRPAdditionalSetting';

/**
 * Serwis opowiedzialny za centralne zarządzanie aplikacją.
 */
@Injectable()
export class VRPService {

  private _currentProblem: BehaviorSubject<VRPProblem> = new BehaviorSubject<VRPProblem>(null);
  private _currentSolution: BehaviorSubject<VRPSolution> = new BehaviorSubject<VRPSolution>(null);
  private problems: BehaviorSubject<VRPProblem[]> = new BehaviorSubject<VRPProblem[]>([]);
  private customers: BehaviorSubject<VRPCustomer[]> = new BehaviorSubject<VRPCustomer[]>([]);
  private depots: BehaviorSubject<VRPDepot[]> = new BehaviorSubject<VRPDepot[]>([]);
  private solutions: BehaviorSubject<VRPSolution[]> = new BehaviorSubject<VRPSolution[]>([]);

  private PROBLEMS_KEY: string = 'problems';

  constructor(private mapService: MapService, private snackBar: MatSnackBar, private wsVrpSolverService: WsVrpSolverService, private xhrVrpSolverService: XhrVrpSolverService) {
    //Wczytywanie zapisanych problemow do storeage
    let p: VRPProblem[] = deserializeArray(VRPProblem, window.localStorage.getItem(this.PROBLEMS_KEY));
    if (p) {
      this.problems.next(p);
    } else {
      this.problems.next([new VRPProblem('0')]);
    }
    this.loadProblem(this.problems.value[0].id);

    this.solutions.subscribe((v) => {
      if (!v || v.length == 0) {
        this.mapService.enableEditing();
      } else {
        this.mapService.disableEditing();
      }
    });
  }

  getCurrentProblem() {
    return this._currentProblem;
  }

  get currentProblemValue(): VRPProblem {
    return this._currentProblem.value;
  }

  get currentSolution(): Observable<VRPSolution> {
    return this._currentSolution;
  }

  /**
   * Zwraca wszystkich odbiorców jako Observable.
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
    console.log(customer);
    if (this.currentProblemValue.customers.some(x => x.name == customer.name)) {
      throw new Error('Customer with given name already exists.');
    }
    this.currentProblemValue.addCustomer(customer);
    this.customers.next(this.currentProblemValue.customers);
    this.mapService.addCustomerToMap(customer);
  }

  /**
   * Usuwa customera z aktualnego problemu
   * @param {VRPCustomer} customer
   */
  deleteCustomer(customer: VRPCustomer) {
    const index = this.currentProblemValue.customers.indexOf(customer, 0);
    if (index > -1) {
      this.currentProblemValue.customers.splice(index, 1);
    }
    this.customers.next(this.currentProblemValue.customers);
    this.refreshMap(); //TODO: Usunac tylko aktualny marker! jak? dunno.
  }

  /**
   * Zwraca magazyn jako Observable.
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
    this.currentProblemValue.setDepot(depot);
    let copiedData = [depot];
    this.depots.next(copiedData);
    this.mapService.addDepotToMap(depot);
  }

  /**
   * Tworzy nowy problem
   */
  createNewProblem(name) {
    let problem = new VRPProblem(name);
    this.addProblem(problem);
    return;
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
   * Usuwa podany problem - jeżeli jest ostatnim to komunikat
   * @param problem
   */
  deleteProblem(problem: VRPProblem) {
    let index = this.problems.value.indexOf(problem, 0);
    if (index > -1) {
      if (this.problems.value.length <= 1) {
        this.snackBar.open('Cannot delete last one problem', 'OK', {
          duration: 2000,
        });
      }
      let copy = this.problems.value;
      copy.splice(index, 1);
      if (this.currentProblemValue === problem) {
        this._currentProblem.next(copy[0]);
      }
      this.problems.next(copy);
      this.snackBar.open('Deleted', 'OK', {
        duration: 2000,
      });
    }
  }

  /**
   * Pokazuje na mapie wybrany problem
   * @param id - id problemu
   */
  loadProblemAndRefreshMap(id) {
    this.loadProblem(id);
    this.forceRefresh();
  }

  /**
   * Calkowicie usuwa mape i od nowa rysuje aktualny problem
   */
  forceRefresh() {
    this.mapService.setupMap(this.currentProblemValue.paneType);
    if (this.mapService.isMapInitialized()) {
      this.refreshMap();
    }
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
  solveCurrentProblem(algorithmName: string, distanceType: string, additionalSettings: VRPAdditionalSetting[]) {
    VRPService.showLoadingSpinner();
    let steps = [];
    this.getVRPSolverService().solve(this.currentProblemValue, additionalSettings, algorithmName, distanceType).subscribe(
      (event: VRPSolutionEvent) => {
        switch (event.type) {
          case VRPSolutionEventType.STEP:
            let solutionStep = new VRPSolutionStep();
            solutionStep.data = event.solution;
            steps.push(solutionStep);
            VRPService.setColors(solutionStep.data);
            this.loadSolution(solutionStep.data);
            break;
          case VRPSolutionEventType.END:
            let solution: VRPSolution = event.solution;
            solution.solutionsSteps = steps;
            this.addSolution(solution);
            VRPService.hideLoadingSpinner();
            break;
          case VRPSolutionEventType.INFO:
            VRPService.setLoadingMessage(event.message);
            break;
          case VRPSolutionEventType.RUNTIME_ERROR:
            this.snackBar.open('Unknown error on server side.', 'OK', {
              duration: 5000,
            });
            VRPService.hideLoadingSpinner();
            break;
          default:
            console.log('Unknown solution event!');
        }
      },
      error => {
        console.log(error);
        this.snackBar.open('Unknown communication error.', 'OK', {
          duration: 5000,
        });
        VRPService.hideLoadingSpinner();
      }
    );
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
    this._currentSolution.next(solution);
    this.mapService.drawSolution(solution);
  };

  /**
   * Usuwa rozwiazanie
   */
  deleteSolution(solution) {
    let index = this.currentProblemValue.solutions.indexOf(solution, 0);
    if (index > -1) {
      if (this._currentSolution.value === solution) {
        this._currentSolution.next(null);
        //Wyczyscic mape.
        this.mapService.clearPaths();
      }
      this.currentProblemValue.solutions.splice(index, 1);
    }
    this.solutions.next(this.currentProblemValue.solutions);
  }

  /**
   * Zapisuje problemy do pamieci podrecznej przeglaradki co po odswiezeniu storny bedzie nadal taki jak jest
   */
  saveProblemsToStorage() {
    window.localStorage.setItem(this.PROBLEMS_KEY, serialize(this.problems.value));
  }

  /**
   * Zwraca aktualnych odbiorców
   * @returns {VRPCustomer[]}
   */
  getCustomersData() {
    return this.customers.value;
  }

  /**
   * Dodaje odpowiedz do aktualnie wybranego problemu
   * @param {VRPSolution} solution
   */
  private addSolution(solution: VRPSolution) {
    VRPService.setColors(solution);
    this.currentProblemValue.solutions.push(solution);
    this.solutions.next(this.currentProblemValue.solutions);
    this.loadSolution(solution);
  }

  /**
   * Wczytuje problem na podstawie ID -> jeżeli nie ma to nic nie wyświetli
   * @param id
   */
  private loadProblem(id) {
    if (this.currentProblemValue && this.currentProblemValue.id === id) {
      console.log('Problem juz wczytany');
      return;
    }

    let problem: VRPProblem = this.problems.value.find(x => x.id == id);

    if (problem) {
      console.log('Wczytywanie problemu:');
      this._currentProblem.next(problem);
      this.customers.next(problem.customers);
      this.depots.next(problem.depots);
      this.solutions.next(problem.solutions);
    } else {
      console.log('Nie mozna wczytac problemu - nie znaleziono problemu o podanym ID.');
    }
  }

  /**
   * Przypisuje kolory do poszczegolnych tras
   * @param {VRPSolution} solution
   */
  private static setColors(solution: VRPSolution) {
    const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

    let i = 0;
    for (let route of solution.routes) {
      route.color = colors[i % colors.length];
      i++;
    }
  }

  /**
   * Wyłącza ekran ładowania
   */
  private static hideLoadingSpinner() {
    document.getElementById('loading-screen').style.display = 'none';
  }

  /**
   * Włącza ekran ładownaia
   */
  private static showLoadingSpinner() {
    document.getElementById('loading-screen').style.display = 'block';
  }

  /**
   * Ustawia wiadomość na ekranie ładownaia
   * @param message
   */
  private static setLoadingMessage(message) {
    document.getElementById('loading-info').innerText = message;
  }

  private getVRPSolverService(): VrpSolverService {
    return this.xhrVrpSolverService;
  }
}
