class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        // Initialize game state
        this.isGameOver = false;
        this.hasWon = false;
        this.maxAltitudeReached = 0;

        // Set world bounds (very tall for climbing)
        this.physics.world.setBounds(0, -LEVEL.SUMMIT_ALTITUDE - 500, GAME_WIDTH, LEVEL.SUMMIT_ALTITUDE + 1000);

        // Create background first
        this.parallaxBg = new ParallaxBackground(this);
        this.parallaxBg.create();

        // Create starting platform BEFORE the player
        this.startingPlatform = this.add.tileSprite(GAME_WIDTH / 2, 500, 300, 24, 'platform_rock');
        this.physics.add.existing(this.startingPlatform, true);
        this.startingPlatform.setDepth(50);

        // Create player ON the starting platform
        // Platform surface at Y = 500 - 12 = 488, player center at 488 - 16 = 472
        this.player = new Player(this, GAME_WIDTH / 2, 472);

        // Add collision between player and starting platform
        this.physics.add.collider(this.player.sprite, this.startingPlatform);

        // Create level generator (will add more platforms)
        this.levelGenerator = new LevelGenerator(this);
        this.levelGenerator.init();

        // Create snow particles
        this.snowSystem = new SnowParticleSystem(this);
        this.snowSystem.create();

        // Create Environmental Systems (Wind & Avalanche)
        this.windSystem = new WindSystem(this);
        this.avalancheSystem = new AvalancheSystem(this);
        this.coldSystem = new ColdSystem(this);

        // Create HUD
        this.hud = new HUD(this);
        this.hud.create();

        // Setup camera
        this.setupCamera();

        // Track lowest camera position (highest climb)
        this.lowestCameraY = this.cameras.main.scrollY;
    }

    setupCamera() {
        const camera = this.cameras.main;

        // Follow player with deadzone (only follow upwards)
        camera.startFollow(this.player.sprite, true, 0.1, 0.1);
        camera.setDeadzone(100, 150);

        // Offset camera to show more above player
        camera.setFollowOffset(0, 100);
    }

    update(time, delta) {
        if (this.isGameOver || this.hasWon) return;

        // Update player
        this.player.update(time, delta);

        const playerAltitude = this.player.getAltitude();
        const cameraY = this.cameras.main.scrollY;

        // Update max altitude
        this.maxAltitudeReached = Math.max(this.maxAltitudeReached, playerAltitude);

        // Prevent camera from scrolling down (lock at highest point)
        if (cameraY > this.lowestCameraY) {
            this.cameras.main.scrollY = this.lowestCameraY;
        } else {
            this.lowestCameraY = cameraY;
        }

        // Generate/cleanup platforms
        this.levelGenerator.update(this.cameras.main.scrollY);

        // Update visual systems
        this.parallaxBg.update(this.cameras.main.scrollY, playerAltitude);
        this.snowSystem.update(this.cameras.main.scrollY, playerAltitude);
        this.windSystem.update();
        this.avalancheSystem.update();
        this.coldSystem.update(delta);
        this.hud.update(playerAltitude);

        // Check fail condition - player falls below camera view
        if (this.player.sprite.y > this.cameras.main.scrollY + GAME_HEIGHT + 50) {
            this.triggerGameOver('fall');
        }
    }

    triggerGameOver(reason = 'fall') {
        if (this.isGameOver) return;
        this.isGameOver = true;

        // Get elapsed time
        const elapsedTime = this.hud.getElapsedTime();

        // Freeze physics
        this.physics.pause();

        // Screen effect
        this.cameras.main.shake(300, 0.01);
        this.cameras.main.fade(500, 0, 0, 0);

        // Transition to game over scene
        this.time.delayedCall(600, () => {
            this.scene.start('GameOverScene', {
                altitude: Math.floor(this.maxAltitudeReached),
                time: elapsedTime,
                reason: reason
            });
        });
    }

    triggerVictory() {
        if (this.hasWon) return;
        this.hasWon = true;

        // Get elapsed time
        const elapsedTime = this.hud.getElapsedTime();

        // Celebration effect
        this.cameras.main.flash(500, 255, 215, 0);

        // Freeze player
        this.player.sprite.body.velocity.set(0, 0);
        this.physics.pause();

        // Transition to victory scene
        this.time.delayedCall(1500, () => {
            this.scene.start('VictoryScene', {
                altitude: LEVEL.SUMMIT_ALTITUDE,
                time: elapsedTime
            });
        });
    }
}
