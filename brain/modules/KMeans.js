/** 
 * 1. Initialize k cluster points by randomly selecting k data points as cluster points
 * 2. Assign A cluster point to each data point by measuring the euclidean distance of the data point from each of the cluster point
 * 3. Keep a count of all the data points assigned to each cluster point and update the cluster point to the mean of all the assigned data points
 */

const { core, math } = require('vecto');

function K_means(input_data, k) {
    /* input data can be an array or a vecto_ndarray_object */
    // select k of the data points randomly and form Ndarray objects for them;

    // caution: choose method is not yet devd
    let cluster_points = core.choose({ array: input_data, options: { choice: 'random', number: k, axis: 0 } }).map(i => Ndarray.array(i));

    input_data.map(i => {
        i._class = null;
    });

    let update = true;

    while (update) {
        update = false;
        for (const i = 0; i < input_data.length; i++) {
            for (const j = 0; j < cluster_points.length; j++) {
                let dist = distance(input_data[i], cluster_points[j].data);
                if (dist < input_data[i].min_dist) {
                    input_data[i].min_dist = dist;
                    input_data[i]._class = j;
                    update = true;
                }
            }
        }
    }

}

function distance(a, b) {
    // euclidean distance or the l2 norm
    return math.sqrt(math.sum(math.pow(math.diff(a, b), 2)));
}

module.exports = {
    K_means
};