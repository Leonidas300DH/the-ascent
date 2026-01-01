class WindSystem {
    constructor(scene) {
        this.scene = scene;
        this.currentWindForce = 0;
        this.isGusting = false;
        this.lastWindDirection = 0; // -1 left, 1 right, 0 none

        // Timer for next wind gust
        this.scheduleNextGust();
    }

    getAltitudeProgress() {
        if (!this.scene.player) return 0;
        const altitude = this.scene.player.getAltitude();
        return Math.min(1, altitude / LEVEL.SUMMIT_ALTITUDE);
    }

    scheduleNextGust() {
        // Altitude-based delay: shorter at higher altitudes
        const progress = this.getAltitudeProgress();

        // Base delay: 20-30s, Summit delay: 5-10s (min 5s enforced)
        const minDelay = Phaser.Math.Linear(20000, 5000, progress);
        const maxDelay = Phaser.Math.Linear(30000, 10000, progress);

        const delay = Math.max(5000, Phaser.Math.Between(minDelay, maxDelay));

        this.scene.time.delayedCall(delay, () => {
            this.triggerGust();
        });
    }

    triggerGust() {
        if (this.scene.isGameOver || this.scene.hasWon) return;

        this.isGusting = true;

        // Random direction (-1 left, 1 right)
        const direction = Math.random() > 0.5 ? 1 : -1;
        this.lastWindDirection = direction;

        // Wind force scales with altitude
        const progress = this.getAltitudeProgress();
        const baseForce = Phaser.Math.Linear(200, 400, progress);
        this.currentWindForce = direction * baseForce;

        const duration = Phaser.Math.Between(ENVIRONMENT.WIND.DURATION_MIN, ENVIRONMENT.WIND.DURATION_MAX);

        // Reset after duration
        this.scene.time.delayedCall(duration, () => {
            this.isGusting = false;
            this.currentWindForce = 0;
            this.scheduleNextGust();
        });
    }

    update() {
        // Expose wind force for other systems
    }

    getForce() {
        return this.currentWindForce;
    }

    getDirection() {
        return this.lastWindDirection;
    }
}
