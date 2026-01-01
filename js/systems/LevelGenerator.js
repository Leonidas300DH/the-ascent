class LevelGenerator {
    constructor(scene) {
        this.scene = scene;
        this.platforms = [];
        this.currentRowY = 500;
        this.highestPlatformY = 500;
        this.summitSpawned = false;
    }

    init() {
        this.createWalls();
        this.spawnInitialPlatforms();
    }

    createWalls() {
        const leftWall = this.scene.physics.add.staticSprite(-8, 0, 'wall');
        leftWall.displayHeight = 20000;
        leftWall.displayWidth = 32;
        leftWall.refreshBody();
        leftWall.setDepth(40);

        const rightWall = this.scene.physics.add.staticSprite(GAME_WIDTH + 8, 0, 'wall');
        rightWall.displayHeight = 20000;
        rightWall.displayWidth = 32;
        rightWall.refreshBody();
        rightWall.setDepth(40);

        this.walls = [leftWall, rightWall];
        this.scene.physics.add.collider(this.scene.player.sprite, leftWall);
        this.scene.physics.add.collider(this.scene.player.sprite, rightWall);
    }

    spawnInitialPlatforms() {
        // Wide starting platform
        const startPlatform = new Platform(this.scene, GAME_WIDTH / 2, 500, 300, 'rock');
        this.platforms.push(startPlatform);
        this.addPlatformCollision(startPlatform);

        // Generate initial rows
        for (let i = 0; i < 10; i++) {
            this.generateRow();
        }
    }

    generateRow() {
        const altitude = 500 - this.highestPlatformY;
        if (altitude >= LEVEL.SUMMIT_ALTITUDE && !this.summitSpawned) {
            this.spawnSummit();
            return;
        }
        if (this.summitSpawned) return;

        // Move up by a comfortable jump height (80-110 pixels)
        const rowGap = Phaser.Math.Between(80, 110);
        const newRowY = this.currentRowY - rowGap;

        // Generate 2-4 platforms per row, spread across the screen
        const numPlatforms = Phaser.Math.Between(2, 4);

        // Divide screen into zones and place platforms
        const zoneWidth = GAME_WIDTH / numPlatforms;

        for (let i = 0; i < numPlatforms; i++) {
            // Position within zone with some randomness
            const zoneStart = i * zoneWidth;
            const zoneCenter = zoneStart + zoneWidth / 2;

            // Random offset within zone
            const xOffset = Phaser.Math.Between(-zoneWidth * 0.3, zoneWidth * 0.3);
            const x = Math.max(60, Math.min(GAME_WIDTH - 60, zoneCenter + xOffset));

            // Slight vertical variation within the row
            const yOffset = Phaser.Math.Between(-15, 15);
            const y = newRowY + yOffset;

            // Random width
            const width = Phaser.Math.Between(80, 150);

            // Random type
            const type = this.choosePlatformType();

            const platform = new Platform(this.scene, x, y, width, type);
            this.platforms.push(platform);
            this.addPlatformCollision(platform);
        }

        this.currentRowY = newRowY;
        this.highestPlatformY = newRowY;
    }

    choosePlatformType() {
        const rand = Math.random();
        if (rand < 0.15) return 'ice';
        if (rand < 0.25) return 'crumbling';
        return 'rock';
    }

    spawnSummit() {
        const summitY = this.highestPlatformY - 100;
        const summit = new SummitPlatform(this.scene, GAME_WIDTH / 2, summitY);
        this.platforms.push(summit);
        this.addPlatformCollision(summit);
        this.summitSpawned = true;
        this.highestPlatformY = summitY;
    }

    addPlatformCollision(platform) {
        this.scene.physics.add.collider(
            this.scene.player.sprite,
            platform.sprite,
            (playerSprite, platformSprite) => {
                if (this.scene.player.sprite.body.touching.down) {
                    platform.onPlayerContact(this.scene.player);
                }
            }
        );
    }

    update(cameraY) {
        // Generate new platforms ahead of camera
        // Stop generating if summit has been spawned
        while (this.highestPlatformY > cameraY - LEVEL.SPAWN_AHEAD && !this.summitSpawned) {
            this.generateRow();
        }

        this.platforms = this.platforms.filter(p => {
            if (!p.isActive()) return false;
            // Cleanup platforms far below camera
            if (p.getY() > cameraY + GAME_HEIGHT + LEVEL.CLEANUP_BEHIND) {
                p.sprite.destroy();
                return false;
            }
            return true;
        });
    }
}
