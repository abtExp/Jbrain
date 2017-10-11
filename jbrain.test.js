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
    // expect().toBe();
})

/* Method 2 : Simple FeedForward Network Customized Creation */