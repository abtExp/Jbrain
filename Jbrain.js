// import Network from 'Network';
// import svm from 'SVM';
// import naive_bayes from 'nb';
// import conv_net from 'convnet';

Network = require('./brain/Network');
// svm = require('./brain/svm');
// naive_bayes = require('./brain/nb');
// conv_net = require('./brain/convnet');

var Jbrain = {
    Network : Network,
    // SVM : svm,
    // nb : naive_bayes,
    // conv_net : conv_net
};

module.exports = Jbrain;

// export default Jbrain;
