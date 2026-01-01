class SnowParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.emitter = null;
        this.currentIntensity = VISUALS.SNOW_BASE_RATE;
    }

    create() {
        // Create snow particle emitter
        this.emitter = this.scene.add.particles(0, 0, 'snowflake', {
            x: { min: -50, max: GAME_WIDTH + 50 },
            y: -50,
            lifespan: 3500,
            speedY: { min: 50, max: 150 },
            speedX: { min: -30, max: 30 },
            scale: { min: 0.3, max: 1.2 },
            alpha: { start: 0.9, end: 0.2 },
            frequency: 200,
            quantity: 1
        });

        this.emitter.setDepth(200);
    }

    update(cameraY, playerAltitude) {
        // Move emitter with camera
        this.emitter.particleY = cameraY - 50;

        // Intensity scales DRAMATICALLY with altitude
        const progress = Math.min(1, playerAltitude / LEVEL.SUMMIT_ALTITUDE);

        // Use exponential curve for more dramatic effect at higher altitudes
        const easedProgress = Math.pow(progress, 0.7); // Faster ramp-up

        // Very high max rate for intense blizzard at summit
        const maxRate = 400;
        const targetIntensity = Phaser.Math.Linear(
            VISUALS.SNOW_BASE_RATE,
            maxRate,
            easedProgress
        );

        // Smooth intensity transition
        this.currentIntensity = Phaser.Math.Linear(
            this.currentIntensity,
            targetIntensity,
            0.08
        );

        // Update frequency (lower = more particles)
        // Base: 300 (light), Summit: 5 (blizzard)
        const frequency = Math.max(5, 300 - this.currentIntensity * 0.75);
        this.emitter.frequency = frequency;

        // Increase quantity dramatically at higher altitudes
        // Base: 1, Summit: 10
        const quantity = Math.max(1, Math.floor(1 + easedProgress * 9));
        this.emitter.quantity = quantity;

        // Scale particles larger at summit for more visual impact
        const minScale = 0.3 + easedProgress * 0.3;
        const maxScale = 1.0 + easedProgress * 0.8;
        this.emitter.scaleX = { min: minScale, max: maxScale };
        this.emitter.scaleY = { min: minScale, max: maxScale };

        // Update wind effect
        let extraWind = 0;
        if (this.scene.windSystem) {
            extraWind = this.scene.windSystem.getForce();
        }

        // More horizontal chaos at altitude
        const altitudeWind = easedProgress * 120;

        this.emitter.speedX = {
            min: -50 - altitudeWind + extraWind,
            max: 50 + altitudeWind + extraWind
        };

        // Increase vertical speed significantly at altitude
        this.emitter.speedY = {
            min: 60 + easedProgress * 140,
            max: 180 + easedProgress * 220
        };

        // Reduce lifespan at altitude for more frantic feel
        this.emitter.lifespan = 3500 - easedProgress * 1500;
    }
}
