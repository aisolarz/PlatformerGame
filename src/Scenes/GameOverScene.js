class GameOver extends Phaser.Scene {

    constructor() {
        super("gameOverScene");
    }

    create() {

        // DARK RED BACKGROUND
        this.cameras.main.setBackgroundColor("#2b0000");

        // SMOKE PARTICLES
        this.add.particles(
            400,
            300,
            "kenny-particles",
            {
                frame: [
                    "smoke_01.png",
                    "smoke_03.png",
                    "smoke_05.png"
                ],

                lifespan: 5000,
                speedY: { min: -20, max: -80 },
                speedX: { min: -30, max: 30 },
                scale: { start: 0.2, end: 0 },
                quantity: 2
            }
        );

        // FIRE PARTICLES
        this.add.particles(
            400,
            500,
            "kenny-particles",
            {
                frame: [
                    "flame_01.png",
                    "flame_03.png",
                    "fire_01.png"
                ],

                lifespan: 1200,
                speedY: { min: -200, max: -350 },
                speedX: { min: -60, max: 60 },
                scale: { start: 0.12, end: 0 },
                quantity: 4,
                blendMode: "ADD"
            }
        );

        // BOSS
        let boss = this.add.sprite(
            550,
            300,
            "platformer_characters",
            8
        );

        boss.setScale(5);

        // DEAD PLAYER
        let player = this.add.sprite(
            250,
            350,
            "platformer_characters",
            4
        );

        player.setTint(0xff0000);

        player.setAngle(90);

        player.setScale(4);

        // EXPLOSION
        let boom = this.add.sprite(
            320,
            320,
            "explosion0"
        );

        boom.setScale(3);

        boom.anims.play("puff");

        // TEXT
        this.add.text(
            400,
            120,
            "GAME OVER",
            {
                fontSize: "64px",
                color: "#ff4444",
                stroke: "#000000",
                strokeThickness: 8
            }
        ).setOrigin(0.5);

        this.add.text(
            400,
            500,
            "PRESS R TO TRY AGAIN",
            {
                fontSize: "28px",
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 6
            }
        ).setOrigin(0.5);

        this.rKey = this.input.keyboard.addKey("R");
    }

    update() {

        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {

            this.scene.start("platformerScene");
        }
    }
}