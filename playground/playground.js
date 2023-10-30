// GAME

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    spriteImage: './img/backgroundImageInvert.png'
})

const platform = new Platform()
    platform.position.y = 0


const player = new Player()
    player.attribute.color = 'green'

const enemy = new Player()
    enemy.position.x = border.right * 0.85
    enemy.attribute.direction ='left'
    enemy.attribute.color = 'red'

    
const keys = {
    // PLAYER CONTROLS
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
    leftClick: {
        pressed: false
    },
    rightClick: {
        pressed: false
    },

    // DUMMY CONTROLS
    rightArrow: {
        pressed: false
    },
    leftArrow: {
        pressed: false
    },
    upArrow: {
        pressed: false
    },   
    downArrow: {
        pressed: false
    },
    one: {
        pressed: false
    },
    two: {
        pressed: false
    }
}


// CLOCK
function clock(){
    requestAnimationFrame(clock)

    c.clearRect(0, 0, canvas.width, canvas.height)
    background.draw()

    player.update()
    enemy.update()

    detectMovement(player)
    playerAttack()

    detectMovement(enemy)    
    enemyAttack()

    // EXPERIMENTAL
    document.querySelector('#playerHealth').style.width = player.attribute.health + '%'
    document.querySelector('#enemyHealth').style.width = enemy.attribute.health + '%'
    
    if (enemy.attribute.health < 100){
    enemy.attribute.health += 0.5
    }
    if (player.attribute.health < 5){
        player.attribute.health = 100
    }
    if (enemy.attribute.health < 5){
        enemy.attribute.health = 100
    }    
}
clock()

