class Spider extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, speed) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.moveSpeed = speed;
    }
    update() {
        this.y -= this.moveSpeed;
    }
}