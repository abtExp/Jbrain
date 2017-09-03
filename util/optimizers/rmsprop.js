module.exports = function rmsprop(network, neta, itrns, opt) {
    opt = opt || {};
    let w = network.weights,
        b = network.biases,
        dw = network.dw,
        db = network.db,
        beta = opt.beta,
        vdw = [],
        vdb = [],
        vdwcorr = [],
        vdbcorr = [];

    for (let l = 0; l < w.length; l++) {
        vdw.push(ndarray.zeroes(w[l].shape));
        vdb.push(ndarray.zeroes(b[l].shape));
        vdwcorr.push(ndarray.zeroes(w[l].shape));
        vdbcorr.push(ndarray.zeroes(b[l].shape));
    }

    for (let i = 0; i < itrns; i++) {
        for (let l = 0; l < w.length; l++) {
            vdw[l].arrange(math.sum(math.product(vdw[l].array, beta), math.product(dw[l].array, (1 - beta))));
            vdb[l].arrange(math.sum(math.product(vdb[l].array, beta), math.product(db[l].array, (1 - beta))));
            vdwcorr[l].arrange(math.divide(vdw[l].array, (1 - (beta ^ (i + 1)))));
            vdbcorr[l].arrange(math.divide(vdb[l].array, (1 - (beta ^ (i + 1)))));
            w[l].arrange(math.sum(w[l].array, math.product(vdwcorr[l].array, (-neta))));
            b[l].arrange(math.sum(b[l].array, math.product(vdbcorr[l].array, (-neta))));
        }
    }

}