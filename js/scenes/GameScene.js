class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        // Stop all sounds from previous scene (game over / victory)
        this.sound.stopAll();

        // Initialize game state
        this.isGameOver = false;
        this.hasWon = false;
        this.maxAltitudeReached = 0;
        this.hasPlayerMoved = false; // Timer starts on first movement

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
        // Platform surface at Y = 500 - 12 = 488, player needs to be above it
        this.player = new Player(this, GAME_WIDTH / 2, 460);

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

        // Create enemy manager
        this.enemyManager = new EnemyManager(this);
        this.enemyManager.create();

        // Create collectible manager
        this.collectibleManager = new CollectibleManager(this);
        this.collectibleManager.create();

        // Create HUD
        this.hud = new HUD(this);
        this.hud.create();

        // Create touch controls (for iPad/mobile)
        this.touchControls = new TouchControls(this);
        this.touchControls.create();

        // Setup camera
        this.setupCamera();

        // Track lowest camera position (highest climb)
        this.lowestCameraY = this.cameras.main.scrollY;

        // Start background music and ambient wind
        this.startAudio();
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

        // Detect first player movement to start timer
        if (!this.hasPlayerMoved) {
            const cursors = this.player.cursors;
            const touch = this.touchControls ? this.touchControls.getControls() : null;
            const keyboardInput = cursors.left.isDown || cursors.right.isDown ||
                cursors.up.isDown || this.player.jumpKey.isDown;
            const touchInput = touch && (touch.left || touch.right || touch.jump);

            if (keyboardInput || touchInput) {
                this.hasPlayerMoved = true;
                this.hud.startTimer();
            }
        }

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

        // Update enemy and collectible managers
        this.enemyManager.update(time, delta, this.cameras.main.scrollY, playerAltitude);
        this.collectibleManager.update(this.cameras.main.scrollY);

        this.hud.update(playerAltitude);

        // Update touch controls (must poll every frame)
        if (this.touchControls && this.touchControls.isTouch) {
            this.touchControls.update();
        }

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
            this.stopAllAudio();
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
            this.stopAllAudio();
            this.scene.start('VictoryScene', {
                altitude: LEVEL.SUMMIT_ALTITUDE,
                time: elapsedTime
            });
        });
    }

    startAudio() {
        // Background music (loop)
        if (!this.music) {
            this.music = this.sound.add('music', { loop: true, volume: 0.3 });
            this.music.play();
        }

        // Ambient wind sound (loop)
        if (!this.windSound) {
            this.windSound = this.sound.add('wind', { loop: true, volume: 0.2 });
            this.windSound.play();
        }
    }

    stopAllAudio() {
        if (this.music) {
            this.music.stop();
            this.music = null;
        }
        if (this.windSound) {
            this.windSound.stop();
            this.windSound = null;
        }
    }
}
