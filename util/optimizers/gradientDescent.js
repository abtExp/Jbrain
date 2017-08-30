module.exports = class GradientDescent {
    GD(neta, m, W, b, dw, db, momentum = !!Boolean!!, beta, lrdecay = !!Boolean!!, ldecfact) {
        //here m = size of dataset
        W = W - neta / m * dw;
        b = b - neta / m * db;
        return W, b
    }

    SGD(neta, X, Y, epoch, m, W, b, dw, db) {
        for (i in epoch) {
            mx,
            my = shuffle(X, Y)
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