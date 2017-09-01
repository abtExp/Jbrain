module.exports = class GradientDescent {
    GD(w, b, dw, db, neta, itrns, batch_size, momentum = true, beta = 0.9) {
        if (momentum) {
            let vdw = [], // a ndarray of ndarrays of shapes same as w
                vdb = []; // a ndarray of ndarrays of shapes same as b
            for (let t = 0; t < itrns; i++) {
                for (let l = lyrs; l > 0; l--) {
                    vdw[l] = sum(product(vdw[l], beta), product((1 - beta), dw));
                    vdb[l] = sum(product(vdw[l], beta), product((1 - beta), db));
                    w[l] = sum(w[l], product((-neta), vdw[l]));
                    b[l] = sum(b[l], product((-neta), vdb[l]));
                }
            }
        } else {
            for (let t = 0; t < itrns; i++) {
                for (let l = lyrs; l > 0; l--) {
                    w[l] = sum(w[l], product((-neta), dw[l]));
                    b[l] = sum(b[l], product((-neta), db[l]));
                }
            }
        }
        return w, b;
    }

    SGD(neta, X, Y, epoch, m, W, b, dw, db, momentum = true, beta = 0.9) {
        let mx, my;
        for (i in epoch) {
            [mx, my] = shuffle(X, Y)
            for (x, y in mx, my) {
                W = W - neta / m * dw;
                b = b - neta / m * db;
            }
        }
        return W, b
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