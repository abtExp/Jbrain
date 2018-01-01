const Network = require('./brain/Network'),
    // Layer = require('./util/activ'),
    util = require('./util/util');

(() => {
    if (typeof window !== 'undefined') {
        window.Network = Network;
    }
})()

module.exports = {
    Network,
    util
}



// export default Jbrain;