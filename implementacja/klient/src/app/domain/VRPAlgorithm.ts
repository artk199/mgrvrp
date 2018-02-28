export class VRPAlgorithm {

  constructor(public code: string,
              public description: string,
              public additionalSettings: any) {
  }

  public static algorithms: VRPAlgorithm[];

  static initialize() {
    this.algorithms = [
      new VRPAlgorithm('savings', 'Clarke and Wright (C & W)', []),
      new VRPAlgorithm('jsprit', 'JSprit? Metaheuristic', []),
      new VRPAlgorithm('random', 'Randomized Insertion (RandIns)', [{
        code: 'attempts',
        description: 'Attempts',
        type: 'NUMBER',
        value: 1
      }]),
      new VRPAlgorithm('greedyFirst', 'Nearest Neighbor (NN)', []),
      new VRPAlgorithm('tabu', 'Tabu search', [
        {
          code: 'iterations',
          description: 'Iterations',
          type: 'NUMBER',
          value: 100
        }
      ])
    ];
  }

}

VRPAlgorithm.initialize();
