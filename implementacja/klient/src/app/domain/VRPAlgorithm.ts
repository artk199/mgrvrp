export class VRPAlgorithm {

  constructor(public code: string,
              public description: string,
              public additionalSettings: any,
              public active: boolean = true) {
  }

  public static algorithms: VRPAlgorithm[];

  static initialize() {
    this.algorithms = [
      new VRPAlgorithm('random', 'Randomized Insertion (RandIns)', [
        {
          code: 'attempts',
          description: 'Attempts',
          type: 'NUMBER',
          value: 1
        }]),
      new VRPAlgorithm('savings', 'Clarke and Wright (C & W)', [{
        code: 'type',
        description: 'Type',
        type: 'SELECT',
        value: 'parallel',
        opts: [{v: 'parallel', k: 'Parallel'}, {v: 'sequential', k: 'Sequential'}]
      }]),
      new VRPAlgorithm('greedyFirst', 'Nearest Neighbor (NN)', []),
      new VRPAlgorithm('tabu', 'Tabu search', [
        {
          code: 'iterations',
          description: 'Iterations',
          type: 'NUMBER',
          value: 100
        }
      ], false),
      new VRPAlgorithm('jsprit', 'JSprit', []),
      new VRPAlgorithm('googleOR', 'Google Optimization Tools', []),
    ];
  }

}

VRPAlgorithm.initialize();
