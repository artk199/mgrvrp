module.exports = function VRPService(logger,$http) {

	let url = "http://localhost:9090/vrp"
	let srv = this;

	this.problem = {
		depots : [],
		customers : [],
		fleet : {
			size : 5
		}
	}

	this.addDepot = function(lat,lng){
		srv.problem.depots.push({
			coordinates:{
				x:lat,
				y:lng
			}
		});
		logger.info("Adding deport at "+lat+" "+lng);
	};

	this.addCustomer = function(lat,lng){
		srv.problem.customers.push({
			coordinates:{
				x:lat,
				y:lng
			}
		});
		logger.info("Adding customer at "+lat+" "+lng);
	}

	this.solve = function(){
		return $http({
				method: 'POST',
				data: this.problem,
				url: url
		});
	}

}
