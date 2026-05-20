const config = {

    type: Phaser.AUTO,

    width: 800,
    height: 600,

    parent: "phaser-game",

    pixelArt: true,

    physics: {
        default: "arcade",

        arcade: {
            gravity: {
                y: 0
            },

            debug: false
        }
    },

    scene: [
        Load,
        Start,
        Platformer,
        Win,
        GameOver
    ]
};

const game = new Phaser.Game(config);

let cursors;

const my = {
    sprite: {},
    vfx: {}
};