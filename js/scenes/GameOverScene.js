class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.finalAltitude = data.altitude || 0;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Dark background
        this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a1a, 0.9);

        // Game Over title
        const title = this.add.text(width / 2, height / 3, 'GAME OVER', {
            fontFamily: 'monospace',
            fontSize: '48px',
            color: '#E74C3C',
            stroke: '#000000',
            strokeThickness: 6
        });
        title.setOrigin(0.5);

        // Altitude reached
        const altText = this.add.text(width / 2, height / 2, `Altitude Reached: ${this.finalAltitude}m`, {
            fontFamily: 'monospace',
            fontSize: '24px',
            color: '#87CEEB',
            stroke: '#000000',
            strokeThickness: 3
        });
        altText.setOrigin(0.5);

        // Progress toward summit
        const progress = Math.floor((this.finalAltitude / LEVEL.SUMMIT_ALTITUDE) * 100);
        const progressText = this.add.text(width / 2, height / 2 + 40, `(${progress}% of summit)`, {
            fontFamily: 'monospace',
            fontSize: '16px',
            color: '#888888'
        });
        progressText.setOrigin(0.5);

        // Restart prompt
        const restartText = this.add.text(width / 2, height * 0.7, '[ Press SPACE to try again ]', {
            fontFamily: 'monospace',
            fontSize: '18px',
            color: '#FFFFFF'
        });
        restartText.setOrigin(0.5);

        // Blink effect
        this.tweens.add({
            targets: restartText,
            alpha: 0.3,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // Restart input
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('GameScene');
        });

        // Also allow clicking
        this.input.once('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}
