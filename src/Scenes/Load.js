class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {

        this.load.setPath("./assets/");

        this.load.image("explosion0", "frame0000.png");
        this.load.image("explosion1", "frame0001.png");
        this.load.image("explosion2", "frame0002.png");
        this.load.image("explosion3", "frame0003.png");
        this.load.image("explosion4", "frame0004.png");
        this.load.image("explosion5", "frame0005.png");
        this.load.image("explosion6", "frame0006.png");
        this.load.image("explosion7", "frame0007.png");
        this.load.image("explosion8", "frame0008.png");

        this.load.image("spark0", "spark0000.png");
        this.load.image("spark1", "spark0001.png");
        this.load.image("spark2", "spark0002.png");
        this.load.image("spark3", "spark0003.png");
        this.load.image("spark4", "spark0004.png");
        this.load.image("spark5", "spark0005.png");
        this.load.image("spark6", "spark0006.png");
        this.load.image("spark7", "spark0007.png");
        this.load.image("spark8", "spark0008.png");
        this.load.image("spark9", "spark0009.png");
        this.load.image("spark10", "spark0010.png");
        this.load.image("spark11", "spark0011.png");
        this.load.image("spark12", "spark0012.png");
        this.load.image("spark13", "spark0013.png");

        // TILEMAP
        this.load.tilemapTiledJSON("Platformer", "Platformer.tmj");

        // TILESET IMAGE
        this.load.image("tilemap_tiles", "tilemap_packed.png");

        // TILESET AS SPRITESHEET (for gems/objects)
        this.load.spritesheet("tilemap_sheet", "tilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18,
        });

        // CHARACTER
        this.load.spritesheet("platformer_characters", "tilemap-characters_packed.png", {
            frameWidth: 24,
            frameHeight: 24,
        });

        //BACKGROUND
        this.load.spritesheet(
            "background",
            "tilemap-backgrounds_packed.png",
            {
                frameWidth: 64,
                frameHeight: 72
            }
        );

        // PARTICLES
        this.load.multiatlas("kenny-particles", "kenny-particles.json");

        // AUDIO
        this.load.audio(
            "backgroundMusic",
            "backgroundMusic.mp3"
        );

        this.load.audio(
            "hitSound",
            "jingles_HIT13.ogg"
        );
    }

    create() {

        // PLAYER ANIMS
        // WALK
        this.anims.create({
            key: "walk",
            frames: this.anims.generateFrameNumbers(
                "platformer_characters",
                {
                    start: 4,
                    end: 5
                }
            ),
            frameRate: 8,
            repeat: -1
        });

        // IDLE
        this.anims.create({
            key: "idle",
            frames: [
                {
                    key: "platformer_characters",
                    frame: 4
                }
            ]
        });

        // JUMP
        this.anims.create({
            key: "jump",
            frames: [
                {
                    key: "platformer_characters",
                    frame: 5
                }
            ]
        });

        // FLYING ENEMY
        this.anims.create({
            key: "flyEnemy",
            frames: this.anims.generateFrameNumbers(
                "platformer_characters",
                {
                    start: 18,
                    end: 20
                }
            ),
            frameRate: 6,
            repeat: -1
        });

        // WATER
        this.anims.create({
            key: "waterAnim",
            frames: [
                { key: "tilemap_sheet", frame: 53 },
                { key: "tilemap_sheet", frame: 33 }
            ],
            frameRate: 2,
            repeat: -1
        });

        // COIN
        this.anims.create({
            key: "coinAnim",
            frames: [
                { key: "tilemap_sheet", frame: 151 },
                { key: "tilemap_sheet", frame: 152 }
            ],
            frameRate: 6,
            repeat: -1
        });

        // HIT EFFECT
        this.anims.create({
            key: "puff",
            frames: [
                { key: "explosion0" },
                { key: "explosion1" },
                { key: "explosion2" },
                { key: "explosion3" },
                { key: "explosion4" },
                { key: "explosion5" },
                { key: "explosion6" },
                { key: "explosion7" },
                { key: "explosion8" },
            ],
            frameRate: 20,
            repeat: 0,
            hideOnComplete: true
        });

        // BAT ENEMY
        this.anims.create({
            key: "batEnemy",
            frames: this.anims.generateFrameNumbers(
                "platformer_characters",
                {
                    start: 24,
                    end: 26
                }
            ),
            frameRate: 8,
            repeat: -1
        });

        // GROUND ENEMY
        this.anims.create({
            key: "groundEnemy",
            frames: this.anims.generateFrameNumbers(
                "platformer_characters",
                {
                    start: 15,
                    end: 16
                }
            ),
            frameRate: 4,
            repeat: -1
        });

        this.scene.start("startScene");

    }
}