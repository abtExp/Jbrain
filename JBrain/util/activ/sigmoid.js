function sigmoid(z){
    if(!Array.isArray(z)){
		return (1/1+(Math.exp(-z)));
	}
	else{
		var wip = [];
		z.forEach((i)=>{
			wip.push((1/(1+(Math.exp(-i)))));
		});

		return wip;
	}
}

module.exports = sigmoid;