/* An example network to test the JBrain */

import Network from 'JBrain.js';

var test_net = new Network([3,2,1]);
var train_features = [[1000,2400,500],[1500,2000,600],[100,200,300]];
var train_labels = [1,0,0];
test_net.fit(train_features,train_labels,0.5,10,2); 
/* default cost = cross-entropy */
var pred = test_net.predict([1000,800,200]);
console.log(pred);