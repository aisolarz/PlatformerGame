class Win extends Phaser.Scene {

    constructor() {
        super("winScene");
    }

    create() {

        // SKY COLOR
        this.cameras.main.setBackgroundColor("#c1e3e8");

        // BACKGROUND
        this.background = this.add.tileSprite(
            0,
            0,
            800,
            200,
            "background",
            0
        );

        this.background.setOrigin(0, 0);

        this.background.setScale(4, 4);

        // NO SCROLL
        this.background.setScrollFactor(0);

        // GROUND COLOR FILL
        this.add.rectangle(
            400,
            500,
            800,
            300,
            0xd28b5c
        );

        // HAPPY PARTICLES
        this.add.particles(
            400,
            250,
            "kenny-particles",
            {
                frame: [
                    "star_01.png",
                    "star_05.png",
                    "spark_04.png",
                    "magic_03.png"
                ],

                lifespan: 3000,
                speed: 80,
                scale: { start: 0.1, end: 0 },
                quantity: 3,
                blendMode: "ADD"
            }
        );

        // PLAYER
        let player = this.add.sprite(
            400,
            280,
            "platformer_characters",
            4
        );

        player.setScale(4);

        // WIN TEXT
        this.add.text(
            400,
            140,
            "YOU WIN!",
            {
                fontSize: "64px",
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8
            }
        ).setOrigin(0.5);

        this.add.text(
            400,
            420,
            "PRESS R TO PLAY AGAIN",
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