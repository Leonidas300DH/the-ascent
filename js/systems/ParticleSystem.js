class SnowParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.emitter = null;
    }

    create() {
        // Create snow particle emitter
        this.emitter = this.scene.add.particles(0, 0, 'snowflake', {
            x: { min: -50, max: GAME_WIDTH + 50 },
            y: -50,
            lifespan: 4000,
            speedY: { min: 50, max: 150 },
            speedX: { min: -30, max: 30 },
            scale: { min: 0.3, max: 1.0 },
            alpha: { start: 0.8, end: 0.2 },
            frequency: 100,
            quantity: 2
        });

        this.emitter.setDepth(200);
    }

    update(cameraY, playerAltitude) {
        if (!this.emitter) return;

        // Move emitter Y position with camera
        this.emitter.particleY = cameraY - 50;

        // Calculate altitude progress
        const progress = Math.min(1, playerAltitude / LEVEL.SUMMIT_ALTITUDE);

        // Update frequency based on altitude (lower = more particles)
        // Base: 100ms, Summit: 15ms
        const frequency = Math.max(15, 100 - progress * 85);
        this.emitter.frequency = frequency;

        // Wind effect
        let windForce = 0;
        if (this.scene.windSystem) {
            windForce = this.scene.windSystem.getForce();
        }

        // Update particle X speed range based on altitude and wind
        const baseSpeedX = 30 + progress * 50;
        this.emitter.speedX = {
            min: -baseSpeedX + windForce,
            max: baseSpeedX + windForce
        };

        // Faster falling at altitude
        this.emitter.speedY = {
            min: 50 + progress * 80,
            max: 150 + progress * 150
        };
    }
}
