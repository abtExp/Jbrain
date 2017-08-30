import { Network } from 'Jbrain';

let net = new Network([{
        type: 'conv',
        stride: 1, // stride length (defaults to 1)
        kernel: [5, 5], // kernel width, height(defaults to 5,5)
        fMaps: 20, // Number of feature maps (defaults to 2)
        ipShape: [50000, 28, 28, 3], // Number of ex, width, height, channels
        padding: 'valid' // Valid or real padding
    },
    {
        type: 'maxpool',
        stride: 2,
        kernel: [2, 2],
        fMaps: 20,
        ipShape: [25, 25, 20]
    },
    {
        type: 'relu',
        shape: [10, 20],
    },
    {
        type: 'softmax',
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