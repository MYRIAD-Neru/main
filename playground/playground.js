console.log('Welcome to the Game.')

const constraint = document.getElementById('game').getBoundingClientRect();

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.style.userSelect = "none"; 
canvas.style.backgroundColor = 'black'
document.body.style.userSelect = "auto";

canvas.width = document.getElementById('game').offsetWidth
canvas.height = canvas.width * 0.6

c.strokeStyle = 'red';
c.lineWidth = 2

const border = {
    top: 0,
    bottom: canvas.height * 0.97,
    left: 0,
    right: canvas.width
}

const gravity = canvas.height * 0.001

function drawEnvironment(){
    c.fillStyle = 'grey'
    c.fillRect(0, border.bottom, border.right, 300)
}
console.log(canvas.height, canvas.width)

class Player {
    constructor(){
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = canvas.width * 0.03
        this.height = this.width

        this.isFalling = true

        this.projectile = {
            isShooting: false,
            aimX: 0,
            aimY: 0
        }
        this.corePosition = {
            x: 0,
            y: 0
        }
    }
    draw(){
        c.fillStyle = 'white'
        c.fillRect(
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height)
    }
    update(){
        this.position.y += this.velocity.y
        // this.position.y = Math.max(1, this.position.y)

        this.position.x += this.velocity.x
        if (this.position.x > canvas.width * 0.5){
            this.position.x = Math.min(this.position.x, border.right - this.width)
        }else{
            this.position.x = Math.max(0, this.position.x)
        }

        this.corePosition.x = this.position.x + 0.5 * this.width
        this.corePosition.y = this.position.y + 0.5 * this.height

        this.draw()
        this.playerGravity()
        this.playerShooting()
    }
    playerGravity(){
        if (this.position.y + this.height + this.velocity.y <= border.bottom){
            this.isFalling = true
            this.velocity.y += gravity
        }else{
            this.velocity.y = 0
            this.isFalling = false
        }
    }
    playerShooting(){
        const aimDistanceX = this.projectile.aimX - this.corePosition.x
        const aimDistanceY = this.projectile.aimY - this.corePosition.y

        if(this.projectile.isShooting){
            c.fillStyle = 'red'
            c.fillRect (
                this.projectile.aimX - 10,
                this.projectile.aimY - 10,
                20,
                20
            )
            c.beginPath();
            c.moveTo(this.corePosition.x, this.corePosition.y); 
            c.lineTo(aimDistanceX*100 + this.corePosition.x, aimDistanceY*100 + this.corePosition.y); 
            c.stroke(); 
        }
        player.projectile.isShooting = false
    }
}

class Platform  {
    constructor(){
        this.position = {
            x: canvas.width*0.2,
            y: canvas.height*0.5
        }
        this.width = this.position.x * 3
        this.height = this.position.y * 0.01
    }
    draw(){
        c.fillStyle = 'grey'
        c.fillRect(
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height)
    }
}

const platform = new Platform()

const player = new Player()

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    },
    up: {
        pressed: false
    },   
    down: {
        pressed: false
    }
}

/*
keyCodes
W: 87
A: 65
D: 68
S: 83
*/

addEventListener('keydown', ( {keyCode} ) => {
    switch (keyCode) {
        // UP
        case 87:
            keys.up.pressed = true
            break;
        // LEFT 
        case 65:
            keys.left.pressed = true
            break;
        // RIGHT 
        case 68:
            keys.right.pressed = true
            break;
        // DOWN
        case 83:
            keys.down.pressed = true
            break;
        }
})

addEventListener('keyup', ({keyCode}) => {
    switch (keyCode) {
        // UP
        case 87:
            keys.up.pressed = false
            break;
        // LEFT 
        case 65:
            keys.left.pressed = false
            break;
        // RIGHT 
        case 68:
            keys.right.pressed = false
            break;
        // DOWN
        case 83:
            keys.down.pressed = false
            break;
        }
})

canvas.addEventListener('click', ({offsetX, offsetY}) => {
    player.projectile.isShooting = true
    player.projectile.aimX = offsetX
    player.projectile.aimY = offsetY
    }
)

function clock(){
    requestAnimationFrame(clock)

    c.clearRect(0, 0, canvas.width, canvas.height)
    drawEnvironment()
    platform.draw()    

    player.update()

    // COLLISION
    if (player.position.y + player.height <= platform.position.y && player.position.y + player.height + player.velocity.y >= platform.position.y && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width){
        player.velocity.y = 0
        player.isFalling = false
    }

    // MOVEMENT
    if (keys.right.pressed && keys.left.pressed) {
        player.velocity.x = 0
    }  else if (keys.right.pressed && player.position.x + player.width < border.right) {
        player.velocity.x = canvas.width * 0.02
    } else if (keys.left.pressed && player.position.x > border.left) {
        player.velocity.x = -canvas.width * 0.02
    } else player.velocity.x = 0;
    if (keys.up.pressed && player.position.y > border.top && player.isFalling == false) {
        player.velocity.y = -canvas.height * 0.035
    }
    if (keys.down.pressed && player.position.y + player.height < border.bottom && player.isFalling == false){
        player.velocity.y += 1
    }
}
clock()


