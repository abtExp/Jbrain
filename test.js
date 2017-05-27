var Jbrain = require('./Jbrain');

var net = new Jbrain.Network([3,2,1]);

var train_features = [[1,2,3],[4,2,0],[0,0,0]];
var train_labels = [0,1,0];

net.fit({train_features,train_labels, epoch: 4});

var predict = net.predict([2,1,0]);
console.log(predict);