var { Network } = require('./Jbrain');

var net = new Network([3,2,1]);
console.log(net);

var n2 = new Network([4,4,2,2,1]);
console.log(n2);

console.log(net.feed_forward([1,1,1])[0]);