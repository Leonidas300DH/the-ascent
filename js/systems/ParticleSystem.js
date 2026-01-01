class SnowParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.emitters = [];
    }

    create() {
        // Create multiple emitters for different intensity levels
        // This ensures we can show more particles at higher altitudes

        // Base emitter - always active (light snow)
        const baseEmitter = this.scene.add.particles(0, 0, 'snowflake', {
            x: { min: -50, max: GAME_WIDTH + 50 },
            y: -50,
            lifespan: 4000,
            speedY: { min: 40, max: 120 },
            speedX: { min: -20, max: 20 },
            scale: { min: 0.3, max: 0.8 },
            alpha: { start: 0.7, end: 0.1 },
            frequency: 120,
            quantity: 1
        });
        baseEmitter.setDepth(200);
        this.emitters.push({ emitter: baseEmitter, minAltitude: 0 });

        // Medium emitter - activates at 25% altitude
        const mediumEmitter = this.scene.add.particles(0, 0, 'snowflake', {
            x: { min: -50, max: GAME_WIDTH + 50 },
            y: -50,
            lifespan: 3500,
            speedY: { min: 60, max: 160 },
            speedX: { min: -40, max: 40 },
            scale: { min: 0.4, max: 1.0 },
            alpha: { start: 0.8, end: 0.2 },
            frequency: -1, // Start disabled
            quantity: 2
        });
        mediumEmitter.setDepth(201);
        this.emitters.push({ emitter: mediumEmitter, minAltitude: 0.25 });

        // Heavy emitter - activates at 50% altitude
        const heavyEmitter = this.scene.add.particles(0, 0, 'snowflake', {
            x: { min: -50, max: GAME_WIDTH + 50 },
            y: -50,
            lifespan: 3000,
            speedY: { min: 80, max: 200 },
            speedX: { min: -60, max: 60 },
            scale: { min: 0.5, max: 1.2 },
            alpha: { start: 0.9, end: 0.3 },
            frequency: -1,
            quantity: 3
        });
        heavyEmitter.setDepth(202);
        this.emitters.push({ emitter: heavyEmitter, minAltitude: 0.5 });

        // Blizzard emitter - activates at 75% altitude
        const blizzardEmitter = this.scene.add.particles(0, 0, 'snowflake', {
            x: { min: -100, max: GAME_WIDTH + 100 },
            y: -50,
            lifespan: 2500,
            speedY: { min: 120, max: 280 },
            speedX: { min: -100, max: 100 },
            scale: { min: 0.6, max: 1.5 },
            alpha: { start: 1, end: 0.4 },
            frequency: -1,
            quantity: 4
        });
        blizzardEmitter.setDepth(203);
        this.emitters.push({ emitter: blizzardEmitter, minAltitude: 0.75 });
    }

    update(cameraY, playerAltitude) {
        const progress = Math.min(1, playerAltitude / LEVEL.SUMMIT_ALTITUDE);

        // Wind effect
        let windForce = 0;
        if (this.scene.windSystem) {
            windForce = this.scene.windSystem.getForce();
        }

        // Update each emitter based on altitude
        this.emitters.forEach(({ emitter, minAltitude }) => {
            // Move with camera
            emitter.particleY = cameraY - 50;

            // Enable/disable based on altitude threshold
            if (progress >= minAltitude) {
                // Calculate intensity within this tier (0-1)
                const tierProgress = Math.min(1, (progress - minAltitude) / 0.25);

                // Start slow, get faster as we go higher in this tier
                const baseFreq = minAltitude === 0 ? 120 : 80;
                const frequency = Math.max(20, baseFreq - tierProgress * 40);
                emitter.frequency = frequency;
            } else {
                emitter.frequency = -1; // Disabled
            }

            // Apply wind to X speed
            if (emitter.speedX) {
                const baseX = emitter.speedX.max || 50;
                emitter.speedX = {
                    min: -baseX + windForce,
                    max: baseX + windForce
                };
            }
        });
    }
}
