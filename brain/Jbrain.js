// import Network from 'Network';
// import svm from 'SVM';
// import naive_bayes from 'nb';

(()=>{
    if(module){
        var Network = require('Network');
        var svm = require('svm');
        var naive_bayes = require('nb');
    }
})()

var Jbrain = {
    Network : Network,
    SVM : svm,
    nb : naive_bayes
};

if(module){
    module.exports = Jbrain;
}

// export default Jbrain;
