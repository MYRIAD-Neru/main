// GAME

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    spriteImage: './img/background/939716.png',
    scale: {
        x: canvas.width/1920,
        y: canvas.height/1080
    }
})

// PLAYER
const player = new Player({
    position: {
        x: canvas.width*0.12,
        y: 100
    },
    spriteImage: './img/character/HeroKnight/Idle.png',
    scale: {
        x: (canvas.width/180)*0.6,
        y: (canvas.width/180)*0.6
    },
    maxFrames: 11,
    offset: {
        x: canvas.width *0.27,
        y: canvas.width *0.2
    },
    sprites: {
        // RIGHT
        idle:{
            spriteImage: './img/character/HeroKnight/Idle.png',
            maxFrames: 11
        },
        run:{
            spriteImage: './img/character/HeroKnight/Run.png',
            maxFrames: 8
        },
        jump:{
            spriteImage: './img/character/HeroKnight/Jump.png',
            maxFrames: 3
        },
        fall:{
            spriteImage: './img/character/HeroKnight/Fall.png',
            maxFrames: 3
        },
        attack:{
            spriteImage: './img/character/HeroKnight/Attack2.png',
            maxFrames: 7
        },
        // INVERTED
        idleInvert:{
            spriteImage: './img/character/HeroKnight/Idle_Invert.png',
            maxFrames: 11
        },
        runInvert:{
            spriteImage: './img/character/HeroKnight/Run_Invert.png',
            maxFrames: 8
        },
        jumpInvert:{
            spriteImage: './img/character/HeroKnight/Jump_Invert.png',
            maxFrames: 3
        },
        fallInvert:{
            spriteImage: './img/character/HeroKnight/Fall_Invert.png',
            maxFrames: 3
        },
        attackInvert:{
            spriteImage: './img/character/HeroKnight/Attack2_Invert.png',
            maxFrames: 7
        }
    }
})
    player.attack.meleeRange.max *= 0.7
    player.attack.meleeDamage *= 1.2

// ENEMY
const enemy = new Player({
    position: {
        x: border.right - canvas.width*0.2,
        y: 100
    },
    spriteImage: './img/character/MartialHero/Idle.png',
    scale: {
        x: (canvas.width/200)*0.7,
        y: (canvas.width/200)*0.7
    },
    maxFrames: 8,
    offset: {
        x: canvas.width *0.3,
        y: canvas.width *0.247
    },
    sprites: {
        // RIGHT
        idle:{
            spriteImage: './img/character/MartialHero/Idle.png',
            maxFrames: 8
        },
        run:{
            spriteImage: './img/character/MartialHero/Run.png',
            maxFrames: 8
        },
        jump:{
            spriteImage: './img/character/MartialHero/Jump.png',
            maxFrames: 2
        },
        fall:{
            spriteImage: './img/character/MartialHero/Fall.png',
            maxFrames: 2
        },
        attack:{
            spriteImage: './img/character/MartialHero/Attack1.png',
            maxFrames: 6
        },
        // INVERTED
        idleInvert:{
            spriteImage: './img/character/MartialHero/Idle_Invert.png',
            maxFrames: 8
        },
        runInvert:{
            spriteImage: './img/character/MartialHero/Run_Invert.png',
            maxFrames: 8
        },
        jumpInvert:{
            spriteImage: './img/character/MartialHero/Jump_Invert.png',
            maxFrames: 2
        },
        fallInvert:{
            spriteImage: './img/character/MartialHero/Fall_Invert.png',
            maxFrames: 2
        },
        attackInvert:{
            spriteImage: './img/character/MartialHero/Attack1_Invert.png',
            maxFrames: 6
        }
    }
})
    enemy.attribute.direction = 'left'
    enemy.attack.meleeDamage *= 1.5




// CLOCK
function clock(){
    requestAnimationFrame(clock)

    c.clearRect(0, 0, canvas.width, canvas.height)

    background.update()


    // shop.update()
    drawEnvironment()

    // EXPERIMENTAL
    // player.drawBox()
    // enemy.drawBox()
    // player.drawAttack()
    // enemy.drawAttack()
    // 

    player.update()
    enemy.update()

    playerAttack()
    enemyAttack()

    // PLAYER INVERT TWEAK
    if(player.image == player.sprites.jumpInvert.image ||
        player.image == player.sprites.fallInvert.image )
    {
        player.offset.x = canvas.width *0.24
    }else if(player.image == player.sprites.attackInvert.image)
    {
        player.offset.x = canvas.width *0.35
    }else player.offset.x = canvas.width *0.27

    // ENEMY INVERT TWEAK
    if(enemy.image == enemy.sprites.idleInvert.image || 
        enemy.image == enemy.sprites.runInvert.image ||
        enemy.image == enemy.sprites.jumpInvert.image ||
        enemy.image == enemy.sprites.fallInvert.image 
    ){
        enemy.offset.x = canvas.width *0.258
    }else if(enemy.image == enemy.sprites.attackInvert.image)
    {
        enemy.offset.x = canvas.width *0.53
    }else enemy.offset.x = canvas.width *0.3

    // EXPERIMENTAL
    document.querySelector('#playerHealth').style.width = player.attribute.health + '%'
    document.querySelector('#enemyHealth').style.width = enemy.attribute.health + '%'
    
    if (enemy.attribute.health < 100){
    enemy.attribute.health += 0.2
    }
    if (enemy.attribute.health < 5){
        enemy.attribute.health = 100
    }

    if (player.attribute.health < 100){
        player.attribute.health += 0.2
    }
    if (player.attribute.health < 5){
        player.attribute.health = 100
    }

}
clock()

