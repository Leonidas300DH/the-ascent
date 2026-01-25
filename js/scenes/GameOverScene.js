class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.finalAltitude = data.altitude || 0;
        this.elapsedTime = data.time || 0;
        this.deathReason = data.reason || 'fall';
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Play appropriate sound based on death reason
        try {
            if (this.deathReason === 'fall') {
                this.sound.play('falling', { volume: 0.5 });
            } else {
                this.sound.play('game_over', { volume: 0.5 });
            }
        } catch (e) {
            console.log('Sound error:', e);
        }

        // Dark background - make it interactive for clicking anywhere
        const bg = this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a1a, 0.95);
        bg.setInteractive();

        // Game Over title
        const title = this.add.text(width / 2, height / 4, t('gameOver'), {
            fontFamily: 'monospace',
            fontSize: '48px',
            color: '#E74C3C',
            stroke: '#000000',
            strokeThickness: 6
        });
        title.setOrigin(0.5);

        // Death cause
        const causeMessages = {
            'fall': t('deathFall'),
            'frozen': t('deathFrozen'),
            'avalanche': t('deathAvalanche'),
            'enemy': 'Hit by enemy!'
        };
        const causeText = this.add.text(width / 2, height / 3 + 20, causeMessages[this.deathReason] || causeMessages['fall'], {
            fontFamily: 'monospace',
            fontSize: '20px',
            color: '#FF6B6B',
            stroke: '#000000',
            strokeThickness: 3
        });
        causeText.setOrigin(0.5);

        // Time
        const minutes = Math.floor(this.elapsedTime / 60000);
        const seconds = Math.floor((this.elapsedTime % 60000) / 1000);
        const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        const timeText = this.add.text(width / 2, height / 2 - 20, `Time: ${timeStr}`, {
            fontFamily: 'monospace',
            fontSize: '22px',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 3
        });
        timeText.setOrigin(0.5);

        // Altitude reached
        const altText = this.add.text(width / 2, height / 2 + 20, `Altitude: ${this.finalAltitude}m`, {
            fontFamily: 'monospace',
            fontSize: '22px',
            color: '#87CEEB',
            stroke: '#000000',
            strokeThickness: 3
        });
        altText.setOrigin(0.5);

        // Progress toward summit
        const progress = Math.floor((this.finalAltitude / LEVEL.SUMMIT_ALTITUDE) * 100);
        const progressText = this.add.text(width / 2, height / 2 + 60, `(${progress}% of summit)`, {
            fontFamily: 'monospace',
            fontSize: '16px',
            color: '#888888'
        });
        progressText.setOrigin(0.5);

        // Big clickable RETRY button
        const retryBtn = this.add.rectangle(width / 2, height * 0.75, 200, 60, 0x27ae60);
        retryBtn.setInteractive({ useHandCursor: true });

        const retryText = this.add.text(width / 2, height * 0.75, 'RETRY', {
            fontFamily: 'monospace',
            fontSize: '28px',
            color: '#FFFFFF',
            fontStyle: 'bold'
        });
        retryText.setOrigin(0.5);

        // Button hover effect
        retryBtn.on('pointerover', () => {
            retryBtn.setFillStyle(0x2ecc71);
        });
        retryBtn.on('pointerout', () => {
            retryBtn.setFillStyle(0x27ae60);
        });

        // RESTART GAME - multiple methods
        const restartGame = () => {
            this.scene.start('GameScene');
        };

        // Method 1: Click the button
        retryBtn.on('pointerdown', restartGame);
        retryText.setInteractive();
        retryText.on('pointerdown', restartGame);

        // Method 2: Click anywhere after 1 second
        this.time.delayedCall(1000, () => {
            bg.on('pointerdown', restartGame);
        });

        // Method 3: Any key press
        this.input.keyboard.on('keydown', restartGame);

        // Tap/click anywhere hint
        const hintText = this.add.text(width / 2, height * 0.9, 'Click anywhere or press any key', {
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#666666'
        });
        hintText.setOrigin(0.5);

        // Blink hint
        this.tweens.add({
            targets: hintText,
            alpha: 0.3,
            duration: 800,
            yoyo: true,
            repeat: -1
        });
    }
}
