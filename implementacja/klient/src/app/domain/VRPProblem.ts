import {VRPDepot} from './VRPDepot';
import {VRPCustomer} from './VRPCustomer';
import {serialize, Type} from 'class-transformer';
import {VRPSolution} from './VRPSolution';
import {VRPAlgorithm} from './VRPAlgorithm';


/**
 * Informacje na temat problemu.
 */

export class PaneType {
  static EARTH = 'earth';
  static SIMPLE = 'simple';
}

export class VRPProblem {

  id: string;
  paneType: string;
  capacity: number = 200;

  algorithm: VRPAlgorithm;

  @Type(() => VRPCustomer)
  customers: VRPCustomer[];

  @Type(() => VRPDepot)
  depots: VRPDepot[];

  solutions: VRPSolution[];
  solutionsInProgress: VRPSolution[];

  settings = [
    {code: 'algorithm', value: 'savings'},
    {code: 'distance', value: 'air'},
    {code: 'geo_distance', value: 'spherical'},
    {code: 'capacity', value: 200},
    {code: 'type', value: 'MAP'}
  ];

  constructor(id: string) {
    this.id = id;
    this.customers = [];
    this.depots = [];
    this.solutions = [];
    this.paneType = PaneType.EARTH;
    this.algorithm = VRPAlgorithm.algorithms[0];
  }

  public addCustomer(customer: VRPCustomer) {
    this.customers.push(customer);
  }

  public setDepot(depot: VRPDepot) {
    this.depots = [depot];
  }

  serializeWithoutSolutions() {
    return serialize(this, {excludePrefixes: ['solutions']});
  }
}
