export default function rmsprop(beta) {
    Vdwcorr = (beta * Vdw + (1 - beta) * dw) / 1 - beta ^ epochno
    Vdbcorr = (beta * Vdb + (1 - beta) * db) / 1 - beta ^ epochno
    W = W - neta * Vdw
    b = b - neta * Vdb

    //update W and B
}