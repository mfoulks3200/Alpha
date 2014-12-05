var synaptic = require('./synaptic'); // this line is not needed in the browser
var log = require('./log'); // this line is not needed in the browser
var worker = require('./worker'); // this line is not needed in the browser

log.log("System Started");
log.log("Alpha Built By Github User Mfoulks3200");
log.log("SynapticJS Built By Github User Cazala");
log.log("Imports Successfull");

for (var i = 0; i < 20; i++){
	worker.Worker(i);
}