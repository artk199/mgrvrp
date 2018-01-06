import {VRPDepot} from './VRPDepot';
import {VRPCustomer} from './VRPCustomer';
import {Type} from 'class-transformer';
import {VRPSolution} from './VRPSolution';


/**
 * Informacje na temat problemu.
 */
export class VRPProblem {

  id: string;

  @Type(() => VRPCustomer)
  customers: VRPCustomer[];

  @Type(() => VRPDepot)
  depots: VRPDepot[];

  solutions: VRPSolution[];

  settings = {
    algorithm: "savings",
    distance: "air",
    geo_distance: "spherical",
    capacity: 200
  };

  constructor(id: string) {
    this.id = id;
    this.customers = [];
    this.depots = [];
    this.solutions = [];
  }

  public addCustomer(customer: VRPCustomer) {
    this.customers.push(customer);
  }

  public setDepot(depot: VRPDepot) {
    this.depots = [depot];
  }

}
