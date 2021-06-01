class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    preload() {
        // load images
        this.load.image('background', 'assets/level_1_background.png');
        this.load.image('egg', 'assets/egg.png');
        this.load.image('eggCracked1', 'assets/egg_crack_1.png');
        this.load.image('eggCracked2', 'assets/egg_crack_2.png');
        this.load.image('eggCracked3', 'assets/egg_crack_3.png');
        this.load.image('eggHatched', 'assets/egg_hatched.png');
        this.load.image('crack', 'assets/egg_shell.png');
        this.load.image('spider', 'assets/level_1_spider.png');

        // load spritesheet
        this.load.spritesheet('launch', 'assets/breaking_out.png', {frameWidth: 15, frameHeight: 400, frameStart: 0,
            frameEnd: 24});
    }
    create() {
        // background images and sprites
        this.background = this.add.tileSprite(0, 0, 1180, 720, 'background').setOrigin(0, 0);
        this.egg = this.add.tileSprite(480, 546, 15, 20, 'egg');
        this.cracked1 = this.add.tileSprite(480, 546, 15, 20, 'eggCracked1');
        this.cracked2 = this.add.tileSprite(480, 546, 15, 20, 'eggCracked2');
        this.cracked3 = this.add.tileSprite(480, 546, 15, 20, 'eggCracked3');
        this.hatched = this.add.tileSprite(480, 546, 15, 20, 'eggHatched');

        // animation config
        this.anims.create({
            key: 'pow',
            frames: this.anims.generateFrameNumbers('launch', {start: 0, end: 24, first: 0}),
            frameRate: 30
        })

        // hide necessary egg frames
        this.cracked1.alpha = 0;
        this.cracked2.alpha = 0;
        this.cracked3.alpha = 0;
        this.hatched.alpha = 0;

        // define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // create quick time event button sequence (randomizes each time)
        for(let i = 0; i < 12; i++) {
            let temp = Math.floor(Math.random() *  (3 - 0 + 1)) + 0;
            quickButtons.push(temp);
            
            // replacing number with letter value
            if(quickButtons[i] == 0) {
                quickButtons[i] = "W";
            } else if (quickButtons[i] == 1) {
                quickButtons[i] = "A";
            } else if (quickButtons[i] == 2) {
                quickButtons[i] = "S";
            } else {
                quickButtons[i] = "D";
            }
        }

        // particles depicting egg hatching (constant)
        this.particles = this.add.particles('crack');
        this.smallCrack = this.particles.createEmitter({
            x: this.egg.x,
            y: this.egg.y,
            speed: 50,
            gravityX: 0,
            gravityY: 150,
            scale: 0.4,
            lifespan: 300,
            quantity: 2,
            frequency: 1500
            
        });

        // particles depicting egg hatching (on button press)
        this.bigCrack = this.particles.createEmitter({
            x: this.egg.x,
            y: this.egg.y,
            speed: 70,
            gravityX: 0,
            gravityY: 150,
            scale: 0.5,
            lifespan: 300,
            quantity: 6
        })
        this.bigCrack.pause();

        this.spider = new Spider(this, 480, 100, 'spider', 0, -.5);
    }
    update() {
        if(!eggHatched && !eggEaten){
            this.spider.update();

            // check if spider has made it to the egg
            if(this.checkCollision()) {
                console.log("Game over!");
            }

            // if(Phaser.Input.Keyboard.JustDown(keySPACE)) {
            //     this.emitOnce(this.bigCrack);
            // }

            // display egg hatching progress
            if(hatchProgress == 3) {
                this.egg.alpha = 0;
                this.cracked1.alpha = 1;
            }
            else if(hatchProgress == 6) {
                this.cracked1.alpha = 0;
                this.cracked2.alpha = 1;
            }
            else if(hatchProgress == 9) {
                this.cracked2.alpha = 0;
                this.cracked3.alpha = 1;
            }
            else if(hatchProgress == 12) {
                this.cracked3.alpha = 0;
                this.hatched.alpha = 1;
                this.smallCrack.pause();
                eggHatched = true;
                let wormBirth = this.add.sprite(this.egg.x - 8, this.egg.y / 1.5, 'launch').setOrigin(0, 0);
                wormBirth.anims.play('pow');
            }
        }
    }

    // particle effect for correct button press
    emitOnce(emit) {
        emit.explode(4);
        emit.resume();
        hatchProgress++;
    }
    checkCollision() {
        if(this.spider.y > 440){
            eggEaten =  true;
            console.log("Nom nom nom");
        }    
        else {
            return false;
        }
    }
}