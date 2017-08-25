const video = document.getElementById('vd'),
    canv = document.getElementById('canv'),
    canv2 = document.getElementById('canv2'),
    ctx = canv.getContext('2d'),
    ctx2 = canv2.getContext('2d');

window.onload = cam;

function cam() {
    navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                width: 500,
                height: 500
            }
        })
        .then(stream => {
            video.src = URL.createObjectURL(stream);
            video.onloadedmetadata = video.play();
            setInterval(_ => {
                ctx.drawImage(video, 0, 0, 500, 500);
                let imgi = ctx.getImageData(0, 0, 500, 500);
                draw(imgi);
            }, 100);
            // setInterval(draw, 1000);
        })
}

function draw(imgi) {
    let data = imgi.data;
    // data = core.clip(data, 125, 210);
    for (let i = 0; i < data.length - 3; i += 4) {
        let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = parseInt(Math.round((data[i] - avg) / avg));
        data[i + 1] = parseInt(Math.round((data[i + 1] - avg) / avg));
        data[i + 2] = parseInt(Math.round((data[i + 2] - avg) / avg));
    }
    data = core.form_arr(data, 'uint8clamped');
    let img = new ImageData(data, 500, 500);
    createImageBitmap(img, 0, 0, 500, 500)
        .then(im => {
            ctx2.drawImage(im, 0, 0);
        });
}