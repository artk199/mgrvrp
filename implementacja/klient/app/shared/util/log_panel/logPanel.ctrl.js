module.exports = function($stomp, $scope, $log){
    let ctrl = this;

    $scope.wssData = ['ss'];

    $stomp.connect('http://localhost:9090/stomp').then(
        function (frame) {
          console.log(frame);
          var subscription =
            $stomp.subscribe('/topic/hello', function (payload, headers, res) {
              $scope.wssData.push(payload.content.message);
              console.log(payload.content.message);
              //console.log(ctrl.wssData);
            },{});

        //   $stomp.disconnect().then(function () {
        //     $log.info('disconnected')
        // })
      })

}
