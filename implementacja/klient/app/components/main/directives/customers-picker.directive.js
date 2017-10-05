module.exports = function(){
  return{
    restrict: 'E',
    templateUrl: 'templates/main/customersPicker.html',
    scope: {
      customers: "="
    },
    link: function(scope){
      scope.addCustomer = function(){
        scope.customers.push({top:50,left:50});
      }
    }

  }
}
