module.exports = function VRPService(logger, $http, $stomp,$q) {

  let url = "http://localhost:9090/vrp"
  let srv = this;

  this.problem = {
    depots: [],
    customers: [],
    fleet: {
      size: 5
    }
  }

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

  this.solve2 = function() {
    return $http({
      method: 'POST',
      data: this.problem,
      url: url
    });
  }

  this.solve = function() {
		var deferred = $q.defer();

			let promise = this;
      $stomp.connect('http://localhost:9090/stomp').then(
        function(frame) {
          var subscription =
            $stomp.subscribe('/topic/hello', function(payload, headers, res) {
              if(payload.content.type === 'END'){
								subscription.unsubscribe();
								deferred.resolve(payload.content.message);
							}
							if(payload.content.type === 'STEP'){
								deferred.notify(payload.content.message);
							}
							if(payload.content.type === 'INFO'){
								logger.info(payload.content.message)
							}
              console.log(payload);
            }, {});
          $stomp.send('/app/vrp', srv.problem, {});
        });

    return deferred.promise;
  }

}
