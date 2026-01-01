class AvalancheSystem {
    constructor(scene) {
        this.scene = scene;
        this.state = 'IDLE'; // IDLE, WARNING, ACTIVE
        this.warningTimer = 0;
        this.activeTimer = 0;
        this.safetyCheckDelay = 1000; // Delay before checking safety (ms into active phase)
        this.safetyCheckStartTime = 0;

        // Particles
        this.createParticles();

        // Schedule first avalanche
        this.scheduleNextAvalanche();
    }

    createParticles() {
        // Warning powder (fine mist)
        this.powderEmitter = this.scene.add.particles(0, 0, 'snowflake', {
            x: { min: 0, max: GAME_WIDTH },
            y: -50,
            lifespan: 2000,
            speedY: { min: 200, max: 400 },
            speedX: { min: -50, max: 50 },
            scale: { start: 0.6, end: 0.2 },
            alpha: { start: 0.8, end: 0.3 },
            quantity: 0,
            tint: 0xFFFFFF,
            blendMode: 'ADD'
        });

        // Active avalanche (INTENSE snow, not debris)
        this.snowstormEmitter = this.scene.add.particles(0, 0, 'snowflake', {
            x: { min: -100, max: GAME_WIDTH + 100 },
            y: -100,
            lifespan: 1200,
            speedY: { min: 500, max: 800 },
            speedX: { min: -100, max: 100 },
            scale: { min: 0.5, max: 1.5 },
            alpha: { start: 1, end: 0.5 },
            rotate: { min: 0, max: 360 },
            quantity: 0,
            tint: 0xFFFFFF
        });

        this.powderEmitter.setDepth(200);
        this.snowstormEmitter.setDepth(201);
    }

    getAltitudeProgress() {
        if (!this.scene.player) return 0;
        const altitude = this.scene.player.getAltitude();
        return Math.min(1, altitude / LEVEL.SUMMIT_ALTITUDE);
    }

    scheduleNextAvalanche() {
        // Altitude-based delay: shorter at higher altitudes
        const progress = this.getAltitudeProgress();

        // Base delay: 45-60s, Summit delay: 8-15s (min 5s enforced)
        const minDelay = Phaser.Math.Linear(45000, 8000, progress);
        const maxDelay = Phaser.Math.Linear(60000, 15000, progress);

        const delay = Math.max(5000, Phaser.Math.Between(minDelay, maxDelay));

        this.scene.time.delayedCall(delay, () => {
            this.startWarning();
        });
    }

    startWarning() {
        if (this.scene.isGameOver || this.scene.hasWon) return;

        this.state = 'WARNING';
        this.warningTimer = this.scene.time.now + ENVIRONMENT.AVALANCHE.WARNING_DURATION;

        // Visuals - light powder snow
        this.powderEmitter.setQuantity(5);
        this.scene.cameras.main.shake(ENVIRONMENT.AVALANCHE.WARNING_DURATION, 0.008);
    }

    startActive() {
        this.state = 'ACTIVE';
        this.activeTimer = this.scene.time.now + ENVIRONMENT.AVALANCHE.ACTIVE_DURATION;
        this.safetyCheckStartTime = this.scene.time.now + this.safetyCheckDelay;

        // Visuals - INTENSE snowstorm
        this.powderEmitter.setQuantity(0);
        this.snowstormEmitter.setQuantity(40); // Heavy snow particles
        this.scene.cameras.main.shake(ENVIRONMENT.AVALANCHE.ACTIVE_DURATION, 0.025);
    }

    stopAvalanche() {
        this.state = 'IDLE';

        // Reset particles
        this.powderEmitter.setQuantity(0);
        this.snowstormEmitter.setQuantity(0);

        // Schedule next
        this.scheduleNextAvalanche();
    }

    update() {
        if (this.scene.isGameOver) {
            if (this.state !== 'IDLE') this.stopAvalanche();
            return;
        }

        // Update emitters to follow camera
        const cameraY = this.scene.cameras.main.scrollY;
        this.powderEmitter.setPosition(0, cameraY - 50);
        this.snowstormEmitter.setPosition(0, cameraY - 100);

        // State Logic
        if (this.state === 'WARNING') {
            if (this.scene.time.now > this.warningTimer) {
                this.startActive();
            }
        } else if (this.state === 'ACTIVE') {
            if (this.scene.time.now > this.activeTimer) {
                this.stopAvalanche();
            } else if (this.scene.time.now > this.safetyCheckStartTime) {
                // Only check safety after delay (let animation play first)
                this.checkPlayerSafety();
            }
        }
    }

    checkPlayerSafety() {
        const player = this.scene.player.sprite;
        const playerTop = player.y - player.body.height / 2;

        let sheltered = false;

        const platforms = this.scene.levelGenerator.platforms;

        for (const platform of platforms) {
            if (!platform.isActive()) continue;

            const pSprite = platform.sprite;
            if (pSprite.y < playerTop) {
                const pLeft = pSprite.x - pSprite.width / 2;
                const pRight = pSprite.x + pSprite.width / 2;
                const playerLeft = player.x - player.body.width / 2;
                const playerRight = player.x + player.body.width / 2;

                if (playerLeft > pLeft && playerRight < pRight) {
                    if (Math.abs(pSprite.y - playerTop) < 150) {
                        sheltered = true;
                        break;
                    }
                }
            }
        }

        if (!sheltered) {
            this.scene.triggerGameOver('avalanche');
        }
    }
}
