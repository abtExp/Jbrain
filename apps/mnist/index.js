import { Network, Layers } from 'Jbrain';

import { trainFeatures, trainLabels, validFeatures, validLabels, testFeatures } from './models/mnist';

const { InputLayer, ConvLayer, DropoutLayer, ConnectedLayer, PoolLayer } = Layers;

// Model definition (Method 1)

const model = new Network();

model.add(new InputLayer({ shape: [null, 28, 28, 1], preprocess: true, name: 'input' }));

model.add(new ConvLayer({ kernel: [3, 3], filters: 14, activationFunction: 'relu', strides: 1, padding: 'valid' }));

model.add(new PoolLayer({ kernel: [2, 2], strides: 1, type: 'max' }));

model.add(new ConvLayer({ kernel: [3, 3], filters: 28, activationFunction: 'relu', strides: 1, padding: 'valid' }));

model.add(new PoolLayer({ kernel: [2, 2], strides: 1, type: 'max' }));

model.add(new ConvLayer({ kernel: [3, 3], filters: 56, activationFunction: 'relu', strides: 1, padding: 'valid' }));

model.add(new PoolLayer({ kernel: [2, 2], strides: 1, type: 'max' }));

model.add(new ConvLayer({ kernel: [1, 1], filters: 64, activationFunction: 'relu', strides: 1, padding: 'valid' }));

model.add(new ConnectedLayer({ activationFunction: 'relu', shape: [null, 256] }))

model.add(new DropoutLayer({ keepProbs: 0.4 }))

model.add(new ConnectedLayer({ activationFunction: 'relu', shape: [null, 128] }))

model.add(new DropoutLayer({ keepProbs: 0.4 }))

model.add(new ConnectedLayer({ activationFunction: 'softmax', shape: [null, 10] }))


// training model

model.fit({
    trainFeatures: trainFeatures,
    trainLabels: trainLabels,
    oneHot: true,
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