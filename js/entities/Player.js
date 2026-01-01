class Player {
    constructor(scene, x, y) {
        this.scene = scene;

        // Create sprite
        this.sprite = scene.physics.add.sprite(x, y, 'player');
        this.sprite.setCollideWorldBounds(false);
        this.sprite.body.setSize(14, 28);
        this.sprite.body.setOffset(5, 4);
        this.sprite.setDepth(100);

        // Physics
        this.sprite.body.setGravityY(PHYSICS.GRAVITY);
        this.sprite.body.setMaxVelocityY(800);

        // State
        this.isOnWall = false;
        this.wallDirection = 0; // -1 left, 1 right
        this.isOnIce = false;
        this.canWallJump = true;
        this.lastWallJumpTime = 0;
        this.facingRight = true;

        // Input
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.jumpKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Wall sensors
        this.leftSensor = null;
        this.rightSensor = null;
    }

    update(time, delta) {
        const body = this.sprite.body;
        const onGround = body.blocked.down || body.touching.down;

        // Reset wall state each frame
        this.isOnWall = false;
        this.wallDirection = 0;

        // Check wall contact
        if (body.blocked.left || body.touching.left) {
            this.isOnWall = true;
            this.wallDirection = -1;
        } else if (body.blocked.right || body.touching.right) {
            this.isOnWall = true;
            this.wallDirection = 1;
        }

        // Horizontal movement (keyboard + touch)
        let moveX = 0;
        const touch = this.scene.touchControls ? this.scene.touchControls.getControls() : null;

        if (this.cursors.left.isDown || (touch && touch.left)) {
            moveX = -PHYSICS.PLAYER_SPEED;
            this.facingRight = false;
        } else if (this.cursors.right.isDown || (touch && touch.right)) {
            moveX = PHYSICS.PLAYER_SPEED;
            this.facingRight = true;
        }

        // Apply movement with ice physics
        if (this.isOnIce && onGround) {
            // ICE PHYSICS: Slippery and Faster (Random 10-20% boost)
            if (Math.abs(moveX) > 0) {
                // Determine direction matches velocity?
                const boost = 1 + (Math.random() * 0.1 + 0.1); // 1.1 to 1.2

                // Apply smooth acceleration/slide
                body.velocity.x = Phaser.Math.Linear(
                    body.velocity.x,
                    moveX * boost,
                    0.02
                );
            } else {
                // Slide to stop slowly
                body.velocity.x *= 0.98;
            }
        } else if (!this.isOnWall) {
            body.velocity.x = moveX;
        }

        // WIND SYSTEM INTERACTION (Airborne only)
        if (!onGround && !this.isOnWall && this.scene.windSystem) {
            const windForce = this.scene.windSystem.getForce();
            if (Math.abs(windForce) > 0) {
                body.velocity.x += windForce * delta * 0.001;
            }
        }

        // Wall sliding
        if (this.isOnWall && !onGround && body.velocity.y > 0) {
            body.velocity.y = Math.min(body.velocity.y, PHYSICS.WALL_SLIDE_SPEED);
            this.canWallJump = true;
        }

        // Jumping
        const keyboardJump = Phaser.Input.Keyboard.JustDown(this.jumpKey) ||
            Phaser.Input.Keyboard.JustDown(this.cursors.up);

        // Touch jump - detect new press (compare with previous frame)
        let touchJump = false;
        if (touch && touch.jump && !this.lastTouchJump) {
            touchJump = true;
        }
        this.lastTouchJump = touch ? touch.jump : false;

        const jumpPressed = keyboardJump || touchJump;

        if (jumpPressed) {
            if (onGround) {
                // Normal jump
                body.velocity.y = PHYSICS.JUMP_VELOCITY;
                this.scene.sound.play('jump', { volume: 0.3 });
            } else if (this.isOnWall && this.canWallJump && time - this.lastWallJumpTime > 200) {
                // Wall jump
                body.velocity.y = PHYSICS.WALL_JUMP_Y;
                body.velocity.x = -this.wallDirection * PHYSICS.WALL_JUMP_X;
                this.canWallJump = false;
                this.lastWallJumpTime = time;
                this.facingRight = this.wallDirection < 0;
                this.scene.sound.play('jump', { volume: 0.3 });
            }
        }

        // Update sprite flip
        this.sprite.setFlipX(!this.facingRight);

        // Animation states
        if (!onGround) {
            if (this.isOnWall) {
                this.sprite.play('wall_slide', true);
            } else if (body.velocity.y < 0) {
                this.sprite.play('jump', true);
            } else {
                this.sprite.play('fall', true);
            }
        } else {
            if (Math.abs(body.velocity.x) > 10) {
                this.sprite.play('run', true);
            } else {
                this.sprite.play('idle', true);
            }
        }

        // Reset ice state (will be set by platform collision)
        this.isOnIce = false;
    }

    getAltitude() {
        // Altitude is negative Y (higher = more negative Y but we want positive altitude)
        return Math.max(0, 500 - this.sprite.y);
    }

    setOnIce(isOnIce) {
        this.isOnIce = isOnIce;
    }
}
