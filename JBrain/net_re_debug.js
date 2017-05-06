class Vector{
	constructor(shape=[],arr=[]){
		this.array = arr;
		this.shape = ((shape.length)>0) ? shape : (this.calc_shape(this.array));
		this.size = this.calc_size(this.shape);
		this.dim = this.find_dim();
		this.flat = [];
		Vector.flatten(this.array,this.flat);
	}
	
	/* class specific (static) methods */
    /* form a new vector for the given array */
	static array(arr){
		return new Vector([],arr);
	}

    /* make a new zero Vector */
	static zeroes(shape){
		var arr;
		if(shape.length == 1){
			arr = Vector.fill(shape[0],0);
		}
		else{
			var base_arr = Vector.fill(shape[shape.length-1],0);
			for(var i=shape.length-2; i>=0; i--){
				arr = [];
				for(var j=0; j<shape[i]; j++){
					arr.push(base_arr);
				}
				base_arr = arr;
			}
		}
		return new Vector(shape,arr);
	}

   	
   /* sum of 2 vectors */
   static add(v1,v2){
	   if(v1.size === v2.size){
		   var sum = [];
		   for(var i=0; i<v1.flat.length; i++){
			   sum[i] = v1.flat[i] + v2.flat[i];
		   }
		   var v = new Vector(v1.shape);
		   v.arrange(sum);
		   return v;
	   }
	   else{
		   return new Error("Unequal Size");
	   }
   }

   /* function to convert n-dimension array into 1-D array */

	static flatten(arr,tarr){
		for(var i of arr){
			if(Array.isArray(i)){
				Vector.flatten(i,tarr);
			}
			else{
				tarr.push(i);
			}
	    }
	}


   /* fills the vector acc to passed args */
   static fill(len, ...args){
		var arr = [];
	  var i;
		if(!args || args.length === 0){
			for(i=0; i<len; i++){
				arr[i] = Math.random();
			}
		}
		else{
			if(args.length === 1){
				if(Array.isArray(args[0])){
					var j=0;
					for(i=0; i<len; i++){
						arr[i] = args[0][j++];
						if(j>=args[0].length){
							j=0;
						}
					}
				}
				else{
					for(i=0; i<len; i++){
						arr[i] = args[0];
					}
				}
			}
			else{
				var min;
				var num = min = args[0];
				var max = args[1];
				for(i=0; i<len; i++){
					arr[i] = num++;
					if(num>max){
						num = min;
					}
				}
			}
		}
		return arr;
	}


 /* -------------------------------------------------------------------------------------------------------------------------------------------- */   
	
	/* object specific (property) methods */

	/* find the shape of the given array */
	
	find_dim(){
		return this.shape.length;
	}
	
	calc_shape(arr){
		var shape = [];
		shape.push(arr.length);
		var a = arr[0];
		while(Array.isArray(a)){
			shape.push(a.length);
			a = a[0];
		}
		return shape;
	}

	/* find the size of the array */
	calc_size(shape){
		var size = 1;
		for(var i of shape){
			size *= i;
		}
		return size;
	}

  
	/* a method to arrange or create a Vector from the given elements */
	arrange(elems_arr){
		var dim = this.dim;
		var base_arr_size = this.shape[dim-1];
		var final_arr = [];
		var base_elems = 1, j=0;
		if(dim >= 2){
			base_elems = this.shape[dim-2]; 
		}
		for(var i=0; i<base_elems; i++){
			if(elems_arr){
				var part = [];
				for(var k=0; k<base_arr_size; k++){
					part[k] = elems_arr[j++];
					if(j>=elems_arr.length){
					j=0;
					}
				}
				final_arr.push(Vector.fill(base_arr_size,part));
			}
			else{
				final_arr.push(Vector.fill(base_arr_size));
			}		
		}
		this.array = final_arr;
		this.flat = [];
		Vector.flatten(this.array,this.flat);
	}

	/* reshapes the vector only if for the new shape the number of elements remain same */
	reshape(new_shape){
		if(this.calc_size(new_shape) === this.size){
			/* reshape */
			var temp_arr = this.flat;
			this.shape = new_shape;
			this.dim = this.find_dim();
			this.flat = [];
			this.arrange(temp_arr);
		}
		else{
			return new Error("Resizing error : can't change the size");
		}
	}
	
	/* changes the shape and size of the vector in place */
	resize(new_shape){
		var temp_arr = this.flat;
		this.shape = new_shape;
		this.size = this.calc_size(this.shape);
		this.dim = this.find_dim();
		this.flat = [];
		this.arrange(temp_arr);
	}

	/* function to find the transpose */
	transpose(){
		/* converts row <-> columns */
		/* not that useful to main project as of now */
	}

	/* more to come */
}


