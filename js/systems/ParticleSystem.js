class SnowParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.emitter = null;
        this.currentIntensity = VISUALS.SNOW_BASE_RATE;
    }

    create() {
        // Create snow particle emitter with base settings
        this.emitter = this.scene.add.particles(0, 0, 'snowflake', {
            x: { min: -50, max: GAME_WIDTH + 50 },
            y: -50,
            lifespan: 3500,
            speedY: { min: 50, max: 150 },
            speedX: { min: -30, max: 30 },
            scale: { min: 0.3, max: 1.2 },
            alpha: { start: 0.9, end: 0.3 },
            frequency: 150,
            quantity: 2
        });

        this.emitter.setDepth(200);
    }

    update(cameraY, playerAltitude) {
        if (!this.emitter) return;

        // Move emitter with camera - use setEmitZone or position
        this.emitter.setPosition(0, cameraY - 50);

        // Intensity scales with altitude
        const progress = Math.min(1, playerAltitude / LEVEL.SUMMIT_ALTITUDE);
        const easedProgress = Math.pow(progress, 0.6); // Faster ramp-up

        // Calculate wind
        let extraWind = 0;
        if (this.scene.windSystem) {
            extraWind = this.scene.windSystem.getForce();
        }
        const altitudeWind = easedProgress * 100;

        // Update emitter config - recreate ops for dynamic values
        // Frequency: lower = more particles (150 at base, 15 at summit)
        const newFrequency = Math.max(15, 150 - easedProgress * 135);

        // Quantity: more at altitude (2 at base, 8 at summit)
        const newQuantity = Math.max(2, Math.floor(2 + easedProgress * 6));

        // Speed: faster at altitude
        const speedYMin = 60 + easedProgress * 100;
        const speedYMax = 150 + easedProgress * 200;
        const speedXMin = -40 - altitudeWind + extraWind;
        const speedXMax = 40 + altitudeWind + extraWind;

        // Scale: larger at altitude
        const scaleMin = 0.3 + easedProgress * 0.3;
        const scaleMax = 1.0 + easedProgress * 0.6;

        // Lifespan: shorter at altitude
        const newLifespan = 3500 - easedProgress * 1000;

        // Apply updates using Phaser's proper API
        this.emitter.frequency = newFrequency;
        this.emitter.quantity.propertyValue = newQuantity;

        // For ops (ranges), we update the internal properties
        if (this.emitter.speedY) {
            this.emitter.speedY.propertyValue = { min: speedYMin, max: speedYMax };
        }
        if (this.emitter.speedX) {
            this.emitter.speedX.propertyValue = { min: speedXMin, max: speedXMax };
        }
        if (this.emitter.lifespan) {
            this.emitter.lifespan.propertyValue = newLifespan;
        }
    }
}
