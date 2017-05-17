const path = require('path');
module.exports = {
    entry : 'D:/Jbrain/test.js',
    output :{
        path : path.resolve(__dirname,'build'),
        filename : 'build.js'
    }
};