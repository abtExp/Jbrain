/* An example network to test the JBrain */

import Network from 'JBrain.js';

var test_net = new Network([3,2,1]);
var train_features = [[10,24,5],[15,20,6],[1,2,3]];
var train_labels = [1,0,0];
test_net.fit(train_features,train_labels,0.5,10,2); 
/* default cost = cross-entropy */
var pred = test_net.predict([10,8,2]);
console.log(pred);