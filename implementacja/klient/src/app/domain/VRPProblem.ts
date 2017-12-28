import {VRPDepot} from './VRPDepot';
import {VRPCustomer} from './VRPCustomer';


/**
 * Informacje na temat problemu.
 */
export class VRPProblem {

  id: string;
  customers: VRPCustomer[];
  depots: VRPDepot[];
  settings = {
    algorithm: "savings"
  };

  constructor(id: string) {
    this.id = id;
    this.customers = [];
    this.depots = [];
  }

  public addCustomer(customer: VRPCustomer) {
    this.customers.push(customer);
  }

  public setDepot(depot: VRPDepot) {
    this.depots = [depot];
  }

}
