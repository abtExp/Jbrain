const { Network } = require('./Jbrain');

let net = new Network([5, 10, 4]);

let train_features = [
    [1, 1, 1, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 1, 0, 0],
    [0, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 1],
    [1, 0, 0, 1, 0],
    [0, 0, 0, 0, 1]
];
let train_labels = [
    [1, 1, 1, 1],
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [0, 1, 1, 1],
    [0, 0, 1, 0],
    [0, 1, 0, 0],
    [1, 1, 0, 0],
    [0, 0, 0, 0]
];

net.fit({ train_features, train_labels, neta: 0.5, epoch: 1, m: 3 });

let test_features = [1, 1, 1, 0, 1];
console.log(net.predict(test_features));

// console.log(net.lyrs[0].weights);

// console.log(net.feed_forward(train_features[5])[0]);