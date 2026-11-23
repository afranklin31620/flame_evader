//get the game canvas
let game_canvas = document.getElementById("myCanvas");
let game_body = document.getElementsByClassName("game_body").item(0)
let play_btn = document.getElementById("play")
//accessing the toolset to draw 2d shapes
let ctx = game_canvas.getContext("2d");
//initialize base variables
const WIDTH = 600;
const HEIGHT = 600;
//lets make it rain
const number_of_droplets = 60

class Player {
    constructor() {
        // Player position
        this.x = 30
        this.y = HEIGHT / 2
        this.velocity = 8

        // Spritesheet properties
        this.chunksize = 32
        this.right_frame = 0
        this.up_frame = 0;
        this.down_frame = 0;
        this.left_frame = 0;

        // Image loading
        this.right_spritesheet = new Image()
        this.up_spritesheet = new Image()
        this.down_spritesheet = new Image()
        this.left_spritesheet = new Image()
        this.loaded = 0

        this.right_spritesheet.onload = () => {
            this.loaded++
        }

        this.up_spritesheet.onload = () => {
            this.loaded++
        }

        this.left_spritesheet.onload = () => {
            this.loaded++
        }

        this.down_spritesheet.onload = () => {
            this.loaded++
        }



        this.right_spritesheet.src = "./assets/right.png"
        this.left_spritesheet.src = "./assets/left.png"
        this.up_spritesheet.src = "./assets/up.png"
        this.down_spritesheet.src = "./assets/down.png"
        this.right_dir = 1;
        this.up_dir = 1;
        this.left_dir = 1;
        this.down_dir = 1;
    }

    right() {
        // Don't draw until the image has loaded
        if (this.loaded < 4) return
        this.right_frame = this.right_frame + this.right_dir
        if (this.right_frame == 11 || this.right_frame == 0) {
            this.right_dir *= -1
        }
        ctx.drawImage(
            this.right_spritesheet,

            // Source: which part of the spritesheet?
            this.right_frame * this.chunksize,
            0,
            this.chunksize,
            this.chunksize,

            // Destination: where and how big on canvas?
            this.x,
            this.y,
            50,
            50
        )
    }

    left() {
        // Don't draw until the image has loaded
        if (this.loaded < 4) return
        this.left_frame = this.left_frame + this.left_dir
        if (this.left_frame == 11 || this.left_frame == 0) {
            this.left_dir *= -1
        }
        ctx.drawImage(
            this.left_spritesheet,

            // Source: which part of the spritesheet?
            this.left_frame * this.chunksize,
            0,
            this.chunksize,
            this.chunksize,

            // Destination: where and how big on canvas?
            this.x,
            this.y,
            50,
            50
        )
    }

    up() {
        if (this.loaded < 4) {
            return
        }
        if (this.up_frame < 0 || this.up_frame > 6) {
            this.up_dir *= -1
        }

        ctx.drawImage(
            this.up_spritesheet,

            this.up_frame * this.chunksize,
            0,
            this.chunksize,
            this.chunksize,

            this.x,
            this.y,
            50,
            50
        )
        this.up_frame += this.up_dir
    }

    down() {
        if (this.loaded < 4) {
            return
        }
        if (this.down_frame < 0 || this.down_frame > 6) {
            this.down_dir *= -1
        }

        ctx.drawImage(
            this.down_spritesheet,

            this.down_frame * this.chunksize,
            0,
            this.chunksize,
            this.chunksize,

            this.x,
            this.y,
            50,
            50
        )
        this.down_frame += this.down_dir
    }
}


function rainDroplet() {
    return {
        x: Math.random() * WIDTH,
        y: Math.random() * HEIGHT,
        velocity: 20,
        color: "blue",
        drop() {
            this.x -= this.velocity;
            if (this.x < 0) {
                this.x = WIDTH
            }
        },
        draw() {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, 10, 1);
            this.drop()
        }
    }
}

function fireBall() {
    return {
        frame: 0,
        chuncksize: 32,
        spritesheet: new Image(),
        audio: new Audio("./audio/fire.mp3#t=15.6,16.2"),
        loaded: false,
        gravity: false,
        x: WIDTH,
        y: Math.random() * 500,
        initial_y: this.y,
        load() {
            this.spritesheet.onload = () => {
                this.loaded = true
            }
            this.spritesheet.src = "./assets/fire.png"
            this.audio.volume = 0.2
            this.audio.play()
        },
        update() {
            this.frame++
            if (this.frame == 4) {
                this.frame = 0
                this.gravity = !this.gravity
            }
            if (this.gravity) {
                this.y += 4
            }
            else {
                this.y -= 4
            }
            this.x -= 5


        },
        draw() {
            if (!this.loaded) {
                return
            }
            ctx.drawImage(
                this.spritesheet,

                //what part of the spreadsheet
                0,
                this.frame * this.chuncksize,
                this.chuncksize,
                this.chuncksize,

                //where to put in on the canvas
                this.x,
                this.y,
                100,
                100,
            )
            this.update()
        },
        clear() {
            thix.x = WIDTH + this.chunksize
        }
    }
}

//getting the initial drops in
let rain = new Array(number_of_droplets)
for (let c = 0; c < number_of_droplets; c++) {
    rain[c] = rainDroplet()
}

