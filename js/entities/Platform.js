class Platform {
    constructor(scene, x, y, width, type = 'rock') {
        this.scene = scene;
        this.type = type;
        this.width = width;
        this.isDestroyed = false;
        this.crumbleTimer = null;
        this.shaking = false;

        const textureKey = `platform_${type}`;

        // Use TileSprite for proper texture repeating instead of stretching
        // Height is 24 based on new texture generation from BootScene
        this.sprite = scene.add.tileSprite(x, y, width, 24, textureKey);

        // Enable physics for the TileSprite
        scene.physics.add.existing(this.sprite, true); // true = static body

        // Store reference to this platform object
        this.sprite.platformRef = this;

        // Set depth
        this.sprite.setDepth(50);
    }

    onPlayerContact(player) {
        if (this.isDestroyed) return;

        switch (this.type) {
            case 'ice':
                player.setOnIce(true);
                break;
            case 'crumbling':
                if (!this.crumbleTimer) {
                    this.startCrumble();
                }
                break;
        }
    }

    startCrumble() {
        if (this.crumbleTimer) return;

        this.shaking = true;

        // Shake effect
        this.scene.tweens.add({
            targets: this.sprite,
            x: this.sprite.x + 2,
            duration: 50,
            yoyo: true,
            repeat: -1
        });

        // Play crumble sound
        this.scene.sound.play('crumble', { volume: 0.4 });

        // Set destruction timer
        this.crumbleTimer = this.scene.time.delayedCall(PHYSICS.CRUMBLE_DELAY, () => {
            this.destroy();
        });
    }

    destroy() {
        if (this.isDestroyed) return;
        this.isDestroyed = true;

        // Particle effect
        const particles = this.scene.add.particles(this.sprite.x, this.sprite.y, 'particle', {
            speed: { min: 50, max: 150 },
            angle: { min: 0, max: 360 },
            scale: { start: 1, end: 0 },
            lifespan: 500,
            quantity: 8,
            tint: 0x8B7355
        });

        particles.explode();

        // Remove sprite
        this.sprite.destroy();

        // Cleanup particles after effect
        this.scene.time.delayedCall(600, () => {
            particles.destroy();
        });
    }

    getY() {
        return this.sprite.y;
    }

    isActive() {
        return !this.isDestroyed && this.sprite.active;
    }
}

// Summit platform with flag
class SummitPlatform extends Platform {
    constructor(scene, x, y) {
        super(scene, x, y, 200, 'rock');

        // Create flag
        this.flag = scene.add.sprite(x, y - 48, 'flag'); // Adjusted for taller flag height
        this.flag.setDepth(60);
        this.flag.play('flag_wave');

        // Glow effect
        this.glow = scene.add.sprite(x, y - 40, 'glow');
        this.glow.setDepth(59);
        this.glow.setAlpha(0.5);
        this.glow.setScale(2);

        scene.tweens.add({
            targets: this.glow,
            alpha: 0.8,
            scale: 2.5,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
    }

    onPlayerContact(player) {
        // Trigger victory
        this.scene.triggerVictory();
    }
}
