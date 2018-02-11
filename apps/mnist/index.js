import { Network, Layers } from 'Jbrain';

import { trainFeatures, trainLabels, validFeatures, validLabels, testFeatures } from './models/mnist';

const { InputLayer, ConvLayer, DropoutLayer, ConnectedLayer, PoolLayer } = Layers;

// Model definition

const model = new Network();

model.add(new InputLayer({ shape: [28, 28, 1, null], preprocess: true, name: 'input' }));

model.add(new ConvLayer({ kernel: [3, 3], filters: 14, activationFunction: 'relu', strides: 1, padding: 'valid' }));

model.add(new PoolLayer({ kernel: [2, 2], strides: 1, type: 'max' }));

model.add(new ConvLayer({ kernel: [3, 3], filters: 28, activationFunction: 'relu', strides: 1, padding: 'valid' }));

model.add(new PoolLayer({ kernel: [2, 2], strides: 1, type: 'max' }));

model.add(new ConvLayer({ kernel: [3, 3], filters: 56, activationFunction: 'relu', strides: 1, padding: 'valid' }));

model.add(new PoolLayer({ kernel: [2, 2], strides: 1, type: 'max' }));

model.add(new ConvLayer({ kernel: [1, 1], filters: 64, activationFunction: 'relu', strides: 1, padding: 'valid' }));

model.add(new ConnectedLayer({ activationFunction: 'relu', shape: [256, null] }))

model.add(new DropoutLayer({ keepProbs: 0.4 }))

model.add(new ConnectedLayer({ activationFunction: 'relu', shape: [128, null] }))

model.add(new DropoutLayer({ keepProbs: 0.4 }))

model.add(new ConnectedLayer({ activationFunction: 'softmax', shape: [10, null] }))

// Compiling model

model.compile();

// training model

model.fit({
    trainFeatures: trainFeatures,
    trainLabels: trainLabels,
    costFunction: 'categoricalCrossEntropy',
    validData: [validFeatures, validLabels],
    eval: true,
    evalEpochs: 2,
    neta: 0.01,
    epochs: 100,
    batchSize: 256,
    optimizer: 'adam'
});

// predictions

const predictions = model.predict(testFeatures);