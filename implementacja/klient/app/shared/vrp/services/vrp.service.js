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
    srv.problem.depots.push({
      coordinates: {
        x: lat,
        y: lng
      }
    });
    logger.info("Adding deport at " + lat + " " + lng);
  };

  this.addCustomer = function(lat, lng) {
    srv.problem.customers.push({
      coordinates: {
        x: lat,
        y: lng
      }
    });
    logger.info("Adding customer at " + lat + " " + lng);
  }

  this.solve = function() {
    var deferred = $q.defer();
    let promise = this;
    $stomp.connect('http://localhost:9090/stomp').then(
      function(frame) {
        var subscription =
          $stomp.subscribe('/topic/hello', function(payload, headers, res) {
            handleMessage(payload,deferred,subscription);
          }, {});
        $stomp.send('/app/vrp', srv.problem, {});
      });
    return deferred.promise;
  }

  this.clearData = function() {
    logger.info("Clearing VRP data.");
    srv.problem = defaultProblem;
  }

  function handleMessage(payload,deferred,subscription) {
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
