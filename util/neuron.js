/* A single neuron unit definition for more robust networks like convolutional and recurrent

    Neuron.object = {
        type : 'String'  // ff, rec, conv, perceptron
        activ : 'String' // activation functions
        weights: ndarrayObject of shape ip_wts
        bias : number
        lyr_no : the layer number in which it is
    }


*/

module.exports = class Neuron {
    constructor({ ip_wts, lyr_no, type = 'ff', activ = 'tanh', output }) {
        this.type = type || 'ff';
        this.activ = activ.activ || 'tanh';
        this.weights = new ndarray([ip_wts, 1]);
        this.lyr_no = lyr_no;
        this.bias = 0;
    }

    fire(x) {
        this.activ(this.weights, x, this.bias);
    }


}