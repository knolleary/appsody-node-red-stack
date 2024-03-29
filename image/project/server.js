// Requires statements and code for non-production mode usage
if (!process.env.NODE_ENV || !process.env.NODE_ENV === 'production') {
  // require('appmetrics-dash').attach();
}

const RED = require('node-red');
const express = require('express');
const health = require('@cloudnative/health-connect');
const fs = require('fs');
const path = require('path');

// require('appmetrics-prometheus').attach();
const PORT = process.env.PORT || 3000;

const app = express();
const server = require('http').createServer(function(req,res) {app(req,res);});

const basePath = path.join(__dirname,'/user-app/');

// Default flow file
let flowFile = path.join(basePath, 'flow.json');

// Load project package file
let rawPackage = fs.readFileSync(path.join(basePath, 'package.json'));
let package = JSON.parse(rawPackage);

if (package['node-red']) {
    let nrSettings = package['node-red'].settings || {};
    if (nrSettings.flowFile) {
        flowFile = nrSettings.flowFile;
    }
}

let appSettings = {};

// Load runtime settings
try {
    appSettings = require(path.relative(__dirname, path.join(basePath,"settings.js")));
} catch(err) {
    // No app-specific settings
}

if (!appSettings.flowFile) {
    appSettings.flowFile = flowFile;
}
appSettings.userDir = path.join(basePath,".node-red");


appSettings.httpAdminRoot = '/admin';

// Requires statements and code for non-production mode usage
if (!process.env.NODE_ENV || !process.env.NODE_ENV === 'production') {

}

RED.init(server,nrRuntimeSettings);
app.use(nrRuntimeSettings.httpAdminRoot,RED.httpAdmin);
app.use('/',RED.httpNode);

const healthcheck = new health.HealthChecker();
app.use('/live', health.LivenessEndpoint(healthcheck));
app.use('/ready', health.ReadinessEndpoint(healthcheck));
app.use('/health', health.HealthEndpoint(healthcheck));

app.get('*', (req, res) => {
  res.status(404).send("Not Found");
});

RED.start().then(function() {
    server.on('error', function(err) {
        if (err.stack) {
            RED.log.error(err.stack);
        } else {
            RED.log.error(err);
        }
        process.exit(1);
    });
    server.listen(PORT,function() {
        RED.log.info(RED.log._("server.now-running"));
    });
});

// Export server for testing purposes
module.exports.server = server;
module.exports.PORT = PORT;
