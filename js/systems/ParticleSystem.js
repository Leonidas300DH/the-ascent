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
            lifespan: 4000,
            speedY: { min: 50, max: 150 },
            speedX: { min: -30, max: 30 },
            scale: { min: 0.3, max: 1.2 },
            alpha: { start: 0.9, end: 0.2 },
            frequency: 200,
            quantity: 2
        });

        this.emitter.setDepth(200);
    }

    update(cameraY, playerAltitude) {
        // Move emitter with camera
        this.emitter.particleY = cameraY - 50;

        // Intensity scales SIGNIFICANTLY with altitude
        const progress = Math.min(1, playerAltitude / LEVEL.SUMMIT_ALTITUDE);

        // Much higher max rate for visible blizzard effect
        const maxRate = 250; // Increased from 80
        const targetIntensity = Phaser.Math.Linear(
            VISUALS.SNOW_BASE_RATE,
            maxRate,
            progress
        );

        // Smooth intensity transition
        this.currentIntensity = Phaser.Math.Linear(
            this.currentIntensity,
            targetIntensity,
            0.05
        );

        // Update frequency (lower = more particles)
        // At summit: frequency ~10 (very dense)
        const frequency = Math.max(10, 250 - this.currentIntensity);
        this.emitter.frequency = frequency;

        // Increase quantity at higher altitudes
        const quantity = Math.max(1, Math.floor(progress * 5));
        this.emitter.quantity = quantity;

        // Update wind effect
        let extraWind = 0;
        if (this.scene.windSystem) {
            extraWind = this.scene.windSystem.getForce();
        }

        const altitudeWind = progress * 80;

        this.emitter.speedX = {
            min: -40 - altitudeWind + extraWind,
            max: 40 + altitudeWind + extraWind
        };

        // Increase vertical speed at altitude
        this.emitter.speedY = {
            min: 60 + progress * 80,
            max: 180 + progress * 150
        };
    }
}
