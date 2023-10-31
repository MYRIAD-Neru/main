
class Sprite {
    constructor({
        position, 
        spriteImage, 
        scale = {x: 1, y: 1}, 
        maxFrames = 1,
        offset = {x: 0, y: 0},
    }){
        this.position = position
        this.width = 0
        this.height = 0

        this.image = new Image()
        this.image.src = spriteImage
        this.scale = scale

        this.maxFrames = maxFrames
        this.currentFrames = 0
        this.elapsedFrames = 0,
        this.holdFrames = 10

        this.offset = offset
    }

    // SPRITES
    draw(){
        c.drawImage(
            this.image, 
            // FRAME
            (this.image.width / this.maxFrames) * this.currentFrames,
            0,
            this.image.width / this.maxFrames,
            this.image.height,

            // POSITION
            (this.position.x - this.offset.x), 
            this.position.y - this.offset.y,

            // SIZE
            (this.image.width / this.maxFrames ) * this.scale.x,
            this.image.height * this.scale.y
            )
    }
    animateFrames(){
        // ANIMATION
        this.elapsedFrames++
        if(this.elapsedFrames % this.holdFrames == 0){
            if(this.currentFrames < (this.maxFrames - 1)){
                this.currentFrames++
            } else {
                this.currentFrames = 0
            }
        }
    }
    update(){
        this.animateFrames()
        this.draw()
        
    }
}

class Player extends Sprite{
    constructor({
        position,
        spriteImage, 
        scale = { x: 1, y: 1}, 
        maxFrames = 1,
        offset = { x: 0, y: 0},
        sprites
    }) { 
        super({
            position,
            spriteImage,
            scale,
            maxFrames,
            offset,
        })
        this.currentFrames = 0
        this.elapsedFrames = 0,
        this.holdFrames = 6

        this.sprites = sprites
        for(const stance in this.sprites){
            sprites[stance].image = new Image()
            sprites[stance].image.src = sprites[stance].spriteImage
        }

        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = canvas.width * 0.1
        this.height = canvas.width * 0.18
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
        this.input = {
            up: false,
            down: false,
            left: false,
            right: false,
            attack: false,
            block: false,
            crouch: false
        }
        this.attack = {
            meleeRange: {
                max: canvas.width *0.2, 
                min: canvas.width *0.1,
                up: canvas.height *0.1,
                down: canvas.height *0.2
            },
            meleeDamage: 2,
            inRange: false
        }
    }
    drawBox(){
    // PLAYER
        c.fillStyle = 'red'
        c.fillRect(
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height)
    }