/* some generic array methods */

function product(arr1,arr2){
	var prod = [];
	if(!Array.isArray(arr1) && !Array.isArray(arr2)){  
		return arr1*arr2;
	}
	else{
		if(Array.isArray(arr1) && !Array.isArray(arr2)){  
			arr1.forEach((i)=>{
				if(Array.isArray(i)){  
					prod.push(product(i,arr2));   
				}
				else{
					prod.push(i*arr2);
				}
			});
		}
		else if(!Array.isArray(arr1) && Array.isArray(arr2)){
			return product(arr2,arr1);
		}
		else{
			if(Array.isArray(arr1[0]) && !Array.isArray(arr2[0])){  //checking if arg1 is n-d and arg2 is 1-d
				if(arr1[0].length === arr2.length){
					arr1.forEach((j)=>{
						prod.push(product(j,arr2));
					})
				}
				else{
					if(arr1.length === arr2.length){
						var i = 0;
						arr1.forEach((j)=>{
							prod.push(product(j,arr2[i++]));
						})
					}
					else{
						throw new Error("Uneven size!");
					}
				}
			}
			else{
				if(Array.isArray(arr1[0] && Array.isArray(arr2[0]))){
					if(arr1.length === arr2.length){
						for(var i=0; i<arr1.length; i++){
							prod.push(product(arr1[i],arr2[i]));
						}
					}
					else{
						throw new Error("Uneven Size");
					}
				}
				else{
					if(arr1.length === arr2.length){
						for(var i=0; i<arr1.length; i++){
							prod.push(arr1[i]*arr2[i]);
						}
					}
					else{
						throw new Error("Uneven Size");
					}
				}
			}
		}
	}
	return prod;
}

function sum(arr1,arr2){
	var i=0;
	var summ;
	if(!Array.isArray(arr1) && !Array.isArray(arr2)){
		return (arr1+arr2);
	}
		if(!arr2){
			if(Array.isArray(arr1[i])){
				summ = [];
				arr1.forEach((j)=>{
					if(Array.isArray(j)){
						summ.push(sum(j));
					}
				});
			}
			else{
					summ = 0;
					arr1.forEach((j)=>{
						summ += j;
					});
				}
			}
		else{
			if(arr1.length === arr2.length){
				summ = [];
				for(i=0; i<arr1.length; i++){
					summ[i] = arr1[i] + arr2[i];
				}
			}
			else{
				throw new Error("Uneven Size!");
			}
		}
		return summ;
	}



class Network{
    constructor(net_config){
        this.net_config = net_config;
        this.lyrs_count = net_config.length;
        this.weights = [];
        this.biases = [];

        /* Random initialization of weights and biases */
        for(let i=1; i<this.lyrs_count; i++){
            this.weights.push(lyr(this.net_config[i],this.net_config[i-1]));
            this.biases.push(lyr(this.net_config[i]));
        }        
    }

    /* Fit the Network (i.e., train) */

    fit(train_features,train_labels,neta=0.5,epoch=10,m=2,/*cost_fn=cost.cross_entropy,*/activ_fn=sigmoid_function){
        this.input = train_features;
        this.labels = train_labels;
        this.activ_fn = activ_fn;
//         this.cost_fn = cost_fn;
        /* optimise weights and biases for each input example x, by SGD using backprop */
        this.SGD(epoch,neta,m/*cost_fn*/);
    }

    /* Feed forward the activation of each layer as input to next layer 
    and recieve the output of final layer as network's output */

    feed_forward(input,activ_fn){
        var activation = [];
        var Z = [];
        activation.push(input);
        for(let i=1; i<this.lyrs_count; i++){
            let z = weighted_input(this.weights[i-1].array,activation[i-1],this.biases[i-1].array);
            let activ = activ_fn(z);
            activation.push(activ);
            Z.push(z);
        }
        return [activation,Z];
    }

    /* SGD : (Stochastic Gradient Descent), Updates the weights and biases 
    by gradient descent using stochastic/online learning (values of w and b optimised for
    every example rather than averaging over the whole batch as in batch learning)
    */

