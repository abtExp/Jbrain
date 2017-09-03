module.exports = function adam(network, neta, itrns, opt) {
    const { ndarray, math } = require('../../node_modules/vecto');
    opt = opt || {};
    let w = network.weights,
        b = network.biases,
        dw = network.dw,
        db = network.db,
        beta1 = opt.beta1 || 0.9,
        beta2 = opt.beta2 || 0.999,
        epsilon = opt.epsilon || 1e-6,
        vdw = [],
        vdb = [],
        vdwcorr = [],
        vdbcorr = [],
        sdw = [],
        sdb = [],
        sdwcorr = [],
        sdbcorr = [];
    for (let i = 0; i < w.length; i++) {
        vdw.push(ndarray.zeroes(w[i].shape));
        vdb.push(ndarray.zeroes(b[i].shape));
        vdwcorr.push(ndarray.zeroes(w[i].shape));
        vdbcorr.push(ndarray.zeroes(b[i].shape));
        sdw.push(ndarray.zeroes(w[i].shape));
        sdb.push(ndarray.zeroes(b[i].shape));
        sdwcorr.push(ndarray.zeroes(w[i].shape));
        sdbcorr.push(ndarray.zeroes(b[i].shape));
    }
    for (let i = 0; i < itrns; i++) {
        for (let l = 0; l < w.length; l++) {
            vdw[l].arrange(math.sum(math.product(vdw[l].array, beta1), math.product(dw[l].array, (1 - beta1))));
            vdb[l].arrange(math.sum(math.product(vdb[l].array, beta1), math.product(db[l].array, (1 - beta1))));
            sdw[l].arrange(math.sum(math.product(vdw[l].array, beta2), math.product(math.pow(dw[l].array, 2), (1 - beta2))));
            sdb[l].arrange(math.sum(math.product(vdb[l].array, beta2), math.product(math.pow(db[l].array, 2), (1 - beta2))));
            vdwcorr[l].arrange(math.divide(vdw[l].array, (1 - (beta1 ^ (i + 1)))));
            vdbcorr[l].arrange(math.divide(vdb[l].array, (1 - (beta1 ^ (i + 1)))));
            sdwcorr[l].arrange(math.divide(sdw[l].array, (1 - (beta2 ^ (i + 1)))));
            sdbcorr[l].arrange(math.divide(sdb[l].array, (1 - (beta2 ^ (i + 1)))));
            w[l].arrange(math.sum(w[l].array, math.product(math.divide(vdwcorr[l].array, math.sum(math.sqrt(sdwcorr[l].array), epsilon)), (-neta))));
            b[l].arrange(math.sum(b[l].array, math.product(math.divide(vdbcorr[l].array, math.sum(math.sqrt(sdbcorr[l].array), epsilon)), (-neta))));
        }
    }
}