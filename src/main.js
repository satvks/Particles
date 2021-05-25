let config = {
    type: Phaser.AUTO,
    height: 720,
    width: 1180,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [ Play ]
}
let game =  new Phaser.Game(config);

let eggHatched;
let keySPACE;