export default function adam(beta1, beta2, epsilon, neta) {
    // Vdw = vec_of_all_zeros of shape op_lyr_shape
    // Vdb = vec_of_all_zeros of shape op_lyr_shape
    // Sdw = vec_of_all_zeros of shape op_lyr_shape
    // Sdb = vec_of_all_zeros of shape op_lyr_shape

    Vdw = beta1 * Vdw + (1 - beta1) * dW(l)
    Vdwcorr = Vdw / (1 - beta1 ^ epochno)
    Vdb = beta1 * Vdb + (1 - beta1) * db(l)
    Vdbcorr = Vdb / (1 - beta1 ^ epochno)
    Sdw = beta2 * Sdw + (1 - beta2) * dW(l) ^ 2
    Sdwcorr = Sdw / (1 - beta2 ^ epochno)
    Sdb = beta2 * Sdb + (1 - beta2) * db(l) ^ 2
    Sdbcorr = Sdb / (1 - beta2 ^ epochno)

    W = W - neta * Vdwcorr / (sqrt(Sdw) + epsilon)
    b = b - neta * Vdbcorr / (sqrt(Sdb) + epsilon)
        //update W and b
}