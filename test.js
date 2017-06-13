const { Network } = require('./Jbrain');

let net = new Network([3,2,1]);

let train_features = [[1,1,1],[1,1,0],[1,0,1],[0,1,1],[0,0,1],[0,1,0],[1,0,0],[0,0,0]];
let train_labels = [1,1,1,1,0,0,0,0];

net.fit({train_features,train_labels,neta:0.25,epoch:100,m:4});
// console.log(net.input);

let test_features = [0,0,0];
console.log(net.predict(test_features));