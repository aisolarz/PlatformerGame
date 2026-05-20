class Platformer extends Phaser.Scene {

    constructor() {
        super("platformerScene");
    }

    init() {

        this.ACCELERATION = 350;
        this.DRAG = 1200;
        this.physics.world.gravity.y = 1800;
        this.JUMP_VELOCITY = -500;
        this.SCALE = 1.2;

        this.jumps = 0;
        this.maxJumps = 2;
    }

    create() {


        // TILEMAP
        this.map = this.add.tilemap("Platformer");

        // TILESET
        this.tileset = this.map.addTilesetImage(
            "kenny_tilemap_packed",
            "tilemap_tiles"
        );

        // BLUE SKY
        this.cameras.main.setBackgroundColor("#c1e3e8");

        // BACKGROUND IMAGE
        this.background = this.add.tileSprite(
            0,
            0,
            this.map.widthInPixels,
            72,
            "background",
            0
        );

        this.background.setOrigin(0, 0);

        // make it taller
        this.background.setScale(4, 4);

        this.background.setScrollFactor(0);

        // LAYERS

        this.baseLayer = this.map.createLayer(
            "Base Level",
            this.tileset,
            0,
            0
        );

        this.characterLayer = this.map.createLayer(
            "characters",
            this.tileset,
            0,
            0
        );

        this.greeneryLayer = this.map.createLayer(
            "greenery",
            this.tileset,
            0,
            0
        );

        // WATER TIMER
        this.waterFrame = false;

        this.time.addEvent({
            delay: 500,
            loop: true,
            callback: () => {

                this.baseLayer.forEachTile(tile => {

                    if(tile.index === 53 || tile.index === 33) {

                        tile.index = this.waterFrame ? 53 : 33;
                    }
                });

                this.waterFrame = !this.waterFrame;
            }
        });

        // COLLISION
        
        this.baseLayer.setCollisionByProperty({
            collides: true
        });

        
        this.greeneryLayer.setCollisionByProperty({
            collides: true
        });
        
        // BACKGROUND MUSIC
        this.backgroundMusic = this.sound.get("backgroundMusic");

        if(!this.backgroundMusic) {

            this.backgroundMusic = this.sound.add(
                "backgroundMusic",
                {
                    volume: 0.3,
                    loop: true
                }
            );

            this.backgroundMusic.play();
        }
        else if(!this.backgroundMusic.isPlaying) {

            this.backgroundMusic.play();
        }

        // PLAYER
        my.sprite.player = this.physics.add.sprite(
            100,
            300,
            "platformer_characters",
            4
        );

        my.sprite.player.setCollideWorldBounds(true);

        
        //Starting spawn
        this.spawnX = 100;
        this.spawnY = 300;

        this.lastCheckpoint = null;

        // PLAYER COLLISION
        this.physics.add.collider(
            my.sprite.player,
            this.baseLayer
        );

        this.physics.add.collider(
            my.sprite.player,
            this.greeneryLayer
        );

        this.waterTiles = [];
        this.baseLayer.forEachTile(tile => {

            if(tile.index === 53) {

                this.waterTiles.push(tile);
            }
        });

        this.flagTiles = [];

        this.baseLayer.forEachTile(tile => {

            if(tile.index === 111 || tile.index === 131) {

                this.flagTiles.push(tile);
            }
        });

        // ENEMIES
        this.enemies = this.physics.add.group();


        // BULLETS
        this.bullets = this.physics.add.group();

        // COINS
        
        this.coins = this.map.createFromObjects("Objects", {
            name: "coins",
            key: "tilemap_sheet",
            frame: 151
        });

        this.physics.world.enable(
            this.coins,
            Phaser.Physics.Arcade.STATIC_BODY
        );

        this.coinsGroup = this.add.group(this.coins);

        this.coins.forEach(coin => {

            coin.anims.play("coinAnim");
        });

        // WIN GEM
        this.winGem = this.physics.add.staticSprite(
            133 * 18,
            25 * 18,
            "tilemap_sheet",
            67
        );

        this.winGem.setScale(1.5);

        this.physics.add.overlap(
            my.sprite.player,
            this.winGem,
            () => {

                this.scene.start("winScene");
            }
        );

        // SCORE
        this.score = 0;

        this.scoreText = this.add.text(80, 45, "Score: 0", {
            fontSize: "20px",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 4
        });

        this.scoreText.setScrollFactor(0);

        // COLLECT COINS
        this.physics.add.overlap(
        my.sprite.player,
        this.coinsGroup,
        (player, coins) => {

        
        // RANDOM SPARKLE
        let sparkFrame = Phaser.Math.Between(0, 13);

        let sparkle = this.add.particles(
            coins.x,
            coins.y,
            "spark" + sparkFrame,
            {
                lifespan: 400,

                speed: {
                    min: 20,
                    max: 60
                },

                scale: {
                    start: 1,
                    end: 0
                },

                quantity: 4,

                emitting: false
            }
        );

        sparkle.explode(4);

        sparkle.explode(5);

            // SOUND
            this.sound.play("hitSound", {
                volume: 0.2
            });

            // REMOVE COIN
            coins.destroy();

            // SCORE
            this.score += 10;

            this.scoreText.setText(
                "Score: " + this.score
            );
        }
    );
        

        // PARTICLES
        my.vfx.walking = this.add.particles(
            0,
            0,
            "kenny-particles",
            {
                frame: "circle_01.png",
                lifespan: 300,
                speed: 20,
                scale: { start: 0.08, end: 0 },
                quantity: 1
            }
        );

        my.vfx.walking.stop();

        this.physics.world.setBounds(
            0,
            0,
            this.map.widthInPixels,
            this.map.heightInPixels
        );

        // CAMERA
        this.cameras.main.setBounds(
            0,
            0,
            this.map.widthInPixels,
            this.map.heightInPixels
        );

        this.cameras.main.startFollow(
            my.sprite.player,
            true,
            0.1,
            0.1
        );

        this.cameras.main.setZoom(this.SCALE);

        // INPUT
        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey("R");

        //SHOOT BUTTON
        this.spaceKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );

        //BULLET HITS THE ENEMY
        this.physics.add.overlap(
            this.bullets,
            this.enemies,
            (bullet, enemy) => {

                this.sound.play("hitSound");

                // puff effect
                let puff = this.add.sprite(
                    enemy.x,
                    enemy.y,
                    "explosion0"
                );

                puff.anims.play("puff");

                bullet.destroy();

                enemy.disableBody(true, true);
            }
        );



        //PLAYER HEALTH
        this.health = 3;

        // HEARTS
        this.hearts = [];

        for(let i = 0; i < 3; i++) {

            let heart = this.add.image(
                620 + (i * 45),
                65,
                "tilemap_sheet",
                44
            );

            heart.setScrollFactor(0);

            heart.setScale(2);

            heart.setDepth(999);

            this.hearts.push(heart);
        }

        this.physics.add.overlap(
            my.sprite.player,
            this.enemies,
            (player, enemy) => {
                this.sound.play("hitSound");


                this.health--;
                this.cameras.main.shake(150, 0.01);

                // remove heart
                if(this.health >= 0) {

                    this.hearts[this.health].setFrame(46);
                }

                // respawn
                player.setPosition(
                    this.spawnX,
                    this.spawnY
                );

                // game over
                if(this.health <= 0) {

                    this.scene.start("gameOverScene");
                }
            }
        );

        
        // BAT ENEMIES
        this.bats = this.physics.add.group();

        let batPositions = [
            /*
            {x: 1450, y: 250},
            {x: 1600, y: 180},
            {x: 1750, y: 120},
            {x: 1900, y: 220}
            */
            {x: 1100, y: 220},
            {x: 1220, y: 170},
            {x: 1340, y: 260},
            {x: 1450, y: 250},
            {x: 1600, y: 180},
            {x: 1750, y: 120},
            {x: 1900, y: 220},
            {x: 2050, y: 170}
        ];

        batPositions.forEach(pos => {

            let bat = this.bats.create(
                pos.x,
                pos.y,
                "platformer_characters",
                24
            );

            bat.play("batEnemy");

            bat.body.allowGravity = false;

            bat.setVelocityX(100);

            bat.minX = pos.x - 80;
            bat.maxX = pos.x + 80;
        });

        // PLAYER HIT BY BATS
        this.physics.add.overlap(
            my.sprite.player,
            this.bats,
            (player, bat) => {

                this.sound.play("hitSound");

                this.health--;
                this.cameras.main.shake(150, 0.01);

                if(this.health >= 0) {

                    this.hearts[this.health].setFrame(46);
                }

                player.setPosition(
                    this.spawnX,
                    this.spawnY
                );

                player.setVelocity(0, 0);

                if(this.health <= 0) {

                    this.scene.start("gameOverScene");
                }
            }
        );

        // BULLETS HIT BATS
        this.physics.add.overlap(
            this.bullets,
            this.bats,
            (bullet, bat) => {

                this.sound.play("hitSound");

                bullet.destroy();

                let puff = this.add.sprite(
                    bat.x,
                    bat.y,
                    "explosion0"
                );

                puff.anims.play("puff");

                bat.destroy();
            }
        );
 
    

        // FINAL BOSS
        this.boss = this.physics.add.sprite(
            this.map.widthInPixels - 250,
            250,
            "platformer_characters",
            8
        );

        this.boss.setScale(2);

        this.boss.body.allowGravity = false;

        this.boss.health = 10;

        this.boss.minX = this.boss.x - 100;
        this.boss.maxX = this.boss.x + 100;

        this.boss.setVelocityX(100);

        // BOSS BULLETS
        this.bossBullets = this.physics.add.group();

        // BOSS SHOOT TIMER
        this.time.addEvent({
            delay: 1200,
            loop: true,
            callback: () => {

                if(!this.boss.active) return;

                // only shoot if near player
                if(
                    Math.abs(
                        my.sprite.player.x - this.boss.x
                    ) < 500
                ) {

                    let bullet = this.bossBullets.create(
                        this.boss.x,
                        this.boss.y,
                        "tilemap_sheet",
                        158
                    );

                    bullet.body.allowGravity = false;

                    bullet.setScale(0.8);

                    if(my.sprite.player.x < this.boss.x) {

                        bullet.setVelocityX(-350);
                    }
                    else {

                        bullet.setVelocityX(350);
                    }
                }
            }
        });

        this.physics.add.overlap(
            my.sprite.player,
            this.bossBullets,
            (player, bullet) => {

                this.sound.play("hitSound");

                bullet.destroy();

                this.health--;
                this.cameras.main.shake(150, 0.01);

                if(this.health >= 0) {

                    this.hearts[this.health].setFrame(46);
                }

                player.setPosition(
                    this.spawnX,
                    this.spawnY
                );

                player.setVelocity(0, 0);

                if(this.health <= 0) {

                    this.scene.restart();
                }
            }
        );

        this.physics.add.overlap(
            this.bullets,
            this.boss,
            (bullet, boss) => {

                this.sound.play("hitSound");

                bullet.destroy();

                boss.health--;

                let puff = this.add.sprite(
                    boss.x,
                    boss.y,
                    "explosion0"
                );

                puff.anims.play("puff");

                // BOSS DIES
                if(boss.health <= 0) {

                    this.cameras.main.flash(500, 255, 255, 255);

                    let bossText = this.add.text(
                        boss.x,
                        boss.y - 80,
                        "BOSS DEFEATED!",
                        {
                            fontSize: "32px",
                            color: "#ffea00",
                            stroke: "#000000",
                            strokeThickness: 6
                        }
                    ).setOrigin(0.5);

                    this.tweens.add({
                        targets: bossText,
                        alpha: 0,
                        y: bossText.y - 40,
                        duration: 1500,
                        onComplete: () => {
                            bossText.destroy();
                        }
                    });

                    boss.disableBody(true, true);

                    // BIG PUFF
                    let puff = this.add.sprite(
                        boss.x,
                        boss.y,
                        "explosion0"
                    );

                    puff.setScale(2);

                    puff.anims.play("puff");
                }
            }
        );

        this.eKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.E
        );

        // GROUND ENEMIES
        this.groundEnemies = this.physics.add.group();

        let ground1 = this.groundEnemies.create(
            1890,
            234,
            "platformer_characters",
            15
        );

        let ground2 = this.groundEnemies.create(
            1980,
            234,
            "platformer_characters",
            15
        );

        let ground3 = this.groundEnemies.create(
            2070,
            234,
            "platformer_characters",
            15
        );

        let grounds = [ground1, ground2, ground3];

        grounds.forEach(enemy => {

            enemy.play("groundEnemy");

            enemy.setCollideWorldBounds(true);

            enemy.setVelocityX(80);

            enemy.minX = 1890;
            enemy.maxX = 2106;
        });

        this.physics.add.collider(
            this.groundEnemies,
            this.baseLayer
        );

        this.physics.add.collider(
            this.groundEnemies,
            this.greeneryLayer
        );

        this.physics.add.overlap(
            my.sprite.player,
            this.groundEnemies,
            (player, enemy) => {

                this.sound.play("hitSound");

                this.health--;
                this.cameras.main.shake(150, 0.01);

                if(this.health >= 0) {

                    this.hearts[this.health].setFrame(46);
                }

                player.setPosition(
                    this.spawnX,
                    this.spawnY
                );

                player.setVelocity(0, 0);

                if(this.health <= 0) {

                    this.scene.restart();
                }
            }
        );

        this.physics.add.overlap(
            this.bullets,
            this.groundEnemies,
            (bullet, enemy) => {

                this.sound.play("hitSound");

                bullet.destroy();

                let puff = this.add.sprite(
                    enemy.x,
                    enemy.y,
                    "explosion0"
                );

                puff.anims.play("puff");

                enemy.disableBody(true, true);
            }
        );

        // CLOUD ENEMIES
        let cloudPositions = [
            {x: 620, y: 120},
            {x: 700, y: 180},
            {x: 780, y: 140},
            {x: 860, y: 200},
            {x: 940, y: 150}
        ];

        cloudPositions.forEach(pos => {

            let flyEnemy = this.enemies.create(
                pos.x,
                pos.y,
                "platformer_characters",
                18
            );

            flyEnemy.play("flyEnemy");

            flyEnemy.body.allowGravity = false;

            flyEnemy.setVelocityX(80);

            flyEnemy.minX = pos.x - 50;
            flyEnemy.maxX = pos.x + 50;
        });

    }

    update() {


        // LEFT
        if(cursors.left.isDown) {

            my.sprite.player.setAccelerationX(
                -this.ACCELERATION
            );

            my.sprite.player.setFlipX(false);

            my.sprite.player.anims.play("walk", true);

        }

        // RIGHT
        else if(cursors.right.isDown) {

            my.sprite.player.setAccelerationX(
                this.ACCELERATION
            );

            my.sprite.player.setFlipX(true);

            my.sprite.player.anims.play("walk", true);

        }

        // IDLE
        else {

            my.sprite.player.setAccelerationX(0);

            my.sprite.player.setDragX(this.DRAG);

            my.sprite.player.anims.play("idle");

        }

        // DOUBLE JUMP
        if(
            Phaser.Input.Keyboard.JustDown(cursors.up) &&
            this.jumps < this.maxJumps
        ) {

            my.sprite.player.setVelocityY(
                this.JUMP_VELOCITY
            );

            my.vfx.walking.emitParticleAt(
                my.sprite.player.x,
                my.sprite.player.y + 12,
                8
            );

            this.jumps++;
        }

        // JUMP ANIM
        if(!my.sprite.player.body.blocked.down) {

            my.sprite.player.anims.play("jump");

        }

        // RESTART
        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {

            this.scene.restart();

        }

        // WATER DEATH
        
        let playerTile = this.baseLayer.getTileAtWorldXY(
            my.sprite.player.x,
            my.sprite.player.y
        );

        if(
            playerTile &&
            playerTile.properties.kills
        ) {

            my.sprite.player.setPosition(
                this.spawnX,
                this.spawnY
            );

            my.sprite.player.setVelocity(0, 0);
        }

        
        /// CHECKPOINT FLAGS
        let flagTile = this.baseLayer.getTileAtWorldXY(
            my.sprite.player.x,
            my.sprite.player.y - 16
        );

        if(
            flagTile &&
            flagTile.properties.checkpoint &&
            this.lastCheckpoint !== flagTile
        ) {

            this.lastCheckpoint = flagTile;

            this.spawnX = flagTile.getCenterX();
            this.spawnY = flagTile.getCenterY() - 40;

            let checkpointText = this.add.text(
                my.sprite.player.x,
                my.sprite.player.y - 60,
                "Checkpoint!",
                {
                    fontSize: "24px",
                    color: "#00ff99",
                    stroke: "#000000",
                    strokeThickness: 5
                }
            );

            this.tweens.add({
                targets: checkpointText,
                alpha: 0,
                y: checkpointText.y - 40,
                duration: 1000,
                onComplete: () => {
                    checkpointText.destroy();
                }
            });
        }



        //JUMP
        if(my.sprite.player.body.blocked.down) {

            this.jumps = 0;
        }

        // PARALLAX BACKGROUND
        this.background.tilePositionX =
            this.cameras.main.scrollX * 0.2;


        

        // SHOOT
        if(Phaser.Input.Keyboard.JustDown(this.spaceKey)) {

            let bullet = this.bullets.create(
                my.sprite.player.x,
                my.sprite.player.y,
                "tilemap_sheet",
                158
            );

            bullet.body.allowGravity = false;

            bullet.setScale(0.6);

            // direction
            if(my.sprite.player.flipX) {

                bullet.setVelocityX(400);
            }
            else {

                bullet.setVelocityX(-400);
            }
        }

        // CLOUD ENEMIES
        this.enemies.children.iterate(enemy => {

            if(!enemy.active || !enemy.body) return;

            if(enemy.x >= enemy.maxX) {

                enemy.setVelocityX(-80);
                enemy.setFlipX(true);
            }

            if(enemy.x <= enemy.minX) {

                enemy.setVelocityX(80);
                enemy.setFlipX(false);
            }

            enemy.setVelocityY(
                Math.sin(this.time.now * 0.005) * 20
            );
        });





        // REMOVE PLAYER BULLETS
        this.bullets.children.iterate(bullet => {

            if(!bullet || !bullet.active) return;

            if(
                bullet.x < 0 ||
                bullet.x > this.map.widthInPixels
            ) {

                bullet.destroy();
            }
        });

        // BATS MOVEMENT
        this.bats.children.iterate(bat => {

            if(!bat.active || !bat.body) return;

            if(bat.x >= bat.maxX) {

                bat.setVelocityX(-100);
                bat.setFlipX(true);
            }

            if(bat.x <= bat.minX) {

                bat.setVelocityX(100);
                bat.setFlipX(false);
            }

            bat.setVelocityY(
                Math.sin(this.time.now * 0.004) * 30
            );
        });
        
        // GROUND ENEMY MOVEMENT
        this.groundEnemies.children.iterate(enemy => {

            if(!enemy || !enemy.active) return;

            if(enemy.x >= enemy.maxX) {

                enemy.setVelocityX(-80);

                enemy.setFlipX(true);
            }

            if(enemy.x <= enemy.minX) {

                enemy.setVelocityX(80);

                enemy.setFlipX(false);
            }
        });


        // BOSS MOVEMENT
        if(this.boss && this.boss.active) {

            if(this.boss.x >= this.boss.maxX) {

                this.boss.setVelocityX(-100);

                this.boss.setFlipX(true);
            }

            if(this.boss.x <= this.boss.minX) {

                this.boss.setVelocityX(100);

                this.boss.setFlipX(false);
            }
        }

    }
}