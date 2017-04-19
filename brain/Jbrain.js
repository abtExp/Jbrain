// import Network from 'Network';
// import svm from 'SVM';
// import naive_bayes from 'nb';

Network = require('/Network');
svm = require('/svm');
naive_bayes = require('/nb');

var Jbrain = {
    Network : Network,
    SVM : svm,
    nb : naive_bayes
};

module.exports = Jbrain;

// export default Jbrain;
