import { Network } from 'Jbrain';

let net = new Network([{
        type: 'conv2pool',
        number: 4, // Makes 4 conv - 2 - pool layers with max pooling
        pooling: 'maxpool',
        config: [{}], // config for each layer
        pool_stride: 2,
        pool_kernel: [2, 2],
        stride: 1, // stride length (defaults to 1)
        kernel: [5, 5], // kernel width, height(defaults to 5,5)
        fMaps: 20, // Number of feature maps (defaults to 2)
        ipShape: [50000, 28, 28, 3], // Number of ex, width, height, channels
        padding: 'valid' // Valid or real padding
    },
    {
        type: 'conv',
        kernel: [5, 5],
        stride: 1,
        fmaps: 20,
        ipShape: [batch_size, img_width, img_height, channels],
        activ: 'relu'
    },
    // {
    //     type: 'maxpool',
    //     stride: 2,
    //     kernel: [2, 2],
    //     fMaps: 20,
    //     ipShape: [25, 25, 20]
    // },
    {
        type: 'connected',
        activation: 'relu',
        number: 2, // forms 2 relu layers
        shape: [
            [10, 20], // shape of first layer
            [10, 10] // shape of second layer
        ],
    },
    {
        type: 'connected',
        activation: 'softmax',
        shape: [10, 10]
    }
])

net.fit({
    train_features: img_data,
    train_labels: labels,
    neta: 0.5,
    epoch: 10000,
    m: 1024,
    cost_fn: 'logLike',
    evaluate: true,
    eval_epoch: 100,
    validate: true,
    validate_dat: val_dat,
    optimizer: {
        name: 'adam',
        beta1: 0.9,
        beta2: 0.999,
        epsilon: 1e-4,
    }
})



let net = new Network([{
    type: 'connected',
    number: 2,
    config: [{
        activation: 'tanh',
        shape: [20, 10]
    }, {
        activation: 'relu',
        shape: [5, 20]
    }]
}, {
    type: 'connected',
    activation: 'softmax',
    config: [2, 5]
}])