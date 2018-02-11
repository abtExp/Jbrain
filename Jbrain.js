const Network = require('./brain/Network'),
    // Layer = require('./util/activ'),
    Model = require('./brain/Model'),
    util = require('./util/util');

(() => {
    if (typeof window !== 'undefined') {
        window.Network = Network;
        window.Model = Model;
    }
})()

module.exports = {
    Network,
    util,
    Model
}



// export default Jbrain;