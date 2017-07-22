module.exports = function($log){

   var srv = this;
   srv.logs = [];

   srv.info = function(message){
     let msg = "[INFO] " + JSON.stringify(message);;
     $log.info(msg);
     srv.logs.push(msg);
   }

}
