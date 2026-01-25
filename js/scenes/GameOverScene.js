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
        if (this.deathReason === 'fall') {
            this.sound.play('falling', { volume: 0.5 });
        } else {
            this.sound.play('game_over', { volume: 0.5 });
        }

        // Dark background
        this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a1a, 0.9);

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
            'avalanche': t('deathAvalanche')
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

        const timeText = this.add.text(width / 2, height / 2 - 20, `⏱️ ${t('time')}: ${timeStr}`, {
            fontFamily: 'monospace',
            fontSize: '22px',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 3
        });
        timeText.setOrigin(0.5);

        // Altitude reached
        const altText = this.add.text(width / 2, height / 2 + 20, `⛰️ ${t('altitude')}: ${this.finalAltitude}m`, {
            fontFamily: 'monospace',
            fontSize: '22px',
            color: '#87CEEB',
            stroke: '#000000',
            strokeThickness: 3
        });
        altText.setOrigin(0.5);

        // Progress toward summit
        const progress = Math.floor((this.finalAltitude / LEVEL.SUMMIT_ALTITUDE) * 100);
        const progressText = this.add.text(width / 2, height / 2 + 60, `(${progress}% ${t('ofSummit')})`, {
            fontFamily: 'monospace',
            fontSize: '16px',
            color: '#888888'
        });
        progressText.setOrigin(0.5);

        // Restart button (clickable)
        const restartBtn = this.add.text(width / 2, height * 0.75, '[ RETRY ]', {
            fontFamily: 'monospace',
            fontSize: '24px',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 4,
            backgroundColor: '#333333',
            padding: { x: 20, y: 10 }
        });
        restartBtn.setOrigin(0.5);
        restartBtn.setInteractive({ useHandCursor: true });
        restartBtn.on('pointerover', () => restartBtn.setColor('#FFFFFF'));
        restartBtn.on('pointerout', () => restartBtn.setColor('#FFD700'));
        restartBtn.on('pointerdown', () => this.restartGame());

        // Restart prompt text
        const restartText = this.add.text(width / 2, height * 0.88, t('pressSpaceRetry'), {
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#888888'
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

        // Setup keyboard - using cursors for reliability
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey('SPACE');
        this.rKey = this.input.keyboard.addKey('R');

        this.hasRestarted = false;
    }

    update() {
        if (this.hasRestarted) return;

        // Check multiple ways for key press
        const spacePressed = this.spaceKey.isDown;
        const rPressed = this.rKey.isDown;
        const upPressed = this.cursors.up.isDown;

        if (spacePressed || rPressed || upPressed) {
            this.restartGame();
        }
    }

    restartGame() {
        if (this.hasRestarted) return;
        this.hasRestarted = true;
        this.scene.start('GameScene');
    }
}
