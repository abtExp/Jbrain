const canvas = document.querySelector('#canv'),
    ctx = canvas.getContext('2d'),
    scoreBoard = document.querySelector('#score'),
    playBtn = document.getElementById('play'),
    network = new Network([500 * 500 * 3, 50, 20, 2]);

window.onload = prompt;

let gameOn,
    obstacles = [],
    lines = [];

class Line {
    constructor(x, y, xv, yv, len) {
            this.id = new Date().getTime();
            this.x = x;
            this.y = y;
            this.xv = xv;
            this.yv = yv;
            this.len = len;
        }
        //other behaviour
}

class Traffic {
    constructor(x, y, xv) {
        this.x = x;
        this.y = y;
        this.xv = xv;
    }
}

function play() {
    car = {
        x: 20,
        y: 70,
        xv: 0,
        yv: 0
    }

    gameOn = setInterval(() => {
        generateLine();
        let i = Math.random();
        if (i > 0.9) generateCar();
        draw();
        let col = detectCollision();
        console.log(col);
    }, 100);
}

function generateLine() {
    let x = lines.length > 0 ? lines[lines.length - 1].x + lines[lines.length - 1].len + 20 : canvas.width,
        y = Math.floor(canvas.height / 2.3),
        xv = -10,
        yv = 0,
        len = 20,
        line = new Line(x, y, xv, yv, len);
    lines.push(line);
}

function generateCar() {
    let x = canvas.width,
        y = Math.floor(Math.random() * canvas.height),
        xv = -1 * Math.floor(Math.random() * 20),
        ca = new Traffic(x, y, xv);
    obstacles.push(ca);
}

function draw() {
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i of lines) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(car.x, car.y, 20, 20);
        ctx.fillStyle = '#a32';
        ctx.fillRect(i.x, i.y, i.len, 10);
        i.x += i.xv;
        i.y += i.yv;
        // i.len -= Math.abs(i.xv);
        if ((i.x + i.len) < 0) {
            lines = lines.filter(j => j.id !== i.id);
        }
    }
    ctx.fillStyle = '#fff';
    for (let j of obstacles) {
        ctx.fillRect(j.x, j.y, 20, 20);
        j.x += j.xv;
        // j.len -= Math.abs(j.xv);
        if ((j.x + j.len) < 0) {
            obstacles = obstacles.filter(j => j.id !== i.id);
        }
    }
}

function prompt() {
    playBtn.addEventListener('click', () => {
        playBtn.style.display = 'none';
        play();
    })
}

document.body.addEventListener('keydown', (e) => {
    if (e.keyCode === 37) {
        car.xv = -10;
        car.yv = 0;
        car.x += car.xv;
        car.y += car.yv;

        if (car.x < 0) {
            car.xv = 0;
            car.x = 0;
        } else if (car.y < 0) {
            car.yv = 0;
            car.y = 0;
        }
    }
    if (e.keyCode === 38) {
        car.xv = 0;
        car.yv = -10;
        car.x += car.xv;
        car.y += car.yv;

        if (car.x < 0) {
            car.xv = 0;
            car.x = 0;
        } else if (car.y < 0) {
            car.yv = 0;
            car.y = 0;
        }
    }
    if (e.keyCode === 39) {
        car.xv = 10;
        car.yv = 0;
        car.x += car.xv;
        car.y += car.yv;

        if (car.x + 20 > canvas.width) {
            car.x = canvas.width - 20;
            car.xv = 0;
        } else if (car.y + 20 > canvas.height) {
            car.y = canvas.height - 20;
            car.yv = 0;
        }
    }
    if (e.keyCode === 40) {
        car.xv = 0;
        car.yv = 10;
        car.x += car.xv;
        car.y += car.yv;

        if (car.x + 20 > canvas.width) {
            car.x = canvas.width - 20;
            car.xv = 0;
        } else if (car.y + 20 > canvas.height) {
            car.y = canvas.height - 20;
            car.yv = 0;
        }
    }
})

function detectCollision() {
    for (let i of obstacles) {
        if (car.x === i.x || car.y === i.y) return true;
    }
    return false;
}

document.body.addEventListener('keyup', (e) => {
    car.xv = 0;
    car.yv = 0;
})