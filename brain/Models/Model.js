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

    load(model_path) {
        readFile(path.resolve(model_path))
            .then(model => {
                model = JSON.parse(model);
                // construct a new model by looking at the type of the loaded model
                // model = new Models[model](config);

                // assign the params to the model
                // model.assign_weights(model.weights)

                // compile the model
                // model.compile(model)

                return model;
            })
    }
}

module.exports = Model;