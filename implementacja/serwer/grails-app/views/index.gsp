<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="main"/>

    <asset:javascript src="sockjs.js"/>
    <asset:javascript src="jquery.js"/>
    <asset:javascript src="stomp.js"/>

    <script type="text/javascript">
        $(function() {
            var socket = new SockJS("http://localhost:9090/stomp");
            var client = Stomp.over(socket);

            var headers = {
                Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                passcode: 'mypasscode'
            };

            client.connect(headers, function() {
                client.subscribe("/topic/hello", function(message) {
                    $("#helloDiv").append(message.body);
                });
            });

            $("#helloButton").click(function() {
                client.send("/app/hello", {}, JSON.stringify("world"));
            });
        });
    </script>
</head>
<body>
<button id="helloButton">hello</button>
<div id="helloDiv"></div>
</body>
</html>