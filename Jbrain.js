// import Network from 'Network';
// import svm from 'SVM';
// import naive_bayes from 'nb';
// import conv_net from 'convnet';

const Network = require('./brain/Network');
// svm = require('./brain/svm');
// naive_bayes = require('./brain/nb');
// conv_net = require('./brain/convnet');
const util = require('./util/util');

(() => {
    if (typeof window !== 'undefined') {
        window.Network = Network;
    }
})()

module.exports = {
    Network
}



// export default Jbrain;