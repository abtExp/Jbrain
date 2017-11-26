/* Unified Test File For All Unit Tests For Jbrain 
 * Any Unit Test For Further Development Will Be Appended To 
 * This File.
 * 
 * Author : AbT <atworkstudios@gmail.com>
 * Project : Jbrain
 * CodeName : JSImpl
 *  
 */

/* Importing The Library */

const { Network, util } = require('./Jbrain');
const Layer = util.Layer;


/* Tests For Creation Of The Network */

/* Method 1 : Simple FeedForward Network Default Creation */
test('Creating A Network Method 1', () => {
    let net = new Network([25, 10, 5, 2]);
    expect(net).toBeInstanceOf(Network) &&
        expect(net.layers.length).toBe(4) &&
        expect(net.layers[0].type).toBe('input') &&
        expect(net.layers[0].shape).toEqual([25, null]) &&
        expect(net.layers[1].weights.shape).toEqual([10, 25]);
})

/* Method 2 : Simple FeedForward Network Customized Creation */
test('Creating A Network Method 2', () => {
    let net = new Network([25, 10, 5, 2], 'relu', 'softmax');
})

/* Method 3 : Simple FeedForward Network Object Creation */
test('Creating A Network Method 3', () => {
    let net = new Network([{
        type: 'input',
        shape: [25, null]
    }, {
        type: 'connected',
        shape: [10, 25],
        activationFunction: 'relu'
    }, {
        type: 'connected',
        number: 2,
        config: [{
            shape: [10, 10],
            activationFunction: 'tanh'
        }, {
            shape: [5, 10],
            activationFunction: 'tanh'
        }]
    }, {
        type: 'connected',
        shape: [2, 5],
        activationFunction: 'softmax'
    }])
});

/* Method 4 : Composing a Network from Layers */
test('Creating a Network Method 4', () => {
    let inpL = new Layer({ type: 'input', shape: [25, null] });
    let h1 = new Layer({ type: 'connected', input: inpL, shape: [10, 25], activationFunction: 'relu' });
    let h2 = new Layer({ type: 'connected', input: h1, shape: [10, 10], activationFunction: 'relu' });
    let opL = new Layer({ type: 'connected', input: h2, shape: [5, 10], activationFunction: 'softmax' });
    let net = Network.formNet([inpL, h1, h2, opL]);
})