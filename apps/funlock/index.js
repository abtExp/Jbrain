// const zlib = require('zlib'),
//     fs = require('fs'),
//     tar = require('tar'),
//     util = require('util'),
//     readFile = util.promisify(fs.readFile),
//     unzip = util.promisify(zlib.gunzip);


// tar.x({
//         file: './notMNIST_small.tar.gz'
//     })
//     .then(_ => {
//         console.log('TARRED');
//     })
//     .catch(err => {
//         console.error(err);
//     })
// let train_set;

// tar.t({
//     file: './notMNIST_small.tar.gz',
//     onentry: ent => {
//         train_set = ent;
//     }
// })

// readFile('./notMNIST_small.tar.gz')
//     .then(file => {
//         unzip(file)
//             .then(dat => {
//                 train_set = dat;
//             })
//             .catch(err => {
//                 console.error(err);
//             })

//     })
//     .catch(err => {
//         console.error(err);
//     })


// console.log(typeof train_set);

const { app, BrowserWindow } = require('electron'),
    path = require('path')


app.on('ready', _ => {
    const screen = require('electron').screen;
    let width = screen.getPrimaryDisplay().workArea.width,
        height = screen.getPrimaryDisplay().workArea.height;
    let window = new BrowserWindow({
        // fullscreen: true,
        width: width - 100,
        height: height - 100,
        frame: true
    })

    window.loadURL(path.join('file:///', __dirname, './index.html'));
    window.on('ready-to-show', _ => {
        window.webContents.send('capture');
        window.webContents.openDevTools();
    })
    window.show();
})