// getting the canvas
const canv = document.querySelector('canvas'),
    score = document.getElementById('score'),
    ctx = canv.getContext('2d');

window.onload = play;

class node {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}
class Snake {
    constructor() {
        this.len = [new node()];
        this.x_speed = 15;
        this.y_speed = 0;
        this.prev_x = 0;
        this.prev_y = 0;
        this.score = 0;
    }
    eat() {
        this.len.push(new node());
        if (food.type === 'super') this.score += 10;
        else this.score += 5;
        if (this.score % 25 === 0) {
            generateSuperFood();
        }
        score.innerHTML = this.score;
    }

    update() {

        //this is where the ai stuff will go 

        ctx.fillStyle = '#333';
        ctx.fillRect(0, 0, canv.width, canv.height);
        if (this.len[0].x === food.x && this.len[0].y === food.y) {
            this.eat();
            food = null;
            generate_food();
        } else if ((this.len[0].x > canv.width) || (this.len[0].x < 0) || (this.len[0].y > canv.height) || (this.len[0].y < 0)) {
            game_over = true;
            ctx.fillStyle = '#f00';
            ctx.fillRect(0, 0, canv.width, canv.height);
            clearInterval(timer);
        }
        this.len[0].x += this.x_speed;
        this.len[0].y += this.y_speed;
        draw(food.x, food.y, food.clr);
        draw(this.len[0].x, this.len[0].y);
        for (let i = 1; i < this.len.length; i++) {
            if (this.len[0].x === this.len[i].x && this.len[0].y === this.len[i].y) {
                game_over = true;
                ctx.fillStyle = '#f00';
                ctx.fillRect(0, 0, canv.width, canv.height);
                clearInterval(timer);
            }
            this.len[i].x = (this.len[i - 1].prev_x);
            this.len[i].y = (this.len[i - 1].prev_y);
            this.len[i - 1].prev_x = this.len[i - 1].x;
            this.len[i - 1].prev_y = this.len[i - 1].y;
            draw(this.len[i].x, this.len[i].y);
        }
    }
}

let game_over = false,
    food,
    timer,
    snake = new Snake();


function generate_food(clr = '#f00', type = 'normal') {
    console.log(clr);
    let x = Math.floor((Math.random() * (canv.width / 15))) * 15,
        y = Math.floor((Math.random() * (canv.height / 15))) * 15;
    food = new node(x, y);
    food.clr = clr;
    food.type = type;
}

function generateSuperFood() {
    generate_food('#32a', 'super');
    let i = 0;
    let tmr = setTimeout(() => {
        food = null;
        generate_food();
    }, 4000);
}

function play() {
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, canv.width, canv.height);
    generate_food();
    timer = setInterval(() => {
        snake.update();
    }, 300);
    document.body.addEventListener('keydown', e => {
        if (e.keyCode === 37 && snake.x_speed === 0) {
            snake.x_speed = -15;
            snake.y_speed = 0;
        } else if (e.keyCode === 38 && snake.y_speed === 0) {
            snake.x_speed = 0;
            snake.y_speed = -15;
        } else if (e.keyCode === 39 && snake.x_speed === 0) {
            snake.x_speed = 15;
            snake.y_speed = 0;
        } else if (e.keyCode === 40 && snake.y_speed === 0) {
            snake.x_speed = 0;
            snake.y_speed = 15;
        } else if (e.keyCode === 32 && game_over === true) {
            snake.len = [new node(0, 0)];
            snake.x_speed = 15;
            snake.y_speed = 0;
            play();
        }
    })
}

function draw(x, y, fill_style = '#fff') {
    ctx.fillStyle = fill_style;
    ctx.fillRect(x, y, 15, 15);
}

function updateScore() {
    score.innerHTML = snake.score;
}