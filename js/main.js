// Main game entry point
const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'game-container',
    pixelArt: true,
    antialias: false,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
            width: 400,
            height: 300
        },
        max: {
            width: 1600,
            height: 1200
        }
    },
    input: {
        activePointers: 3, // Support multiple touch points
        touch: {
            capture: true
        }
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // Gravity handled per-sprite
            debug: false
        }
    },
    scene: [BootScene, GameScene, GameOverScene, VictoryScene],
    audio: {
        disableWebAudio: false
    }
};

// Create game instance
const game = new Phaser.Game(config);