    SGD(neta,epoch,m/*cost_fn*/){
        var factor = -(neta/m);
        var x,y,delta_w,delta_b;
        while(epoch){
            [x,y] = shuffle(this.input,m,this.labels);
            for(let i=0; i<m; i++){
                [delta_w,delta_b] =  this.backprop(x[i],y[i]);
                /* Optimising weights and biases by gradient descent */
                for(let j=1; j<this.lyrs_count; j++){
                    delta_w[j-1].arrange(product(delta_w[j-1].flat,factor));
                    delta_b[j-1].arrange(product(delta_b[j-1].flat,factor));
                }

                /* Updating the weights and biases */

                for(let j=1; j<this.lyrs_count; j++){
                    this.weights[j-1].arrange(Vector.add(this.weights[j-1],delta_w[j-1]).flat);
                    this.biases[j-1].arrange(Vector.add(this.biases[j-1],delta_b[j-1]).flat);
                }
            }
            epoch--;
        }
    }

    /* backprop : calculates the error or noise in weights and biases and optimises the 
	   weights and biases to give more accurate results and thus modelling learning
	*/

    backprop(x,y){
        var nw = [],nb = [];
        for(let i=1; i<this.lyrs_count; i++){
            nw.push(Vector.zeroes(this.weights[i-1].shape));
            nb.push(Vector.zeroes(this.biases[i-1].shape));
        }

        var a=[],z=[];
        var delta = [];
        [a,z] = this.feed_forward(x,this.activ_fn);
        var grad_c = cost_grad(a[this.lyrs_count-1],y);
        let sig_ = z[z.length-1].map((i)=>{
            return sigma_dash(i);
        });
			

        delta[this.lyrs_count-2] = product(sig_,grad_c);
        /* Backpropagating */
        for(let i=this.lyrs_count-2; i>=1; i--){
            var ele = delta[i].length > 1 ? delta[i] : delta[i][0];
            var part_act = product(this.weights[i-1].array,ele);
					  let sig_ = z[i-1].map((i)=>{
							return sigma_dash(i);
						})
					  delta[i-1] = product(part_act,sig_);
					  console.log(delta[i-1]);
        }
			

        for(let i = 1; i<this.lyrs_count; i++){
					  var arr = [];
					  Vector.flatten(product(delta[i-1],a[i-1]),arr);
				    nw[i-1].arrange(arr);
            nb[i-1].arrange(delta[i-1])
        }

        return [nw,nb];      
    }

    predict(test_features){
        var res = this.feed_forward(test_features);
        return res[res.length-1];
    }

    evaluate(prediction,test_labels){
        return (sum(test_labels,(-1*(predictions))));
    }
}


function lyr(neuron_count,ip_wts,fill_style=1){
	var v;
	if(!ip_wts){
		if(fill_style === 1){
			v = new Vector([neuron_count]);
			v.array = Vector.fill(neuron_count);
		}
		else{
			v = Vector.zeroes([neuron_count]);
		}
	}
	else{
		if(fill_style === 1){
			v = new Vector([neuron_count,ip_wts]);
			v.arrange();
		}
		else{
			v = Vector.zeroes([neuron_count,ip_wts]);
		}
	}
	return v;
}
	

/* sigmoid_function : performs the sigmoid activation function */

function sigmoid_function(z){
	if(!Array.isArray(z)){
		return (1/1+(Math.exp(-z)));
	}
	else{
		var wip = z.map((i)=>{
			return (1/(1+(Math.exp(-i))));
		});

		return wip;
	}
}

/* weighted_input : calculates sigma(w*x) + b */

function weighted_input(w,x,b){
	console.log("calculating z for : ");
	console.log(w);
	console.log(x);
	console.log(b);
	var wa = product(w,x);
	let z =  sum(sum(wa), b);
	return z;
}

/* cost_grad : returns gradC wrt activ */

function cost_grad(a,y){
	console.log("Calculating gradient wrt : " + a + " & " + y );
	console.log(Array.isArray(a) + " " + Array.isArray(y));
	if(Array.isArray(y)){
		for(var i=0; i<y.length; i++){
			y[i] = -y[i];
		}
	}
	else{
		y = -1*y;
	}
	var gradC = sum(a,[y]);
	console.log(gradC);
	return gradC;
}

/* sigma_dash : returns the sigma' for calculating the errors. */

function sigma_dash(z){
	return (sigmoid_function(z)*(1-(sigmoid_function(z))));
}

function shuffle(input,mini_batch_size,labels){
	var batch = [], y = [];
	var i;
	while(batch.length<=mini_batch_size){
		i = Math.floor(Math.random()*input.length);
		batch.push(input[i]);
		y.push(labels[i]);
	}	
	return [batch,y];
}

var v = new Network([3,2,1]);
var train_features = [[1,2,3],[0,0,1]];
var train_labels = [1,0];

v.fit(train_features,train_labels);
var pred = v.predict([1,1,1]);
console.log(pred);
