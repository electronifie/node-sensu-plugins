#!/usr/bin/env node

var program = require('commander');

program
  .version('0.0.1')
  .option('-u, --username <username>', 'Username')
  .option('-p, --password <password>', 'Password')
  .option('-H, --hostname <hostname>', 'Server hostname')
  .option('-P, --port <port>', 'Server port')
  .option('-S, --scheme <scheme>', 'Scheme')
  .parse(process.argv);
//if (program.args.length === 0) { program.help(); }

var hostname = program.hostname ? program.hostname : "localhost",
  port = program.port ? program.port : 27017;

var creds = !program.username ? "" : program.username + (program.password ? '/'+program.password+'@' : '@');

// Connection URL
var url = 'mongodb://'+creds+hostname+':'+port;

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

var timestamp = new Date().getTime();

function log(p, v) {
  console.log(program.scheme+'.'+p+'.'+v+'.'+timestamp);
}

var props = [
  'ok',
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
  'cursors.timedOut',
];

// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  //console.log("Connected correctly to server");

  db.admin().serverStatus(function(err, result) {
    var obj = {};

    assert.equal(err, null);

    props.forEach(function(p) {
      log(p, eval('result.'+p));
    });

    db.close();
  });
});

