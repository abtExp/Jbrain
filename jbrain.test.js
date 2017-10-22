/* Unified Test File For All Unit Tests For Jbrain 
 * Any Unit Test For Further Development Will Be Appended To 
 * This File.
 * 
 * Author : AbT <atworkstudios@gmail.com>
 * Project : Jbrain
 * CodeName : JSimpl
 *  
 */

/* Importing The Library */

const { Network } = require('./Jbrain');


/* Tests For Creation Of The Network */


/* Method 1 : Simple FeedForward Network Default Creation */
test('Creating A Network Method 1', () => {
    let net = new Network([25, 10, 5, 2]);
    expect(net.layers.length).toBe(4) &&
        expect(net.layers[0].type).toBe('input') &&
        expect(net.layers[0].shape).toEqual([25, null]) &&
        expect(net.layers[1].weights.shape).toEqual([10, 25]);
})

/* Method 2 : Simple FeedForward Network Customized Creation */