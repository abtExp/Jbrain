const { Network } = require('./Jbrain');

let net = new Network([3,2,1]);

let train_features = [[1,1,1],[1,1,0],[1,0,1],[0,1,1],[0,0,1],[0,1,0],[1,0,0],[0,0,0]];
let train_labels = [1,1,1,1,0,0,0,0];

//net.fit({train_features,train_labels,neta:0.25,epoch:1,m:6});
// console.log(net.input);

// let test_features = [0,0,0];
// console.log(net.predict(test_features));

// console.log(net.lyrs[0].weights);

console.log(net.feed_forward(train_features[5])[0]);