let player1 = new Player()
let fireBall_stack = [];
fireBall_stack.push(fireBall())
fireBall_stack.push(fireBall())
fireBall_stack.push(fireBall())
let keys = {};
//define controls

window.addEventListener('keydown', function (event) {
    keys[event.key] = true;
})

window.addEventListener('keyup', function (event) {
    keys[event.key] = false;
})

function move() {
    //diagonal dirs

    //down
    if (keys['s'] && player1.y + player1.chunksize + player1.velocity < HEIGHT) {
        player1.y += player1.velocity
        player1.down()
    }

    //up
    else if (keys['w'] && player1.y - player1.velocity >= 0) {
        player1.y -= player1.velocity
        player1.up()

    }

    else if (keys['d'] && player1.x + player1.chunksize + player1.velocity < WIDTH) {
        player1.x += player1.velocity
        player1.right()
    }
    else if (keys['a'] && player1.x - player1.velocity >= 0) {
        player1.x -= player1.velocity
        player1.left()
    }
    else {
        player1.right()
    }

}

function collision_detection(player1, fireball) {
    const playerWidth = player1.chunksize;   // 64
    const playerHeight = player1.chunksize;  // 96
    const fireSize = fireball.chuncksize * 2;    // 64
    /**
     * first part of the conditional (horizontal detection) 
     * players left < fire right AND players right == fires left
     * OR
     * players left == fires right AND players right > fires left
     * 
     * second part
     * players top < fires bottom AND players bottom == fires top
     * OR
     * players top == fires bottom AND players bottom > fire top
     * 
     *NOTE we use <= and >= to account for velocity differences
     */
    if (
        //TODO re-create the collision detection algorithm
        player1.x <= fireball.x + fireSize &&
        player1.x + playerWidth >= fireball.x &&
        player1.y <= fireball.y + fireSize &&
        player1.y + playerHeight >= fireball.y
    ) {
        console.log("hit")
        return true;
    }
    return false;
}

//define audio
const background_music = new Audio('./audio/bg.mp3')
background_music.loop = true;
let score = 0
let player_score_lbl = "Player 1: " + score
let tick = 0
let gameover = false
let highscore_text = document.getElementById("high_score")
let can_continue = false;
function reset_game() {
    filler_text = highscore_text.innerText.split(" : ")[0]; prev_score = highscore_text.innerText.split(" : ")[1];
    if (parseInt(prev_score) < score) {
        highscore_text.innerText = highscore_text.innerText.split(" : ")[0] + " : " + score
    }
    score = 0;
    tick = 0;
    gameover = false;
    can_continue = false;
    window.removeEventListener("click", reset_game)
    player1 = new Player()
    fireBall_stack = []
    fireBall_stack.push(fireBall())
    fireBall_stack.push(fireBall())
    fireBall_stack.push(fireBall())
    ctx.clearRect(0, 0, WIDTH, HEIGHT)
}
play_btn.addEventListener('click', function gameloop() {

    if (score == 0 && tick == 0) {
        background_music.play()
    }
    if (!gameover) {
        //clear the whole screen THEN draw
        ctx.clearRect(0, 0, WIDTH, HEIGHT)
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, WIDTH, HEIGHT)
        ctx.fillStyle = 'blue'
        ctx.font = "30px arial"
        ctx.textAlign = "center"

        ctx.fillText(player_score_lbl, WIDTH / 2, 30, 3000)
        for (let c = 0; c < number_of_droplets; c++) {
            rain[c].draw()
        }
        move()

        //offscreen
        for (let c = 0; c < 3; c++) {
            if (c == 0 && !fireBall_stack[0].loaded) {
                fireBall_stack[c].load()
            }
            else if (c > 0 && fireBall_stack[c - 1].x <= (WIDTH / 2) - 100 && !fireBall_stack[c].loaded) {
                fireBall_stack[c].load()
            }
            fireBall_stack[c].draw()
            if (fireBall_stack[c].x + fireBall_stack[c].x + fireBall_stack[c].chuncksize <= 0) {
                fireBall_stack[c] = fireBall()
            }
            if (collision_detection(player1, fireBall_stack[c])) {
                gameover = true;
            }
        }
        tick++
        if (tick === 10) {
            score++
            tick = 0
        }
        player_score_lbl = "Player 1: " + score
    }
    else {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = 'green';
        ctx.font = "30px Arial"; // Fixed from ctx.fontStyle
        ctx.textAlign = "center";
        ctx.fillText("Game Over", WIDTH / 2, HEIGHT / 2, 100);
        ctx.fillText("Continue?", WIDTH / 2, (HEIGHT / 2) + 40, 100);
        if (!can_continue) {
            window.addEventListener('click', continue_func)
            can_continue = true;

        }

    }
    requestAnimationFrame(gameloop)
    play_btn.disabled = true;
}
)

let continue_func = function (event) {
    if (can_continue) {
        if (WIDTH / 2 - 60 <= event.offsetX && event.offsetX <= (WIDTH / 2) + 80 &&
            HEIGHT / 2 - 30 <= event.offsetY && event.offsetY <= (HEIGHT / 2) + 40
        ) {
            reset_game()
        }
    }
}
window.addEventListener("click", continue_func)