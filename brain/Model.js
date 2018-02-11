const fs = require('fs'),
    util = require('util'),
    path = require('path'),
    writeFile = util.promisify(fs.writeFile),
    readFile = util.promisify(fs.readFile);

class Model {
    constructor(type, config) {
        this.type = type;
    }

    save() {
        writeFile(path.join(__dirname, 'model.json'), JSON.stringify(this.config, null, 4))
            .then(_ => {
                console.log('Model Saved');
            })
            .catch(err => {
                console.error(err);
            })
    }

    load(path) {

    }
}

module.exports = Model;