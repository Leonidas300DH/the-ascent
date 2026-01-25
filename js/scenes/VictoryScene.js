class VictoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VictoryScene' });
    }

    init(data) {
        this.finalAltitude = data.altitude || LEVEL.SUMMIT_ALTITUDE;
        this.elapsedTime = data.time || 0;
        this.scoreSubmitted = false;
        this.playerName = '';
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Play victory sound
        this.sound.play('victory', { volume: 0.6 });

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
        const title = this.add.text(width / 2, 50, t('summitReached'), {
            fontFamily: 'monospace',
            fontSize: '32px',
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

        // Time display
        const timeStr = highScoreManager.formatTime(this.elapsedTime);
        const timeText = this.add.text(width / 2, 100, `⏱️ ${t('time')}: ${timeStr}`, {
            fontFamily: 'monospace',
            fontSize: '24px',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 3
        });
        timeText.setOrigin(0.5);

        // Check if it's a high score
        const isHighScore = highScoreManager.isHighScore(this.elapsedTime);

        if (isHighScore && !this.scoreSubmitted) {
            this.createHighScoreEntry(width, height);
        } else {
            this.createScoreBoard(width, height);
            this.createPlayAgainPrompt(width, height);
        }

        // Victory particles
        this.add.particles(width / 2, -10, 'particle', {
            speed: { min: 50, max: 200 },
            angle: { min: 80, max: 100 },
            scale: { start: 0.8, end: 0 },
            lifespan: 3000,
            tint: [0xFFD700, 0xFFFFFF, 0x87CEEB],
            frequency: 100
        });
    }

    createHighScoreEntry(width, height) {
        // New high score notification
        const hsTitle = this.add.text(width / 2, 150, t('newHighScore'), {
            fontFamily: 'monospace',
            fontSize: '28px',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 4
        });
        hsTitle.setOrigin(0.5);

        // Blink effect
        this.tweens.add({
            targets: hsTitle,
            alpha: 0.5,
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        // Name input label
        const nameLabel = this.add.text(width / 2, 200, t('enterName'), {
            fontFamily: 'monospace',
            fontSize: '18px',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 2
        });
        nameLabel.setOrigin(0.5);

        // Input field background
        const inputBg = this.add.graphics();
        inputBg.fillStyle(0x1a1a2e, 0.9);
        inputBg.fillRoundedRect(width / 2 - 120, 220, 240, 40, 8);
        inputBg.lineStyle(2, 0xFFD700);
        inputBg.strokeRoundedRect(width / 2 - 120, 220, 240, 40, 8);

        // Name text display
        this.nameDisplay = this.add.text(width / 2, 240, '_', {
            fontFamily: 'monospace',
            fontSize: '20px',
            color: '#FFFFFF'
        });
        this.nameDisplay.setOrigin(0.5);

        // Cursor blink
        this.time.addEvent({
            delay: 500,
            loop: true,
            callback: () => {
                if (!this.scoreSubmitted) {
                    const cursor = this.playerName.length < 10 ? '_' : '';
                    this.nameDisplay.setText(this.playerName + cursor);
                }
            }
        });

        // Submit button
        const submitBtn = this.add.text(width / 2, 290, `[ ${t('submit')} ]`, {
            fontFamily: 'monospace',
            fontSize: '20px',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 3
        });
        submitBtn.setOrigin(0.5);
        submitBtn.setInteractive({ useHandCursor: true });

        submitBtn.on('pointerover', () => submitBtn.setColor('#FFFFFF'));
        submitBtn.on('pointerout', () => submitBtn.setColor('#FFD700'));
        submitBtn.on('pointerdown', () => this.submitScore(width, height));

        // Keyboard input for name
        this.input.keyboard.on('keydown', (event) => {
            if (this.scoreSubmitted) return;

            if (event.key === 'Enter') {
                this.submitScore(width, height);
            } else if (event.key === 'Backspace') {
                this.playerName = this.playerName.slice(0, -1);
                this.nameDisplay.setText(this.playerName + '_');
            } else if (event.key.length === 1 && this.playerName.length < 10) {
                // Accept alphanumeric characters
                if (/^[a-zA-Z0-9]$/.test(event.key)) {
                    this.playerName += event.key.toUpperCase();
                    this.nameDisplay.setText(this.playerName + '_');
                }
            }
        });

        // Show existing scores below
        this.createScoreBoard(width, height, 330);
    }

    submitScore(width, height) {
        if (this.scoreSubmitted) return;
        this.scoreSubmitted = true;

        // Add score
        const rank = highScoreManager.addScore(this.playerName || 'Anonyme', this.elapsedTime);

        // Refresh the scene to show updated scoreboard
        this.scene.restart({ altitude: this.finalAltitude, time: this.elapsedTime });
    }

    createScoreBoard(width, height, startY = 180) {
        // High Scores title
        const hsTitle = this.add.text(width / 2, startY, t('highScores'), {
            fontFamily: 'monospace',
            fontSize: '22px',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 3
        });
        hsTitle.setOrigin(0.5);

        const scores = highScoreManager.getScores();

        if (scores.length === 0) {
            const noScores = this.add.text(width / 2, startY + 40, t('noScores'), {
                fontFamily: 'monospace',
                fontSize: '16px',
                color: '#888888'
            });
            noScores.setOrigin(0.5);
        } else {
            // Score list
            const listStartY = startY + 35;
            const lineHeight = 28;

            // Header
            const header = this.add.text(width / 2 - 80, listStartY, `${t('rank')}   ${t('time')}   Nom`, {
                fontFamily: 'monospace',
                fontSize: '12px',
                color: '#888888'
            });

            scores.forEach((score, index) => {
                const y = listStartY + 20 + (index * lineHeight);
                const isCurrentScore = score.time === this.elapsedTime &&
                    this.scoreSubmitted;
                const color = isCurrentScore ? '#FFD700' : '#FFFFFF';
                const rankStr = String(index + 1).padStart(2, ' ');
                const timeStr = highScoreManager.formatTime(score.time);
                const nameStr = score.name.substring(0, 10);

                const scoreLine = this.add.text(width / 2 - 80, y,
                    `#${rankStr}   ${timeStr}   ${nameStr}`, {
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    color: color,
                    stroke: '#000000',
                    strokeThickness: 2
                });

                // Highlight new score
                if (isCurrentScore) {
                    this.tweens.add({
                        targets: scoreLine,
                        alpha: 0.6,
                        duration: 400,
                        yoyo: true,
                        repeat: 3
                    });
                }
            });
        }
    }

    createPlayAgainPrompt(width, height) {
        // Play again prompt
        const playAgain = this.add.text(width / 2, height - 50, t('pressSpacePlayAgain'), {
            fontFamily: 'monospace',
            fontSize: '16px',
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

        // Setup restart keys
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.canPlayAgain = true;

        // Pointer/touch restart
        this.input.on('pointerdown', () => {
            // Only restart if not entering name
            if (this.canPlayAgain && (this.scoreSubmitted || !highScoreManager.isHighScore(this.elapsedTime))) {
                this.restartGame();
            }
        });
    }

    update() {
        // Check for space key to restart (only if play again prompt is shown)
        if (this.spaceKey && this.canPlayAgain &&
            (this.scoreSubmitted || !highScoreManager.isHighScore(this.elapsedTime))) {
            if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
                this.restartGame();
            }
        }
    }

    restartGame() {
        this.canPlayAgain = false;
        this.scene.start('GameScene');
    }
}
