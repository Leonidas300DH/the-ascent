class ParallaxBackground {
    constructor(scene) {
        this.scene = scene;
        this.layers = [];
        this.skyGraphics = null;
        this.stars = [];
        this.lastCameraY = 0;
        this.cloudDriftOffset = 0;
    }

    create() {
        // Sky gradient background
        this.skyGraphics = this.scene.add.graphics();
        this.skyGraphics.setDepth(-100);
        this.updateSkyGradient(0);

        // Create stars
        for (let i = 0; i < 100; i++) {
            const star = this.scene.add.circle(
                Phaser.Math.Between(0, GAME_WIDTH),
                Phaser.Math.Between(-LEVEL.SUMMIT_ALTITUDE - 500, 600),
                Phaser.Math.Between(1, 2),
                0xFFFFFF
            );
            star.setDepth(-99);
            star.setAlpha(0);
            this.stars.push(star);
        }

        // Layer 1: Distant mountains
        this.createMountainLayer(0, 0.1, 0x2D3A4A, -30);

        // Layer 2: Mid clouds
        this.createCloudLayer(1, 0.25, -20);

        // Layer 3: Near clouds
        this.createCloudLayer(2, 0.4, -10);
    }

    createMountainLayer(index, speed, color, depth) {
        const graphics = this.scene.add.graphics();
        graphics.setDepth(depth);

        graphics.fillStyle(color);

        const peaks = [];
        for (let x = -200; x < GAME_WIDTH + 400; x += Phaser.Math.Between(80, 160)) {
            peaks.push({
                x: x,
                height: Phaser.Math.Between(200, 450),
                sharpness: Math.random() * 0.5 + 0.5
            });
        }

        for (let y = -LEVEL.SUMMIT_ALTITUDE - 1000; y < 1000; y += 500) {
            graphics.beginPath();
            graphics.moveTo(-200, y + 500);

            for (const peak of peaks) {
                const variance = Math.sin(y * 0.005 + peak.x) * 60;
                graphics.lineTo(peak.x, y - peak.height + variance);
            }

            graphics.lineTo(GAME_WIDTH + 200, y + 500);
            graphics.closePath();
            graphics.fill();
        }

        this.layers.push({
            graphics,
            speed,
            startY: 0,
            isCloud: false
        });
    }

    createCloudLayer(index, speed, depth) {
        const container = this.scene.add.container(0, 0);
        container.setDepth(depth);

        // Store clouds for wrap-around
        const clouds = [];

        for (let y = -LEVEL.SUMMIT_ALTITUDE - 500; y < 800; y += 150) {
            for (let i = 0; i < 3; i++) {
                const cloud = this.scene.add.sprite(
                    Phaser.Math.Between(0, GAME_WIDTH),
                    y + Phaser.Math.Between(-50, 50),
                    'cloud'
                );
                cloud.setAlpha(0.4 + Math.random() * 0.3);
                cloud.setScale(0.6 + Math.random() * 0.8);
                cloud.baseX = cloud.x; // Store original X for wrapping
                container.add(cloud);
                clouds.push(cloud);
            }
        }

        this.layers.push({
            container,
            speed,
            startY: 0,
            isCloud: true,
            clouds: clouds
        });
    }

    updateSkyGradient(altitude) {
        const progress = Math.min(1, altitude / LEVEL.SUMMIT_ALTITUDE);

        const baseColor = Phaser.Display.Color.ValueToColor(VISUALS.SKY_COLOR_BASE);
        const summitColor = Phaser.Display.Color.ValueToColor(VISUALS.SKY_COLOR_SUMMIT);

        const r = Phaser.Math.Linear(baseColor.red, summitColor.red, progress);
        const g = Phaser.Math.Linear(baseColor.green, summitColor.green, progress);
        const b = Phaser.Math.Linear(baseColor.blue, summitColor.blue, progress);

        const currentColor = Phaser.Display.Color.GetColor(r, g, b);

        this.skyGraphics.clear();
        this.skyGraphics.fillStyle(currentColor);
        this.skyGraphics.fillRect(-100, -LEVEL.SUMMIT_ALTITUDE - 1000, GAME_WIDTH + 200, LEVEL.SUMMIT_ALTITUDE + 2000);

        const starAlpha = Math.max(0, (progress - 0.2) / 0.8);
        this.stars.forEach(star => {
            star.setAlpha(starAlpha * (0.3 + Math.random() * 0.7));
        });
    }

    update(cameraY, playerAltitude) {
        this.updateSkyGradient(playerAltitude);

        const deltaY = cameraY - this.lastCameraY;

        // Cloud drift based on wind direction
        let windDirection = 0;
        if (this.scene.windSystem) {
            windDirection = this.scene.windSystem.getDirection();
        }

        // Slowly drift clouds in wind direction
        const driftSpeed = 0.5;
        this.cloudDriftOffset += windDirection * driftSpeed;

        this.layers.forEach((layer, index) => {
            const scrollAmount = deltaY * (1 - VISUALS.PARALLAX_SPEEDS[index]);

            if (layer.graphics) {
                layer.graphics.y += scrollAmount;
            } else if (layer.container) {
                layer.container.y += scrollAmount;

                // Apply horizontal cloud drift with WRAP-AROUND
                if (layer.isCloud && layer.clouds) {
                    const layerDrift = this.cloudDriftOffset * (0.5 + index * 0.2);

                    layer.clouds.forEach(cloud => {
                        // Calculate new X with wrap-around
                        let newX = cloud.baseX + layerDrift;

                        // Wrap around screen edges
                        const margin = 150;
                        if (newX > GAME_WIDTH + margin) {
                            newX = newX - (GAME_WIDTH + margin * 2);
                        } else if (newX < -margin) {
                            newX = newX + (GAME_WIDTH + margin * 2);
                        }

                        cloud.x = newX;
                    });
                }
            }
        });

        this.lastCameraY = cameraY;
    }
}
