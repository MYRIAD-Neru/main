class Sprite {
    constructor({position, spriteImage}){
        this.position = position
        this.width = 0
        this.height = 0

        this.image = new Image()
        this.image.src = spriteImage
    }
    // SPRITES
    draw(){
        c.drawImage(this.image, 0, 0, canvas.width, canvas.height)
    }
    update(){
        this.draw()
    }
}

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
        this.width = canvas.width * 0.04
        this.height = this.width * 5
        this.corePosition = {
            x: 0,
            y: 0
        }
        this.attribute = {
            color: 'white',
            health: 100,
            isFalling: true,
            isMoving: false,
            isBlocking: false,
            isAttacking: false,
            direction: 'right'
        }
        this.attack = {
            meleeRange: canvas.width*0.13,
            meleeDamage: 10,
            inRange: false
        }
        this.projectile = {
            isShooting: false,
            aimX: 0,
            aimY: 0
        }
    }
    // SPRITES
    draw(color){
    // PLAYER
        c.fillStyle = color
        c.fillRect(
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height)
    // ATTACKBOX
        // DIRECTION
        if (this.attribute.direction == 'right'){
            c.fillStyle = this.attribute.color
            c.fillRect(
                this.corePosition.x,
                this.corePosition.y,
                this.width *2,
                1
            )
        }else if(this.attribute.direction == 'left'){
            c.fillStyle = this.attribute.color
            c.fillRect(
                this.corePosition.x,
                this.corePosition.y,
                this.width *-2,
                1
            )
        }
        // RANGEBOX
        c.fillStyle = '#ff003050'
        if(this.attribute.isAttacking){
            if (this.attribute.direction == 'right'){
                c.fillRect(
                    this.corePosition.x, 
                    this.corePosition.y, 
                    this.attack.meleeRange,
                    -this.attack.meleeRange * 0.15
                    )

            }else if(this.attribute.direction == 'left'){
                c.fillRect(
                    this.corePosition.x, 
                    this.corePosition.y, 
                    -this.attack.meleeRange,
                    -this.attack.meleeRange * 0.15
                    )
            }
        }
    }
    update(){
        this.playerGravity()
        this.playerBoundaries()    
        this.draw(this.attribute.color)
    }
    playerGravity(){
        this.position.y += this.velocity.y

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

        // WALL COLLISION
        if (this.position.y + this.height <= platform.position.y 
            && this.position.y + this.height + this.velocity.y >= platform.position.y 
            && this.position.x + this.width >= platform.position.x 
            && this.position.x <= platform.position.x + platform.width){
            this.velocity.y = 0
            this.attribute.isFalling = false
        }
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
