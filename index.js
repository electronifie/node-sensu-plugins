#!/usr/bin/env node

var program = require('commander');

program
  .version('0.0.1')
  .option('-u, --username <username>', 'Username')
  .option('-p, --password <password>', 'Password')
  .option('-H, --hostname <hostname>', 'Server hostname')
  .option('-P, --port <port>', 'Server port')
  .option('-S, --scheme <scheme>', 'Scheme')
  .option('-d, --debug', 'Debug mode - write extra info to stderr')
  .parse(process.argv);

// Handle arguments
var hostname = program.hostname ? program.hostname : "localhost",
  port = program.port ? program.port : 27017,
  creds = !program.username ? "" : program.username + (program.password ? '/'+program.password+'@' : '@'),
  scheme = program.scheme ? program.scheme : 'mongodb';
  debugEnabled = program.debug ? true : false;

// Connection URL
var url = 'mongodb://'+creds+hostname+':'+port;

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

var timestamp = new Date().getTime();

// Writes scheme.prop.resul.timestamp to stdout
function log(p, v) {
  console.log(scheme+'.'+p+'.'+v+'.'+timestamp);
}

function logDebug(s) { if (debugEnabled) console.error(s); }

// Utility to evaluate dot-notation path of object properties/subproperties
function evalPath(obj, path) {
  return path.split('.').reduce(function(o, i) { return o[i];}, obj);
}

// Define the properties that you want to monitor here.  These are all from the results of db.serverStatus() run
// form a mongo shell (or db.admin().serverStatus() from Node.js);
var props = [
  'ok', // basically just confirming that serverStatus() was executed correctly
  'globalLock.totalTime',
  'globalLock.currentQueue.total',
  'globalLock.currentQueue.readers',
  'globalLock.currentQueue.writers',
  'globalLock.activeClients.total',
  'globalLock.activeClients.readers',
  'globalLock.activeClients.writers',
  'extra_info.page_faults',
  'mem.resident',
  'mem.virtual',
  'mem.mapped',
  'asserts.warning',
  'cursors.totalOpen',
  'cursors.totalNoTimeout',
  'cursors.timedOut'
];

// Connect and run everything
logDebug("Attempting to connect to "+url);
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  logDebug("Connected correctly to "+url);

  db.admin().serverStatus(function(err, result) {
    var obj = {};

    assert.equal(err, null);

    props.forEach(function(p) {
      var res = evalPath(result, p);
      logDebug("Property '"+p+"' returned: "+res);
      if (typeof res !== 'undefined') {
        log(p, res); 
      } else {
        logDebug("Ignoring undefined result for "+p);
      }
    });

    logDebug("Closing connection to "+url);
    db.close();
  });
});

