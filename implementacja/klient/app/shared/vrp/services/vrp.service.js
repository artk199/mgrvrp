module.exports = function VRPService(logger) {
	this.addDepot = function(latlng){
		logger.info("Adding deport at "+latlng);
	};
}
