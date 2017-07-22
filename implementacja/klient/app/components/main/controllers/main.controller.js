module.exports = function(VRPService){
    let ctrl = this;
    ctrl.solve = function(){
      VRPService.solve();
    }

  }
