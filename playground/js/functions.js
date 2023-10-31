console.log('Welcome to the Game.')

// FORMALITIES
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.style.userSelect = "none"; 
canvas.style.backgroundColor = 'none'
document.body.style.userSelect = "auto";

window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight", "Shift"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);
addEventListener('contextmenu', (e)=>{
    e.preventDefault()
})


// CANVAS DIMENSIONS
canvas.width = 3000
canvas.height = canvas.width * 0.6

// BORDERS
const border = {
    top: 0,
    bottom: canvas.height * 0.93,
    left: 0,
    right: canvas.width
}

function drawEnvironment(){
    c.fillStyle = 'black'
    c.fillRect(
        0, 
        border.bottom, 
        canvas.width, 
        300
    )
}

// SPEED CONSTANTS
const gravity = canvas.height * 0.0011
const speed = canvas.width * 0.01
const jump = -canvas.height * 0.027

// INPUT REGISTER
addEventListener('keydown', ({key}) => {
    

    switch (key) {
    // PLAYER CONTROLS
        // LEFT 
        case 'a':
            player.input.left = true
            player.attribute.direction = 'left'
            break;
        // RIGHT 
        case 'd':
            player.input.right = true
            player.attribute.direction = 'right'
            break;
        // UP
        case 'w':
            player.input.up = true
            break;
        // DOWN
        case 's':
            player.input.down = true
            break;
        // ATTACK
        case 'j':
            player.input.attack = true
            break;
        // BLOCK
        case 'k':
            player.input.block = true
            break;
        
    
    // ENEMY CONTROLS
        // ENEMY LEFT 
        case 'ArrowLeft':
            enemy.input.left = true
            enemy.attribute.direction = 'left'
            break;
        // ENEMY RIGHT 
        case 'ArrowRight':
            enemy.input.right = true
            enemy.attribute.direction = 'right'
            break;
        // ENEMY UP
        case 'ArrowUp':
            enemy.input.up = true            
            break;
        // ENEMY DOWN
        case 'ArrowDown':
            enemy.input.down = true            
            break;
        // ENEMY ATTACK
        case '1':
            enemy.input.attack = true              
            break;
        // ENEMY BLOCK
        case '2':
            enemy.input.block = true              
            break;
        }
    }
)

addEventListener('keyup', ({key}) => {
    switch (key) {
        // PLAYER CONTROLS DONE
            // LEFT 
            case 'a':
                player.input.left = false
                if (player.input.right){
                    player.attribute.direction = 'right'
                }
                break;
            // RIGHT 
            case 'd':
                player.input.right = false
                if (player.input.left){
                    player.attribute.direction = 'left'
                }
                break;
            // UP
            case 'w':
                player.input.up = false
                break;
            // DOWN
            case 's':
                player.input.down = false
                break;
            // ATTACK
            case 'j':
                player.input.attack = false
                break;
            // BLOCK
            case 'k':
                player.input.block = false
                break;
            
        // ENEMY CONTROLS DONE
            // ENEMY LEFT 
            case 'ArrowLeft':
                enemy.input.left = false
                if (enemy.input.right){
                    enemy.attribute.direction = 'right'
                }
                break;
            // ENEMY RIGHT 
            case 'ArrowRight':
                enemy.input.right = false
                if (enemy.input.left){
                    enemy.attribute.direction = 'left'
                }
                break;
            // ENEMY UP
            case 'ArrowUp':
                enemy.input.up = false            
                break;
            // ENEMY DOWN
            case 'ArrowDown':
                enemy.input.down = false            
                break;
            // ENEMY ATTACK
            case '1':
                enemy.input.attack = false              
                break;
            // ENEMY BLOCK
            case '2':
                enemy.input.block = false              
                break;
            }
        }
)


function detectCollision(boxOne, boxTwo){
    const minRangeRight = boxOne.corePosition.x + boxOne.attack.meleeRange.min
    const maxRangeRight = boxOne.corePosition.x + boxOne.attack.meleeRange.max + boxOne.attack.meleeRange.min
    const minRangeLeft = boxOne.corePosition.x - boxOne.attack.meleeRange.min
    const maxRangeLeft = boxOne.corePosition.x - boxOne.attack.meleeRange.max - boxOne.attack.meleeRange.min
    const upRange = boxOne.corePosition.y - boxOne.attack.meleeRange.up
    const downRange = boxOne.corePosition.y - boxOne.attack.meleeRange.up + boxOne.attack.meleeRange.down
    return(
        (boxOne.attribute.direction == 'right'                  // DETECTION -> RIGHT
        && maxRangeRight >= boxTwo.position.x 
        && minRangeRight < boxTwo.position.x + boxTwo.width) 
        ^
        (boxOne.attribute.direction == 'left'       
        && maxRangeLeft <= boxTwo.position.x + boxTwo.width     // DETECTION -> LEFT
        && minRangeLeft > boxTwo.position.x) 
        &&
        (upRange < boxTwo.position.y + boxTwo.height            // DETECTION -> HEIGHT
        && downRange > boxTwo.position.y)
    )
}

function playerAttack(){
    // J -> ATTACK
    if (player.input.attack && !player.attribute.isAttacking ){
        player.attribute.isAttacking = true
        if(player.attribute.direction == 'right'){
            player.switchStance('attack')
        }else player.switchStance('attackInvert')

    } else if (!player.input.attack){
        player.attribute.isAttacking = false
    }
    if(player.image == player.sprites.attack.image ||
        player.image == player.sprites.attackInvert.image 
    ){
        if(detectCollision(player,enemy) && player.currentFrames >= 4){
            player.attack.inRange = true
            enemy.attribute.health -= player.attack.meleeDamage
        }
    }
    // K -> BLOCK
    if (player.input.block){
        player.attribute.isBlocking = true
    } else player.attribute.isBlocking = false
}

function enemyAttack(){
    // ONE -> ATTACK
    if (enemy.input.attack && !enemy.attribute.isAttacking ){
        enemy.attribute.isAttacking = true
        enemy.switchStance('attack')
    } else if (!enemy.input.attack){
        enemy.attribute.isAttacking = false
    }
    if(enemy.image == enemy.sprites.attack.image){
        if(detectCollision(enemy,player) && enemy.currentFrames >= 3){
            player.attribute.health -= enemy.attack.meleeDamage
        }
    }
    // TWO -> BLOCK
    if (enemy.input.block){
        enemy.attribute.isBlocking = true
    } else enemy.attribute.isBlocking = false
}

// PROJECTILE REGISTER
