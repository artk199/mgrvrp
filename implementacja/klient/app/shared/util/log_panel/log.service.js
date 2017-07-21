module.exports = function(){

   var srv = this;
   srv.logs = [];

   srv.info = function(message){
     srv.logs.push("[INFO] " + message);
   }

}
