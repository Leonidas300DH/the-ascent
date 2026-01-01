// Main game entry point
const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'game-container',
    pixelArt: true,
    antialias: false,
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

// Handle window resize
window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});
