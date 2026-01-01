class VictoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VictoryScene' });
    }

    init(data) {
        this.finalAltitude = data.altitude || LEVEL.SUMMIT_ALTITUDE;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Gradient night sky background
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x0a0a2a, 0x0a0a2a, 0x1a1a4a, 0x1a1a4a);
        bg.fillRect(0, 0, width, height);

        // Stars
        for (let i = 0; i < 50; i++) {
            const star = this.add.circle(
                Phaser.Math.Between(0, width),
                Phaser.Math.Between(0, height),
                Phaser.Math.Between(1, 3),
                0xFFFFFF
            );
            star.setAlpha(Math.random() * 0.5 + 0.5);

            this.tweens.add({
                targets: star,
                alpha: 0.3,
                duration: Phaser.Math.Between(500, 1500),
                yoyo: true,
                repeat: -1
            });
        }

        // Summit reached title
        const title = this.add.text(width / 2, height / 4, '⛰️ SUMMIT REACHED! ⛰️', {
            fontFamily: 'monospace',
            fontSize: '36px',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 6
        });
        title.setOrigin(0.5);

        // Glow effect on title
        this.tweens.add({
            targets: title,
            scale: 1.05,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        // Congratulations
        const congrats = this.add.text(width / 2, height / 2 - 30, 'Congratulations!', {
            fontFamily: 'monospace',
            fontSize: '28px',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 4
        });
        congrats.setOrigin(0.5);

        // Final altitude
        const altText = this.add.text(width / 2, height / 2 + 20, `Final Altitude: ${this.finalAltitude}m`, {
            fontFamily: 'monospace',
            fontSize: '20px',
            color: '#87CEEB',
            stroke: '#000000',
            strokeThickness: 3
        });
        altText.setOrigin(0.5);

        // Stats box
        const statsBox = this.add.graphics();
        statsBox.fillStyle(0x000000, 0.5);
        statsBox.fillRoundedRect(width / 2 - 150, height / 2 + 60, 300, 80, 8);

        const statsText = this.add.text(width / 2, height / 2 + 100,
            'You conquered the mountain!\nThe view from here is breathtaking.', {
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#AAAAAA',
            align: 'center'
        });
        statsText.setOrigin(0.5);

        // Play again prompt
        const playAgain = this.add.text(width / 2, height * 0.8, '[ Press SPACE to climb again ]', {
            fontFamily: 'monospace',
            fontSize: '18px',
            color: '#FFFFFF'
        });
        playAgain.setOrigin(0.5);

        // Blink effect
        this.tweens.add({
            targets: playAgain,
            alpha: 0.3,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // Restart input
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('GameScene');
        });

        this.input.once('pointerdown', () => {
            this.scene.start('GameScene');
        });

        // Victory particles
        const particles = this.add.particles(width / 2, -10, 'particle', {
            speed: { min: 50, max: 200 },
            angle: { min: 80, max: 100 },
            scale: { start: 0.8, end: 0 },
            lifespan: 3000,
            tint: [0xFFD700, 0xFFFFFF, 0x87CEEB],
            frequency: 100
        });
    }
}
