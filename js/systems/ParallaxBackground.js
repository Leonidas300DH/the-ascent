class ParallaxBackground {
    constructor(scene) {
        this.scene = scene;
        this.layers = [];
        this.lastCameraY = 0;
    }

    create() {
        // Create tiled image layers for each background element
        this.skyLayer = this.createTiledLayer('bg_sky', 0, -100);
        this.farMountainsLayer = this.createTiledLayer('bg_far_mountains', 0.1, -30);
        this.mountainsLayer = this.createTiledLayer('bg_mountains', 0.2, -25);
        this.farCloudsLayer = this.createTiledLayer('bg_far_clouds', 0.15, -20);
        this.nearCloudsLayer = this.createTiledLayer('bg_near_clouds', 0.3, -15);
        this.treesLayer = this.createTiledLayer('bg_trees', 0.4, -10);

        // Store layer info for parallax updates
        this.layers = [
            { sprite: this.skyLayer, parallaxFactor: 0 },
            { sprite: this.farMountainsLayer, parallaxFactor: 0.1 },
            { sprite: this.mountainsLayer, parallaxFactor: 0.2 },
            { sprite: this.farCloudsLayer, parallaxFactor: 0.15 },
            { sprite: this.nearCloudsLayer, parallaxFactor: 0.3 },
            { sprite: this.treesLayer, parallaxFactor: 0.4 }
        ];
    }

    createTiledLayer(key, parallaxFactor, depth) {
        // Calculate vertical tiling to cover the entire game world
        const worldHeight = LEVEL.SUMMIT_ALTITUDE + GAME_HEIGHT + 1000;

        // Create tileSprite that covers game width and world height
        const layer = this.scene.add.tileSprite(
            GAME_WIDTH / 2,
            GAME_HEIGHT / 2,
            GAME_WIDTH,
            GAME_HEIGHT,
            key
        );

        layer.setOrigin(0.5, 0.5);
        layer.setDepth(depth);
        layer.setScrollFactor(0); // Fixed to camera, we handle parallax manually

        return layer;
    }

    update(cameraY, playerAltitude) {
        // Update each layer's tile position for parallax effect
        this.layers.forEach(layer => {
            // Shift the tile Y position based on camera and parallax factor
            layer.sprite.tilePositionY = cameraY * layer.parallaxFactor;
        });

        // Fade out trees at higher altitudes (trees only at low altitude)
        const treeFadeStart = 500;
        const treeFadeEnd = 2000;
        if (playerAltitude < treeFadeStart) {
            this.treesLayer.setAlpha(1);
        } else if (playerAltitude > treeFadeEnd) {
            this.treesLayer.setAlpha(0);
        } else {
            const fadeProgress = (playerAltitude - treeFadeStart) / (treeFadeEnd - treeFadeStart);
            this.treesLayer.setAlpha(1 - fadeProgress);
        }

        // Add subtle horizontal cloud drift
        const time = this.scene.time.now * 0.0001;
        this.farCloudsLayer.tilePositionX = Math.sin(time) * 20;
        this.nearCloudsLayer.tilePositionX = Math.sin(time * 1.3) * 30;

        this.lastCameraY = cameraY;
    }
}
