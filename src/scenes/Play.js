class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    preload() {
        this.load.image('background', 'assets/level_1_background.png');
        this.load.image('egg', 'assets/egg.png');
        this.load.image('crack', 'assets/egg_shell.png');
    }
    create() {
        // background images and sprites
        this.background = this.add.tileSprite(0, 0, 1180, 720, 'background').setOrigin(0, 0);
        this.egg = this.add.tileSprite(480, 546, 15, 20, 'egg');

        // define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

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
    }
    update() {
        if(!eggHatched){
            if(Phaser.Input.Keyboard.JustDown(keySPACE)) {
                this.emitOnce(this.bigCrack);
            }
        }
    }
    emitOnce(emit) {
        emit.explode(4);
        emit.resume();
    }

}