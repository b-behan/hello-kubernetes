var express = require('express');
var exphbs  = require('express-handlebars');
var app = express();
var os = require("os");
var morgan  = require('morgan');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static('static'));
app.use(morgan('combined'));

// Configuration
var port = process.env.PORT || 8080;
var message = process.env.MESSAGE || "Hello world!";
var nodeName = process.env.K8S_NODE_NAME;
var podNamespace = process.env.K8S_POD_NAMESPACE;
var podName = process.env.K8S_POD_NAME;
var podLabels = process.env.K8S_PODLABELS;
var hostIp = process.env.K8S_HOST_IP;
var podIp = process.env.K8S_POD_IP;

app.get('/', function (req, res) {
    res.render('home', {
      message: message,
      platform: os.type(),
      release: os.release(),
      hostName: os.hostname(),
      nodeName: nodeName,
      podNamespace: podNamespace,
      podName: podName,
      podLabels: podLabels,
      podIp: podIp,
      hostIp: hostIp,
    });
});

// Set up listener
app.listen(port, function () {
  console.log("Listening on: http://%s:%s", os.hostname(), port);
});