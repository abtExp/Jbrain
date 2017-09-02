module.exports = class GradientDescent {
    GD(network, neta, itrns, opt) {
        let w = network.weights,
            b = network.biases,
            dw = network.dw,
            db = network.db,
            momentum = opt.momentum || false,
            beta = opt.beta || 0.9;

        if (momentum) {
            let vdw = [],
                vdb = [];
            for (let i = 0; i < w.length; i++) {
                vdw.push(ndarray.zeroes(w[i].shape));
                vdb.push(ndarray.zeroes(b[i].shape));
            }
            for (let t = 0; t < itrns; t++) {
                for (let l = 0; l < w.length; l++) {
                    vdw[l].array = math.sum(math.product(vdw[l].array, beta), math.product(dw[l].array, (1 - beta)));
                    vdb[l].array = math.sum(math.product(vdb[l].array, beta), math.product(db[l].array, (1 - beta)));
                    w[l].array = math.sum(w[l].array, math.product(vdw[l].array, (-neta)));
                    b[l].array = math.sum(b[l].array, math.product(vdb[l].array, (-neta)));
                }
            }
        } else {
            for (let t = 0; t < itrns; t++) {
                for (let l = 0; l < w.length; l++) {
                    w[l].array = math.sum(w[l].array, math.product(dw[l].array, (-neta)));
                    b[l].array = math.sum(b[l].array, math.product(db[l].array, (-neta)));
                }
            }
        }
    }


    SGD(network, neta, epoch, m, opt) {
        let w = network.weights,
            b = network.biases,
            dw = network.dw,
            db = network.db,
            X = network.features,
            Y = network.labels,
            activations = network.activations;
    }

    MBGD(neta, X, Y, epoch, m, W, b, dw, db, momentum = !!Boolean!!, lrdecay = !!Boolean!!, ldecfact, beta) {
        for (i in epoch) {
            shuffle(X, Y)
            mbatches = [X[i * m - i + 1 * m]]
            for (mx, my in mbatches) {
                W = W - neta / m * dw //(for current batch)
            }
        }

    }
}