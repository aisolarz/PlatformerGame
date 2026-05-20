class Start extends Phaser.Scene {

    constructor() {
        super("startScene");
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

        // MAGIC PARTICLES
        this.add.particles(
            400,
            300,
            "kenny-particles",
            {
                frame: [
                    "star_01.png",
                    "star_02.png",
                    "spark_03.png",
                    "magic_01.png"
                ],

                lifespan: 4000,
                speedY: { min: -30, max: -80 },
                speedX: { min: -20, max: 20 },
                scale: { start: 0.08, end: 0 },
                quantity: 2,
                blendMode: "ADD"
            }
        );

        // PLAYER
        let player = this.add.sprite(
            400,
            260,
            "platformer_characters",
            4
        );

        player.setScale(4);

        // TITLE
        this.add.text(
            400,
            120,
            "PINK ADVENTURE",
            {
                fontSize: "48px",
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8
            }
        ).setOrigin(0.5);

        

        // START TEXT
        this.add.text(
            400,
            420,
            "PRESS SPACE TO START",
            {
                fontSize: "28px",
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 6
            }
        ).setOrigin(0.5);

        // CONTROLS
        this.add.text(
            400,
            500,
            "Arrow Keys = Move   |   SPACE = Shoot",
            {
                fontSize: "20px",
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 4
            }
        ).setOrigin(0.5);

        this.spaceKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );
    }

    update() {

        if(Phaser.Input.Keyboard.JustDown(this.spaceKey)) {

            this.scene.start("platformerScene");
        }
    }
}