class ColdSystem {
    constructor(scene) {
        this.scene = scene;

        // Track player movement
        this.lastPlayerX = 0;
        this.lastPlayerY = 0;
        this.idleTime = 0; // ms

        // State
        this.isChilling = false;
        this.isFrozen = false;
    }

    getAltitudeProgress() {
        if (!this.scene.player) return 0;
        const altitude = this.scene.player.getAltitude();
        return Math.min(1, altitude / LEVEL.SUMMIT_ALTITUDE);
    }

    getChillThreshold() {
        // Time before player starts chilling (n)
        // Base: 60s, Summit: 15s (min 10s)
        const progress = this.getAltitudeProgress();
        return Math.max(10000, Phaser.Math.Linear(60000, 15000, progress));
    }

    getFreezeThreshold() {
        // Time after chill before game over (p)
        // Base: 30s, Summit: 12s (min 10s)
        const progress = this.getAltitudeProgress();
        return Math.max(10000, Phaser.Math.Linear(30000, 12000, progress));
    }

    update(delta) {
        if (this.scene.isGameOver || this.scene.hasWon) return;
        if (!this.scene.player) return;

        const player = this.scene.player;
        const sprite = player.sprite;

        // Check if player has moved
        const moved = Math.abs(sprite.x - this.lastPlayerX) > 2 ||
            Math.abs(sprite.y - this.lastPlayerY) > 2;

        if (moved) {
            // Reset cold state
            this.idleTime = 0;
            this.isChilling = false;
            this.isFrozen = false;

            // Restore normal tint
            sprite.clearTint();

            this.lastPlayerX = sprite.x;
            this.lastPlayerY = sprite.y;
        } else {
            // Accumulate idle time
            this.idleTime += delta;

            const chillThreshold = this.getChillThreshold();
            const freezeThreshold = this.getFreezeThreshold();

            if (this.idleTime > chillThreshold) {
                this.isChilling = true;

                // Calculate chill progress (0-1)
                const chillProgress = Math.min(1, (this.idleTime - chillThreshold) / freezeThreshold);

                // Tint player blue based on chill progress
                const blue = Math.floor(0xFF * (1 - chillProgress * 0.5));
                const tint = Phaser.Display.Color.GetColor(blue, blue, 0xFF);
                sprite.setTint(tint);

                // Check freeze
                if (this.idleTime > chillThreshold + freezeThreshold) {
                    this.isFrozen = true;
                    this.scene.triggerGameOver('frozen');
                }
            }
        }
    }
}
