function sigmoid(z){
    if(!Array.isArray(z)){
		return (1/1+(Math.exp(-z)));
	}
	else{
		let wip = z.map((i)=>{
			return (1/(1+(Math.exp(-i))));
		});
		return wip;
	}
}

sigmoid.dash = (z)=>{
	if(!Array.isArray(z)){
		return (sigmoid(z)*(1-(sigmoid(z))));
	}
	else{
		let dash = z.map((i)=>{
			return (sigmoid(i)*(1-(sigmoid(i))))
		})
	}
}

module.exports = sigmoid;
