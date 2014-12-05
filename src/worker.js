var synaptic = require('./synaptic'); // this line is not needed in the browser
var log = require('./log'); // this line is not needed in the browser
var Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;

function Perceptron(input, hidden, output)
{
    // create the layers
    var inputLayer = new Layer(input);
    var hiddenLayer = new Layer(hidden);
    var outputLayer = new Layer(output);

    // connect the layers
    inputLayer.project(hiddenLayer);
    hiddenLayer.project(outputLayer);

    // set the layers
    this.set({
        input: inputLayer,
        hidden: [hiddenLayer],
        output: outputLayer
    });
}

module.exports = {
    Worker: function(num, dataset){
        // extend the prototype chain
        Perceptron.prototype = new Network();
        Perceptron.prototype.constructor = Perceptron;
        log.workerLog("Opening Layers", num);
        // create the network
        var inputLayer = new Layer(2);
        var hiddenLayer = new Layer(3);
        var outputLayer = new Layer(1);
        var progressEcho = 0;
        log.workerLog("Projecting Neurons", num);
        inputLayer.project(hiddenLayer);
        hiddenLayer.project(outputLayer);
        log.workerLog("Linking Network", num);
        var myNetwork = new Network({
            input: inputLayer,
            hidden: [hiddenLayer],
            output: outputLayer
        });
        log.workerLog("Training Network", num);
        // train the network
        var learningRate = .3;
        for (var i = 0; i < 20000; i++)
        {
            // 0,0 => 0
            myNetwork.activate([0,0]);
            myNetwork.propagate(learningRate, [0]);

            // 0,1 => 1
            myNetwork.activate([0,1]);
            myNetwork.propagate(learningRate, [1]);

            // 1,0 => 1
            myNetwork.activate([1,0]);
            myNetwork.propagate(learningRate, [1]);

            // 1,1 => 0
            myNetwork.activate([1,1]);
            myNetwork.propagate(learningRate, [0]);

            progressEcho++;
            if(progressEcho >= 100000){
                log.workerLog(-(Math.round((output[0] - targetOutput[0])*10000)-100)+"%", num);
                progressEcho = 0;
            }
        }

        log.workerLog("Testing Network", num);

        // test the network
        if(Math.round(myNetwork.activate([0,0])) == 0){
            log.workerLog("Test 1 Pass", num);
        }else{
            log.workerWarn("Test 1 Fail", num);
        }
        if(Math.round(myNetwork.activate([0,1])) == 1){
            log.workerLog("Test 2 Pass", num);
        }else{
            log.workerWarn("Test 2 Fail", num);
        }
        if(Math.round(myNetwork.activate([1,0])) == 1){
            log.workerLog("Test 3 Pass", num);
        }else{
            log.workerWarn("Test 3 Fail", num);
        }
        if(Math.round(myNetwork.activate([1,1])) == 0){
            log.workerLog("Test 4 Pass", num);
        }else{
            log.workerWarn("Test 4 Fail", num);
        }
    }
}