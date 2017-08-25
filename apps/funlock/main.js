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

    window.loadURL(path.join('file:///', __dirname, './main.html'));
    window.on('ready-to-show', _ => {
        window.webContents.openDevTools();
    })
    window.show();
})