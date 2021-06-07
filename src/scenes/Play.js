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

        // load spritesheets
        // inchworm hatch
        this.load.spritesheet('launch', 'assets/breaking_out.png', {frameWidth: 15, frameHeight: 400, frameStart: 0,
            frameEnd: 24});

        // button presses
        this.load.spritesheet('buttonW', 'assets/button_W.png', {frameWidth: 200, frameHeight: 200, frameStart: 0,
            frameEnd: 1});
        this.load.spritesheet('buttonA', 'assets/button_A.png', {frameWidth: 200, frameHeight: 200, frameStart: 0,
            frameEnd: 1});
        this.load.spritesheet('buttonS', 'assets/button_S.png', {frameWidth: 200, frameHeight: 200, frameStart: 0,
            frameEnd: 1});
        this.load.spritesheet('buttonD', 'assets/button_D.png', {frameWidth: 200, frameHeight: 200, frameStart: 0,
            frameEnd: 1});
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
        this.anims.create({
            key: 'W',
            frames: this.anims.generateFrameNumbers('buttonW', {start: 0, end: 1, first: 0}),
            frameRate: 3,
            delay: 200,
            hideOnComplete: true,
            repeat: -1
        })
        this.anims.create({
            key: 'A',
            frames: this.anims.generateFrameNumbers('buttonA', {start: 0, end: 1, first: 0}),
            frameRate: 3,
            hideOnComplete: true,
            repeat: -1
        })
        this.anims.create({
            key: 'S',
            frames: this.anims.generateFrameNumbers('buttonS', {start: 0, end: 1, first: 0}),
            frameRate: 3,
            hideOnComplete: true,
            repeat: -1
        })
        this.anims.create({
            key: 'D',
            frames: this.anims.generateFrameNumbers('buttonD', {start: 0, end: 1, first: 0}),
            frameRate: 3,
            hideOnComplete: true,
            repeat: -1
        })

        // hide necessary egg frames
        this.cracked1.alpha = 0;
        this.cracked2.alpha = 0;
        this.cracked3.alpha = 0;
        this.hatched.alpha = 0;

        // define keys
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
        console.log(quickButtons);

        // create key combo for quick time event
        this.combo = this.input.keyboard.createCombo(quickButtons, {
            resetOnWrongKey: false,
            maxKeyDelay: 0
        }); 
        this.input.keyboard.on('keycombomatch', function(event) {
            this.cracked3.alpha = 0;
            this.hatched.alpha = 1;
            this.smallCrack.pause();
            eggHatched = true;
            let wormBirth = this.add.sprite(this.egg.x - 8, this.egg.y / 1.5, 'launch').setOrigin(0, 0);
            wormBirth.anims.play('pow');
            console.log("Quick time event complete!");
        });

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

        this.spider = new Spider(this, 480, 100, 'spider', 0, -.1);
    }
    update() {

        if(!eggHatched && !eggEaten){
            this.spider.update();

            // check if spider has made it to the egg
            if(this.checkCollision()) {
                console.log("Game over!");
            }

            // give player quick time event button prompt
            let comboNumber = this.buttonPrompt(this.combo, animPlaying);
            animPlaying = true;

            // check if they press the correct button
            console.log(comboNumber);
            if(comboNumber == 65 && Phaser.Input.Keyboard.JustDown(keyA)) {
                this.emitOnce(this.bigCrack);
                console.log("Button press success!");
            }
            if(comboNumber == 68 && Phaser.Input.Keyboard.JustDown(keyD)) {
                this.emitOnce(this.bigCrack);
                console.log("Button press success!");
            }
            if(comboNumber == 83 && Phaser.Input.Keyboard.JustDown(keyS)) {
                this.emitOnce(this.bigCrack);
                console.log("Button press success!");
            }
            if(comboNumber == 87 && Phaser.Input.Keyboard.JustDown(keyW)) {
                this.emitOnce(this.bigCrack);
                console.log("Button press success!");
            }

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

    checkCollision() {
        if(this.spider.y > 440){
            eggEaten =  true;
        }    
        else {
            return false;
        }
    }
    buttonPrompt(letters, anim) {
        let val = letters.current;
        let pressThis;
        
        // check the current keycode of the array and play appropriate animation to prompt the 
        // player wich button to press
        if(letters.current == 65) {
            pressThis = this.add.sprite(600, 200, 'buttonA').setOrigin(0, 0);
            if(!anim) {
                pressThis.anims.play('A');
                //anim = true;
                console.log(" Press A!");
            }

        } else if(val == 68) {
            pressThis = this.add.sprite(600, 200, 'buttonD').setOrigin(0, 0);
            if(!anim) {
                pressThis.anims.play('D');
                //anim = true;
                console.log(" Press D!");
            }

        } else if(val == 83) {
            pressThis = this.add.sprite(600, 200, 'buttonS').setOrigin(0, 0);
            if(!anim) {
                pressThis.anims.play('S');
                //anim = true;
                console.log(" Press S!");
            }

        } else if(val == 87) {
            pressThis = this.add.sprite(600, 200, 'buttonW').setOrigin(0, 0);
            if(!anim) {
                pressThis.anims.play('W');
                //anim = true;
                console.log(" Press W!");
            }
        }
        return val;
    }
    // buttonCheck(letters, emit, W, A, S, D, anim){
    //     console.log("waiting for button");
    //     if(letters.current == 65 && Phaser.Input.Keyboard.JustDown(A)) {
    //         this.emitOnce(emit);
    //         console.log("Button press success!");
    //     }
    //     if(letters.current == 68 && Phaser.Input.Keyboard.JustDown(D)) {
    //         this.emitOnce(emit);
    //         console.log("Button press success!");
    //     }
    //     if(letters.current == 83 && Phaser.Input.Keyboard.JustDown(S)) {
    //         this.emitOnce(emit);
    //         console.log("Button press success!");
    //     }
    //     if(letters.current == 87 && Phaser.Input.Keyboard.JustDown(W)) {
    //         this.emitOnce(emit);
    //         console.log("Button press success!");
    //     }
    //     anim = false;
    //     return anim;
    // }

    // particle effect for correct button press
    emitOnce(emit) {
        emit.explode(4);
        emit.resume();
        hatchProgress++;
        console.log("Crack!");
    }
}