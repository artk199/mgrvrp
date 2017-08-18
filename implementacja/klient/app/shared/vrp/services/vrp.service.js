module.exports = function VRPService(logger, $http, $stomp, $q) {

  let srv = this;

  let config = {
    serviceURL: "http://localhost:9090/vrp"
  };

  let defaultProblem = {
    depots: [],
    customers: [],
    fleet: {
      size: 5
    }
  };

  this.problem = defaultProblem;

  this.addDepot = function(lat, lng) {
    this.problem.depots = []
    let depot = {
      coordinates: {
        x: lat,
        y: lng
      },
      id: 0
    }
    srv.problem.depots.push(depot);
    logger.info("Adding deport at " + lat + " " + lng);
    return depot;
  };

  this.addCustomer = function(lat, lng) {
    let id = 0;
    if(srv.problem.customers.length > 0)
      id = srv.problem.customers[srv.problem.customers.length-1].id+1
    let customer = {
      coordinates: {
        x: lat,
        y: lng
      },
      demand: 50,
      id: id
    }
    srv.problem.customers.push(customer);
    logger.info("Adding customer at " + lat + " " + lng);
    return customer;
  }

  this.solve = function(settings) {
    var deferred = $q.defer();
    let promise = this;
    $stomp.connect('http://localhost:9090/stomp').then(
      function(frame) {
        var subscription =
          $stomp.subscribe('/topic/hello', function(payload, headers, res) {
            handleMessage(payload, deferred, subscription);
          }, {});
        $stomp.send('/app/vrp', { problem: srv.problem, settings: settings }, {});
      },
      function() {
        deferred.reject("Błąd połączenia z serwerem.");
      });
    return deferred.promise;
  }

  this.clearData = function() {
    logger.info("Clearing VRP data.");
    srv.problem = defaultProblem;
  }

  function handleMessage(payload, deferred, subscription) {
    if (payload.content.type === 'RUNTIME_ERROR') {
      subscription.unsubscribe();
      deferred.reject(payload.content.message);
    }
    if (payload.content.type === 'END') {
      subscription.unsubscribe();
      deferred.resolve(payload.content.message);
    }
    if (payload.content.type === 'STEP') {
      deferred.notify(payload.content.message);
    }
    if (payload.content.type === 'INFO') {
      logger.info(payload.content.message)
    }
    console.log(payload);
  }



}
