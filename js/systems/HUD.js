class HUD {
    constructor(scene) {
        this.scene = scene;
        this.container = null;
        this.altitudeBar = null;
        this.playerMarker = null;
        this.altitudeText = null;
        this.timerText = null;
        this.startTime = 0;
    }

    create() {
        // Record start time
        this.startTime = this.scene.time.now;
        // Fixed HUD container
        this.container = this.scene.add.container(0, 0);
        this.container.setScrollFactor(0);
        this.container.setDepth(500);

        // Altitude gauge background
        const gaugeX = 30;
        const gaugeY = 50;
        const gaugeWidth = 16;
        const gaugeHeight = GAME_HEIGHT - 100;

        // Background bar
        const bgBar = this.scene.add.graphics();
        bgBar.fillStyle(0x1a1a2e, 0.8);
        bgBar.fillRoundedRect(gaugeX - 4, gaugeY - 4, gaugeWidth + 8, gaugeHeight + 8, 4);
        this.container.add(bgBar);

        // Altitude bar (filled portion)
        this.altitudeBar = this.scene.add.graphics();
        this.container.add(this.altitudeBar);

        // Summit marker
        const summitMarker = this.scene.add.graphics();
        summitMarker.fillStyle(0xFFD700);
        summitMarker.fillRect(gaugeX - 2, gaugeY - 2, gaugeWidth + 4, 4);
        this.container.add(summitMarker);

        // Summit icon
        const summitIcon = this.scene.add.sprite(gaugeX + gaugeWidth / 2, gaugeY - 15, 'flag_icon');
        summitIcon.setScale(0.8);
        this.container.add(summitIcon);

        // Player position marker
        this.playerMarker = this.scene.add.graphics();
        this.container.add(this.playerMarker);

        // Altitude text
        this.altitudeText = this.scene.add.text(gaugeX + gaugeWidth + 10, GAME_HEIGHT - 60, '0m', {
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 3
        });
        this.container.add(this.altitudeText);

        // Summit label
        const summitLabel = this.scene.add.text(gaugeX + gaugeWidth + 10, gaugeY - 5, 'SUMMIT', {
            fontFamily: 'monospace',
            fontSize: '10px',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.container.add(summitLabel);

        this.gaugeConfig = { x: gaugeX, y: gaugeY, width: gaugeWidth, height: gaugeHeight };

        // Timer display (top right)
        this.timerText = this.scene.add.text(GAME_WIDTH - 20, 20, '00:00', {
            fontFamily: 'monospace',
            fontSize: '24px',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 4
        });
        this.timerText.setOrigin(1, 0);
        this.container.add(this.timerText);
    }

    update(playerAltitude) {
        const { x, y, width, height } = this.gaugeConfig;

        // Calculate fill amount
        const progress = Math.min(1, playerAltitude / LEVEL.SUMMIT_ALTITUDE);
        const fillHeight = height * progress;

        // Gradient color based on altitude
        const colorProgress = progress;
        const r = Math.floor(Phaser.Math.Linear(100, 255, colorProgress));
        const g = Math.floor(Phaser.Math.Linear(180, 200, colorProgress));
        const b = Math.floor(Phaser.Math.Linear(255, 100, colorProgress));
        const fillColor = Phaser.Display.Color.GetColor(r, g, b);

        // Draw altitude bar
        this.altitudeBar.clear();
        this.altitudeBar.fillStyle(fillColor, 0.9);
        this.altitudeBar.fillRect(x, y + height - fillHeight, width, fillHeight);

        // Draw player marker
        const markerY = y + height - fillHeight;
        this.playerMarker.clear();
        this.playerMarker.fillStyle(0xFFFFFF);
        this.playerMarker.fillTriangle(
            x + width + 5, markerY,
            x + width + 15, markerY - 5,
            x + width + 15, markerY + 5
        );

        // Update altitude text
        const displayAltitude = Math.floor(playerAltitude);
        this.altitudeText.setText(`${displayAltitude}m`);
        this.altitudeText.y = Math.max(y + 20, Math.min(GAME_HEIGHT - 60, markerY - 7));

        // Update timer
        const elapsed = this.scene.time.now - this.startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        this.timerText.setText(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    }

    getElapsedTime() {
        return this.scene.time.now - this.startTime;
    }

    formatTime(ms) {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}
