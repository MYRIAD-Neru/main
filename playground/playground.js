console.log('Welcome to the Game.')

const constraint = document.getElementById('game').getBoundingClientRect();

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.style.userSelect = "none"; 
canvas.style.backgroundColor = 'none'
document.body.style.userSelect = "auto";
window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

canvas.width = document.getElementById('game').offsetWidth
canvas.height = canvas.width * 0.6



const border = {
    top: 0,
    bottom: canvas.height * 0.97,
    left: 0,
    right: canvas.width
}

const gravity = canvas.height * 0.0011

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
        this.height = this.width * 4
        this.projectile = {
            isShooting: false,
            aimX: 0,
            aimY: 0
        }
        this.corePosition = {
            x: 0,
            y: 0
        }
        this.attribute = {
            health: 100,
            isFalling: true,
            isMoving: false,
            isBlocking: false
        }
    }
    draw(color){
        c.fillStyle = color
        c.fillRect(
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height)
        if (playerDirection == 'right'){
            c.fillRect(
                this.corePosition.x,
                this.corePosition.y,
                this.width *2,
                1
            )
        }else{
            c.fillRect(
                this.corePosition.x,
                this.corePosition.y,
                this.width *-2,
                1
            )
        }
    }
    update(){
        this.position.y += this.velocity.y
        this.playerGravity()
        this.playerBoundaries()    
        this.playerShooting()
    }
    playerGravity(){
        if (this.position.y + this.height + this.velocity.y <= border.bottom){
            this.attribute.isFalling = true
            this.velocity.y += gravity
        }else{
            this.velocity.y = 0
            this.attribute.isFalling = false
        }
    }
    playerBoundaries(){
        this.corePosition.x = this.position.x + 0.5 * this.width
        this.corePosition.y = this.position.y + 0.5 * this.height

        // BOUNDARIES
        if (this.position.x > canvas.width * 0.5){
            this.position.x = Math.min(this.position.x, border.right - this.width)
        }else{
            this.position.x = Math.max(0, this.position.x)
        }
        if (this.velocity.x != 0){
            this.attribute.isMoving = true
        }else{
            this.attribute.isMoving = false
        }

        // COLLISION
        if (this.position.y + this.height <= platform.position.y 
            && this.position.y + this.height + this.velocity.y >= platform.position.y 
            && this.position.x + this.width >= platform.position.x 
            && this.position.x <= platform.position.x + platform.width){
            this.velocity.y = 0
            this.attribute.isFalling = false
        }
    }
    // PROJECTILE 
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
            c.strokeStyle = 'red';
            c.lineWidth = 2
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
        this.width = canvas.width * 0.6
        this.height = 2
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

const enemy = new Player()
    enemy.position.x = border.right - 100

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
    },
    block: {
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

let playerDirection = 'right'

addEventListener('keydown', ({key}) => {
    switch (key) {
        // LEFT 
        case 'a':
            keys.left.pressed = true
            playerDirection = 'left'
            break;
        // RIGHT 
        case 'd':
            keys.right.pressed = true
            playerDirection = 'right'
            break;
        // UP
        case 'w':
            keys.up.pressed = true
            break;
        // DOWN
        case 's':
            keys.down.pressed = true
            break;
        // BLOCK
        case 'e':
            keys.block.pressed = true
            break;
        case '':
            break
        }
        
})

addEventListener('keyup', ({key}) => {
    switch (key) {


        // LEFT 
        case 'a':
            keys.left.pressed = false
            if (keys.right.pressed){
                playerDirection = 'right'
            }
            break;
        // RIGHT 
        case 'd':
            keys.right.pressed = false
            if (keys.left.pressed){
                playerDirection = 'left'
            }
            break;
        // UP
        case 'w':
            keys.up.pressed = false
            break;
        // DOWN
        case 's':
            keys.down.pressed = false
            break;
        // BLOCK
        case 'e':
            keys.block.pressed = true
            break;
        }
    }
)


function playerMovement(){
    player.position.x += player.velocity.x

    // LEFT & RIGHT
    if(keys.right.pressed && playerDirection == 'right'){
        if (player.attribute.isFalling == true){
            player.velocity.x = canvas.width * 0.012
        }else{
            player.velocity.x = canvas.width * 0.015
        }
    }else if(keys.left.pressed && playerDirection == 'left') {
        if (player.attribute.isFalling == true){
            player.velocity.x = -canvas.width * 0.01
        }else{
            player.velocity.x = -canvas.width * 0.015
        }
    }else player.velocity.x = 0;

    // UP & DOWN
    if (keys.up.pressed && player.attribute.isFalling == false) {
        if (player.attribute.isMoving){
            player.velocity.y = -canvas.height * 0.035
        }else{
            player.velocity.y = -canvas.height * 0.032
        }
    }
    if (keys.down.pressed && player.position.y + player.height < border.bottom && player.attribute.isFalling == false){
        player.velocity.y += 1
    }

    // BLOCK
    if (keys.block.pressed){

    }
}


function enemyMovement(){
    enemy.position.x += enemy.velocity.x

    // LEFT & RIGHT
    if (keys.right.pressed && keys.left.pressed) {
        enemy.velocity.x = 0
    }else if(keys.right.pressed && enemy.position.x + enemy.width < border.right){
        if (enemy.attribute.isFalling == true){
            enemy.velocity.x = canvas.width * 0.012
        }else{
            enemy.velocity.x = canvas.width * 0.015
        }
    }else if(keys.left.pressed && enemy.position.x > border.left) {
        if (enemy.attribute.isFalling == true){
            enemy.velocity.x = -canvas.width * 0.01
        }else{
            enemy.velocity.x = -canvas.width * 0.015
        }
    }else enemy.velocity.x = 0;

    // UP & DOWN
    if (keys.up.pressed && enemy.position.y > border.top && enemy.attribute.isFalling == false) {
        enemy.velocity.y = -canvas.height * 0.032
    }
    if (keys.down.pressed && enemy.position.y + enemy.height < border.bottom && enemy.attribute.isFalling == false){
        enemy.velocity.y += 1
    }
}

// PROJECTILE REGISTER
// canvas.addEventListener('click', ({offsetX, offsetY}) => {
//     player.projectile.isShooting = true
//     player.projectile.aimX = offsetX
//     player.projectile.aimY = offsetY
//     }
// )

function clock(){
    requestAnimationFrame(clock)

    c.clearRect(0, 0, canvas.width, canvas.height)
    drawEnvironment()
    platform.draw()    

    player.update()
    player.draw('white')

    enemy.update()
    enemy.draw('orange')

    playerMovement()
    // enemyMovement()

    console.log(playerDirection)
}
clock()