    drawAttack(){
        // ATTACKBOX
        // DIRECTION
        if (this.attribute.direction == 'right'){
            c.fillStyle = '#00ff00'
            c.fillRect(
                this.corePosition.x,
                this.corePosition.y,
                this.attack.meleeRange.max + this.attack.meleeRange.min,
                this.width *0.02
            )
            // RANGEBOX

            if(this.attribute.isAttacking){
                c.fillRect(
                this.corePosition.x + this.attack.meleeRange.min, 
                this.corePosition.y - this.attack.meleeRange.up, 
                this.attack.meleeRange.max,
                this.attack.meleeRange.down
                )
            }
        }
        else if(this.attribute.direction == 'left'){
            c.fillStyle = '#00ff00'
            c.fillRect(
                this.corePosition.x,
                this.corePosition.y,
                -(this.attack.meleeRange.max + this.attack.meleeRange.min),
                this.width *0.02
            )
            // RANGEBOX
            if(this.attribute.isAttacking){
                c.fillRect(
                    this.corePosition.x - this.attack.meleeRange.min, 
                    this.corePosition.y - this.attack.meleeRange.up, 
                    -this.attack.meleeRange.max,
                    this.attack.meleeRange.down
                    )
            }
        }
    }
    gravity(){
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y <= border.bottom){
            this.attribute.isFalling = true
            this.velocity.y += gravity
        }else{
            this.velocity.y = 0
            this.attribute.isFalling = false
        }

    }
    movement(){
        this.position.x += this.velocity.x

        // PREVENT MOVEMENT WHEN ATTACKING
        if((this.image === this.sprites.attack.image &&
            this.currentFrames < this.sprites.attack.maxFrames - 1 &&
            !this.attribute.isFalling)
            ||
            (this.image === this.sprites.attackInvert.image &&
            this.currentFrames < this.sprites.attackInvert.maxFrames - 1 &&
            !this.attribute.isFalling)
        ){
            this.velocity.x = 0
            return
        }

        // IDLE
        if(!this.attribute.isMoving){
            if(this.attribute.direction == 'right'){
                this.switchStance('idle')
            }else this.switchStance('idleInvert')
        }

        // RIGHT
        if(this.input.right && this.attribute.direction == 'right'){
            if (this.attribute.isFalling == true){
                this.velocity.x = speed * 0.75
            }else{
                this.velocity.x = speed
            }
            this.switchStance('run')
        }

        // LEFT
        else if(this.input.left && this.attribute.direction == 'left') {
            if (this.attribute.isFalling == true){
                this.velocity.x = -speed * 0.75
            }else{
                this.velocity.x = -speed
            }
            this.switchStance('runInvert')
        }
        else this.velocity.x = 0;

        // UP
        if (this.input.up && this.attribute.isFalling == false) {
            if (this.attribute.isMoving){
                this.velocity.y = jump * 1.1
            }else{
                this.velocity.y = jump
            }
        }

        // JUMP ANIMATION
        if(this.attribute.isFalling && this.velocity.y < 0){
            if(this.attribute.direction == 'right'){
                this.switchStance('jump')
            } else this.switchStance('jumpInvert')
        }

        // FALL ANIMATION
        else if(this.attribute.isFalling && this.velocity.y >= 0){
            if(this.attribute.direction == 'right'){
                this.switchStance('fall')
            } else this.switchStance('fallInvert')
        }
    }
    boundaries(){
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

    }
    switchStance(sprite){
        if(
            (this.image === this.sprites.attack.image &&
            this.currentFrames < this.sprites.attack.maxFrames - 1) ^
            (this.image === this.sprites.attackInvert.image &&
            this.currentFrames < this.sprites.attackInvert.maxFrames - 1)
        ){
            return
        }

        switch (sprite){
            // RIGHT SIDE
            case 'idle':
                if (this.image !== this.sprites.idle.image){
                    this.image = this.sprites.idle.image
                    this.maxFrames = this.sprites.idle.maxFrames
                    this.currentFrames = 0
                }
                break;
            case 'run':
                if (this.image !== this.sprites.run.image){
                    this.image = this.sprites.run.image
                    this.maxFrames = this.sprites.run.maxFrames
                    this.currentFrames = 0
                }
                break;
            case 'jump':
                if (this.image !== this.sprites.jump.image){
                    this.image = this.sprites.jump.image
                    this.maxFrames = this.sprites.jump.maxFrames
                    this.currentFrames = 0
                }
                break;
            case 'fall':
                if (this.image !== this.sprites.fall.image){
                    this.image = this.sprites.fall.image
                    this.maxFrames = this.sprites.fall.maxFrames
                    this.currentFrames = 0
                }
                break;  
            case 'attack':
                if (this.image !== this.sprites.attack.image){
                    this.image = this.sprites.attack.image
                    this.maxFrames = this.sprites.attack.maxFrames
                    this.currentFrames = 0
                }
                break;
            
            // LEFT SIDE
            case 'idleInvert':
                if (this.image !== this.sprites.idleInvert.image){
                    this.image = this.sprites.idleInvert.image
                    this.maxFrames = this.sprites.idleInvert.maxFrames
                    this.currentFrames = 0
                }
                break;
            case 'runInvert':
                if (this.image !== this.sprites.runInvert.image){
                    this.image = this.sprites.runInvert.image
                    this.maxFrames = this.sprites.runInvert.maxFrames
                    this.currentFrames = 0
                }
                break;
            case 'jumpInvert':
                if (this.image !== this.sprites.jumpInvert.image){
                    this.image = this.sprites.jumpInvert.image
                    this.maxFrames = this.sprites.jumpInvert.maxFrames
                    this.currentFrames = 0
                }
                break;
            case 'fallInvert':
                if (this.image !== this.sprites.fallInvert.image){
                    this.image = this.sprites.fallInvert.image
                    this.maxFrames = this.sprites.fallInvert.maxFrames
                    this.currentFrames = 0
                }
                break;  
            case 'attackInvert':
                if (this.image !== this.sprites.attackInvert.image){
                    this.image = this.sprites.attackInvert.image
                    this.maxFrames = this.sprites.attackInvert.maxFrames
                    this.currentFrames = 0
                }
                break;
        }
    }
    update(){
        this.gravity()
        this.boundaries()
        this.movement()
        this.animateFrames()
        this.draw()
    }
}


