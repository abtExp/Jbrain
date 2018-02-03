const Layer = require('./Layer');

class Pool extends Layer {
    constructor(config) {
        config = config || {};
        config.type = 'pool';
        super(config);
        this.init();
    }

    init() {
        const opshape = [this.filters, ...this.kernel, this.input.shape[this.input.shape.length - 1]];
        console.log(opshape);
        this.weights = new Ndarray({ shape: opshape, dtype: 'float32' });
        this.biases = new Ndarray({ shape: [this.filters, 1], dtype: 'float32' });
        let opw = Math.floor((this.input.shape[1] + (2 * this.padding) - this.kernel[0]) / this.stride) + 1,
            oph = Math.floor((this.input.shape[2] + (2 * this.padding) - this.kernel[1]) / this.stride) + 1;
        this.activation = new Ndarray({ shape: [this.input.shape[0], opw, oph, this.filters], dtype: 'float32' });
    }

    // @Override Methods
    fire() {

    }
}