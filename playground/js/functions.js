console.log('Welcome to the Game.')

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

canvas.width = window.innerWidth * 0.9
canvas.height = canvas.width * 0.6

const border = {
    top: 0,
    bottom: canvas.height * 0.96,
    left: 0,
    right: canvas.width
}

const gravity = canvas.height * 0.0011

console.log(canvas.height, canvas.width)




addEventListener('keydown', ({key}) => {
    switch (key) {
    // PLAYER CONTROLS
        // LEFT 
        case 'a':
            keys.left.pressed = true
            player.attribute.direction = 'left'
            break;
        // RIGHT 
        case 'd':
            keys.right.pressed = true
            player.attribute.direction = 'right'
            break;
        // UP
        case 'w':
            keys.up.pressed = true
            break;
        // DOWN
        case 's':
            keys.down.pressed = true
            break;
    
    // ENEMY CONTROLS
        // ENEMY LEFT 
        case 'ArrowLeft':
            keys.leftArrow.pressed = true
            enemy.attribute.direction = 'left'
            break;
        // ENEMY RIGHT 
        case 'ArrowRight':
            keys.rightArrow.pressed = true
            enemy.attribute.direction = 'right'
            break;
        // ENEMY UP
        case 'ArrowUp':
            keys.upArrow.pressed = true
            break;
        // ENEMY DOWN
        case 'ArrowDown':
            keys.downArrow.pressed = true
            break;
        // ENEMY ATTACK
        case '1':
            keys.one.pressed = true
            break;
        // ENEMY BLOCK
        case '2':
            keys.two.pressed = true
            break;
        }
    }
)

addEventListener('keyup', ({key}) => {
    switch (key) {
    // PLAYER CONTROLS
        // LEFT 
        case 'a':
            keys.left.pressed = false
            if (keys.right.pressed){
                player.attribute.direction = 'right'
            }
            break;
        // RIGHT 
        case 'd':
            keys.right.pressed = false
            if (keys.left.pressed){
                player.attribute.direction = 'left'
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

    // ENEMY CONTROLS
        // ENEMY LEFT 
        case 'ArrowLeft':
            keys.leftArrow.pressed = false
            if (keys.rightArrow.pressed){
                enemy.attribute.direction = 'right'
            }
            break;
        // ENEMY RIGHT 
        case 'ArrowRight':
            keys.rightArrow.pressed = false
            if (keys.leftArrow.pressed){
                enemy.attribute.direction = 'left'
            }
            break;
        // ENEMY UP
        case 'ArrowUp':
            keys.upArrow.pressed = false
            break;
        // ENEMY DOWN
        case 'ArrowDown':
            keys.downArrow.pressed = false
            break;
        case '1':
            keys.one.pressed = false
            break;
        // ENEMY BLOCK
        case '2':
            keys.two.pressed = false
            break;
        }
    }
)

function detectCollision(boxOne, boxTwo){
    return(
        (boxOne.attribute.direction == 'right'
        && boxOne.corePosition.x + boxOne.attack.meleeRange >= boxTwo.position.x 
        && boxOne.corePosition.x < boxTwo.corePosition.x 
        && boxOne.corePosition.y < boxTwo.position.y + boxTwo.height 
        && boxOne.corePosition.y > boxTwo.position.y) ^ 
        (boxOne.attribute.direction == 'left'       
        && boxOne.corePosition.x - boxOne.attack.meleeRange <= boxTwo.position.x + boxTwo.width 
        && boxOne.corePosition.x > boxTwo.corePosition.x 
        && boxOne.corePosition.y < boxTwo.position.y + boxTwo.height 
        && boxOne.corePosition.y > boxTwo.position.y)
    )
}

function detectMovement(target){
    target.position.x += target.velocity.x

    if (target == player){
        // LEFT & RIGHT
        if(keys.right.pressed && target.attribute.direction == 'right'){
            if (target.attribute.isFalling == true){
                target.velocity.x = canvas.width * 0.006
            }else{
                target.velocity.x = canvas.width * 0.008
            }
        }else if(keys.left.pressed && target.attribute.direction == 'left') {
            if (target.attribute.isFalling == true){
                target.velocity.x = -canvas.width * 0.006
            }else{
                target.velocity.x = -canvas.width * 0.008
            }
        }else target.velocity.x = 0;

        // UP & DOWN
        if (keys.up.pressed && target.attribute.isFalling == false) {
            if (target.attribute.isMoving){
                target.velocity.y = -canvas.height * 0.03
            }else{
                target.velocity.y = -canvas.height * 0.027
            }
        }
        if (keys.down.pressed && target.position.y + target.height < border.bottom && target.attribute.isFalling == false){
            target.velocity.y += 1
        }
    }
    else if (target == enemy){
        // LEFT & RIGHT
        if(keys.rightArrow.pressed && target.attribute.direction == 'right'){
            if (target.attribute.isFalling == true){
                target.velocity.x = canvas.width * 0.006
            }else{
                target.velocity.x = canvas.width * 0.008
            }
        }else if(keys.leftArrow.pressed && target.attribute.direction == 'left') {
            if (target.attribute.isFalling == true){
                target.velocity.x = -canvas.width * 0.006
            }else{
                target.velocity.x = -canvas.width * 0.008
            }
        }else target.velocity.x = 0;
        // UP & DOWN
        if (keys.upArrow.pressed && target.attribute.isFalling == false) {
            if (target.attribute.isMoving){
                target.velocity.y = -canvas.height * 0.03
            }else{
                target.velocity.y = -canvas.height * 0.027
            }
        }
        if (keys.downArrow.pressed && target.position.y + target.height < border.bottom && target.attribute.isFalling == false){
            target.velocity.y += 1
        }
    }
}

function playerAttack(){
    // LEFT CLICK -> ATTACK
    if (keys.leftClick.pressed){
        keys.leftClick.pressed = false
        player.attribute.isAttacking = true
     }else player.attribute.isAttacking = false
    
    if(detectCollision(player,enemy)){
        player.attack.inRange = true
    }else player.attack.inRange = false

    // PLAYER ATTACK HITS
    if(player.attribute.isAttacking && player.attack.inRange){
        enemy.attribute.health -= player.attack.meleeDamage

    }

    // RIGHT CLICK -> BLOCK
    if (keys.rightClick.pressed){
        player.attribute.isBlocking = true
    } else player.attribute.isBlocking = false
}

function enemyAttack(){
    // ONE -> ATTACK
    if (keys.one.pressed){
        keys.one.pressed = false
        enemy.attribute.isAttacking = true
    }else enemy.attribute.isAttacking = false
    
    if(detectCollision(enemy,player)){
        enemy.attack.inRange = true
    }else enemy.attack.inRange = false

    // ENEMY ATTACK HITS
    if(enemy.attribute.isAttacking && enemy.attack.inRange){
        player.attribute.health -= enemy.attack.meleeDamage
        
    }

    // TWO -> BLOCK
    if (keys.rightClick.pressed){
        enemy.attribute.isBlocking = true
    } else enemy.attribute.isBlocking = false

}

// PROJECTILE REGISTER
addEventListener('contextmenu', (e)=>{
    e.preventDefault()
})
addEventListener('mousedown', (e) => {
    if (e.button == 0){
        keys.leftClick.pressed = true
    }else if(e.button == 2){
        keys.rightClick.pressed = true
    }
    // clickCoordinates(e.offsetX, e.offsetY)
})
addEventListener('mouseup', (e) => {
    if (e.button == 0){
        keys.leftClick.pressed = false 
    }else if(e.button == 2){
        keys.rightClick.pressed = false
    }
})