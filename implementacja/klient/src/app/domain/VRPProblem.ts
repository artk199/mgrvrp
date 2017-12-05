import {VRPDepot} from './VRPDepot';
import {VRPCustomer} from './VRPCustomer';

/**
 * Informacje na temat problemu.
 */
export class VRPProblem {

  id: string;
  customers: VRPCustomer[];
  depots: VRPDepot[];

  constructor(id: string) {
    this.id = id;
    this.customers = [];
    this.depots = [];
  }

}
