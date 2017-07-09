/* JBrain : A neural network implementation in Javascript.
 *
 *
 * Project Name : JBrain
 * Project Code Name : JSimpl
 * Author : Anubhav Tiwari <atworkstudios@gmail.com>
 *
 */

/* Support not available , un-comment if using transpiler
 * import { ndarray, sum, product, core } from '../node_modules/vecto';
 * import { cost_grad, shuffle } from '../util/net_util';
 * import cost form '../util/cost';
 * import lyr from '../util/layers';
 */
const { cost_grad,shuffle } = require('../util/net_util'),
cost = require('../util/cost'),
lyr = require('../util/layers'),
{ ndarray,sum,product,core } = require('../node_modules/vecto');


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
        this.activ_ = [];
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
    * @neta : fl.oat value, the learning rate
    * @epoch : int , Number of learning cycles over which the optimisation takes place
    * @cost_fn : 'String', The cost function to be used for optimisation of weights and biases ( learning )
    * @evaluate : !Boolean!, whether to evaluate the learning of the network
    * @eval_epoch : int , of epochs(learning cycles) after which to evaluate the learning
    * @validate : !Boolean!, whether validation data will be provided for better learning
    * @validate_dat : [array], of validation features to learn better, @validate must be true
    *
    * Returns : Nothing, Just optimises the neurons's weights and biases.
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
                      let a = [],
                          z = [],
                       delw = [],
                       delb = [];

                      [a,z] = this.feed_forward(x[i]);
                      this.z = z;
                      this.activations = a;
                      [delw, delb] = this.backprop(a[this.lyrs_count-1],y[i]);
                      this.SGD(neta, m, cost_fn, delw, delb);
                  }

                  //EVALUATE
                  if(evaluate){
                      if(n%eval_epoch === 0){
                        this.eval();
                      }
                  }
                  n++;
              }
	}

    /* feed_forward : Calculates the activation of each layer.
    * @input : [array] , the input to the input layer
    * Returns : [a,z] ,  An array containing Activations of each layer
    *           and also the weighted inputs for each layer.  
    */
    
    feed_forward(input){
        let  activ = [],
             z = [],
             activ_ = [];

        activ.push(input);
        for(let i=0;i<this.lyrs.length; i++){
            let res = this.lyrs[i].fire(activ[i-1]);
            activ.push(res[0]);
            z.push(res[1]);
            activ_.push(this.lyrs[i].activ_dash(z[i]));
        }

        this.activ_ = activ_;
        return [activ,z];
    }

    /* SGD : Stochastic Gradient Descent, Stepwise learning 
    * @neta : fl.oat value, the learning rate
    * @m : int , the number of epochs
    * @cost : 'String' , the name of the cost function,
    *         currently only 'quad_cost' and 'cross_entropy' are 
    *         supported
    * @delw : [array[ndarrays]] , the dc/dw
    * @delb : [array[ndarrays]] , the dc/db
    * Returns : Nothing , just performs gradient descent and optimises weights
    *           and biases
    */
    SGD(neta, m, cost, delw, delb){
        let factor = (-(neta/m));

        //optimising weights and biases
        for(let i=0; i<this.lyrs.length-1; i++){
            delw[i].arrange(product(delw[i].array,factor));
            delb[i].arrange(product(delb[i].array,factor));
            this.lyrs[i].weights.add(delw[i]);
            this.lyrs[i].biases.add(delb[i]);
        }
    }

    /* backpropagation : Calculates the error in activation of every layer 
    * @a : [array] , The activation of the output layer
    * @y : [array] , The labels(desired output) for given input
    * Returns : [delw,delb], delw is an array of ndarrays having error in weights
    *           of every layer and delb is array of ndarrays having errors in biases
    */
    backprop(a,y){
        let delw = [],
            delb = [],
            grad_c = cost_grad(a,y),
            delta = [];

        for(let i=0; i<this.lyrs.length; i++){
            delw.push(ndarray.zeroes(this.lyrs[i].weights.shape));
            delb.push(ndarray.zeroes(this.lyrs[i].biases.shape));
        }

        delta[this.lyrs.length-1] = (product(grad_c,this.activ_[this.lyrs_count-2],'dot'));
        
        //backpropogation
        for(let i=this.lyrs.length-2; i>=0; i--){
            for(let j=0; j<this.lyrs[i+1].weights.array.length; j++){
                let wt = core.transpose(this.lyrs[i+1].weights.array[j]);
                let part_act = product(wt,delta[i+1],'matrix');
                delta[i] = product(part_act,this.activ_[i],'dot');
            }
        }

        //needs to be tested
        for(let i=0; i<this.lyrs.length; i++){
            let part = product(this.activations[i],delta[i]);
            let fpart = [];
            core.flatten(part,fpart);
            delw[i].arrange(fpart);
            delb[i].arrange(delta[i]);
        }

        return [delw, delb];

    }

    /* eval : evaluates the learning of network by comparing the accuracy */
    eval(){

    }

    /* predict : Predicts the output for the given test feature 
    * @test_features : [array] , The features for which the prediction is 
    *                  to be made.
    * Returns : [array] , The activation of the output layer.                       
    */
    predict(test_features){
        return this.feed_forward(test_features)[0][this.lyrs_count-1];
    }
}

module.exports = Network;
