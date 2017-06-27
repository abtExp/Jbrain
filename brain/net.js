/* JBrain : A neural network implementation in Javascript.
 *
 *
 * Project Name : JBrain
 * Project Code Name : JSimpl
 * Author : Anubhav Tiwari <atworkstudios@gmail.com>
 *
 */
/* Browser support not available , un-comment if using transpiler and comment require
statements for if not in node environment
 * import ndarray from 'vecto';
 * import net_util from 'net_util';
 */
const { sigma_dash,weighted_input,cost_grad,shuffle } = require('../util/net_util'),
cost = require('../util/cost'),
activ = require('../util/activ'),
lyr = require('./util/layers'),
{ sum,product,core } = require('../node_modules/vecto');


/* define a network with net_config representing each layer with the number of 
 * neurons in them : net_config is an array, the length of the array determines the 
 * number of layers and each ith element of net_config defines the number of neurons
 * in the ith layer.
 */

class Network{
    /* Constructor
    * 
    * @net_config : [array ( int )], ( the layer wise representation of the network)
    * @lyr_type : 'String' ( The type of neurons, the layer consists of )
    * Possible types : sigmoid, softmax, relu, etc.
    * @op_lyr : 'String' ( Type of neurons in the output layer )
    */
    
    constructor(net_config,lyr_type='sigmoid',op_lyr='sigmoid'){
        this.net_config = net_config;
		this.lyrs_count = net_config.length;
		this.lyrs = [];

		/* Make Layers by providing input weights and the 
        neuron count for lth layer and also the type of layer */
		for (let i = 1; i < this.lyrs_count-1; i++) {
			this.lyrs.push(new lyr(this.net_config[i], this.net_config[i - 1],lyr_type));
		}
        // output layer
        this.lyrs.push(new lyr(this.net_config[this.lyrs_count-2],this.net_config[this.lyrs_count-1],op_lyr));
    }

    /* Fit the Network (i.e., train) 
    * @train_features : [array], of features for the network to learn on
    * @train_labels : [array], of desired results
    * @neta : number ( float value ), the learning rate
    * @epoch : number ( int ), Number of learning cycles over which the optimisation takes place
    * @cost_fn : 'String', The cost function to be used for optimisation of weights and biases ( learning )
    * @evaluate : !Boolean!, whether to evaluate the learning of the network
    * @eval_epoch : number ( int ), of epochs(learning cycles) after which to evaluate the learning
    * @validate : !Boolean!, whether validation data will be provided for better learning
    * @validate_dat : [array], of validation features to learn better, @validate must be true
    */

    fit({ train_features, train_labels, neta = 0.5, epoch = 10, m = 2, cost_fn = cost.cross_entropy, 
          evaluate=true,eval_epoch=5, validate=false, validate_dat = null }) {
              let n = 0;
              this.input = train_features;
              this.labels = train_labels;

              // Training the network

              while(n<epoch){
                  //forming mini batches
                  let activation = [],
                  x = [], 
                  y = [];
                  [x, y] = shuffle(this.input, m, this.labels);

                  //updating weights and biases
                  for(let i=0; i<x.length; i++){
                    this.SGD();
                  }

                  //EVALUATE
                  if(evaluate){
                      if(n%eval_epoch === 0){
                        this.eval()
                      }
                  }
                  n++;
              }
	}

    /* feed_forward : Calculates the activation of each layer.
    * @input : the input to the input layer
    */
    
    feed_forward(input){
        let  activ = [],
        z = [];
        activ.push(input);
        for(let i=0;i<this.lyrs.length; i++){
            let res = this.lyrs[i].fire(activ[i-1]);
            activ.push(res[0]);
            z.push(res[1]);
        }
        return [activ,z];
    }

    /* SGD : Stochastic Gradient Descent, Stepwise learning
    */

    SGD(){

    }

    /* backpropagation : Calculates the error in activation of every layer */
    backprop(){

    }

    /* eval : evaluates the learning of network by comparing the accuracy */
    eval(){

    }


}