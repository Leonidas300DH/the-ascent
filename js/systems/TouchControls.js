class TouchControls {
    constructor(scene) {
        this.scene = scene;
        this.isTouch = false;
        this.controls = {
            left: false,
            right: false,
            jump: false
        };
    }

    create() {
        // Detect touch device
        this.isTouch = this.detectTouchDevice();

        if (!this.isTouch) return;

        // Enable input on the scene
        this.scene.input.addPointer(2); // Support up to 3 pointers

        // Create visual touch zones
        this.createTouchZones();
    }

    detectTouchDevice() {
        const hasTouch = ('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0);
        const isMobile = /iPad|iPhone|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        return hasTouch || isMobile;
    }

    createTouchZones() {
        const padding = 30;
        const buttonRadius = 45;
        const y = GAME_HEIGHT - padding - buttonRadius;

        // Create graphics for button visuals (fixed to camera)
        this.graphics = this.scene.add.graphics();
        this.graphics.setScrollFactor(0);
        this.graphics.setDepth(1000);

        // Draw left button
        this.leftX = padding + buttonRadius;
        this.leftY = y;
        this.drawButton(this.leftX, this.leftY, buttonRadius, '◀');

        // Draw right button
        this.rightX = padding + buttonRadius * 2.5;
        this.rightY = y;
        this.drawButton(this.rightX, this.rightY, buttonRadius, '▶');

        // Draw jump button (larger, right side)
        this.jumpRadius = buttonRadius * 1.3;
        this.jumpX = GAME_WIDTH - padding - this.jumpRadius;
        this.jumpY = y;
        this.drawButton(this.jumpX, this.jumpY, this.jumpRadius, '▲');

        // Use scene-level pointer events
        this.scene.input.on('pointerdown', this.handlePointerDown, this);
        this.scene.input.on('pointerup', this.handlePointerUp, this);
        this.scene.input.on('pointermove', this.handlePointerMove, this);
    }

    drawButton(x, y, radius, label) {
        // Draw circle
        this.graphics.lineStyle(3, 0xFFFFFF, 0.5);
        this.graphics.fillStyle(0xFFFFFF, 0.2);
        this.graphics.fillCircle(x, y, radius);
        this.graphics.strokeCircle(x, y, radius);

        // Add text label
        const text = this.scene.add.text(x, y, label, {
            fontFamily: 'Arial',
            fontSize: `${radius * 0.8}px`,
            color: '#FFFFFF'
        });
        text.setOrigin(0.5);
        text.setAlpha(0.7);
        text.setScrollFactor(0);
        text.setDepth(1001);
    }

    handlePointerDown(pointer) {
        this.checkPointer(pointer, true);
    }

    handlePointerUp(pointer) {
        // Reset controls for this pointer
        this.checkPointer(pointer, false);
    }

    handlePointerMove(pointer) {
        if (pointer.isDown) {
            this.checkPointer(pointer, true);
        }
    }

    checkPointer(pointer, isDown) {
        // Get pointer position relative to game (not screen)
        const x = pointer.x;
        const y = pointer.y;

        const leftDist = Phaser.Math.Distance.Between(x, y, this.leftX, this.leftY);
        const rightDist = Phaser.Math.Distance.Between(x, y, this.rightX, this.rightY);
        const jumpDist = Phaser.Math.Distance.Between(x, y, this.jumpX, this.jumpY);

        // Check left button
        if (leftDist < 50) {
            this.controls.left = isDown;
            if (isDown) this.controls.right = false;
        }
        // Check right button
        else if (rightDist < 50) {
            this.controls.right = isDown;
            if (isDown) this.controls.left = false;
        }
        // Check jump button
        else if (jumpDist < 60) {
            this.controls.jump = isDown;
        }
        // Touch outside buttons - reset directional controls
        else if (!isDown) {
            // Only reset if this pointer was controlling these
        }
    }

    update() {
        // Check all active pointers each frame
        const pointers = this.scene.input.manager.pointers;

        // Reset controls
        let leftActive = false;
        let rightActive = false;
        let jumpActive = false;

        for (let i = 0; i < pointers.length; i++) {
            const pointer = pointers[i];
            if (pointer && pointer.isDown) {
                const x = pointer.x;
                const y = pointer.y;

                const leftDist = Phaser.Math.Distance.Between(x, y, this.leftX, this.leftY);
                const rightDist = Phaser.Math.Distance.Between(x, y, this.rightX, this.rightY);
                const jumpDist = Phaser.Math.Distance.Between(x, y, this.jumpX, this.jumpY);

                if (leftDist < 55) leftActive = true;
                if (rightDist < 55) rightActive = true;
                if (jumpDist < 70) jumpActive = true;
            }
        }

        this.controls.left = leftActive;
        this.controls.right = rightActive;
        this.controls.jump = jumpActive;
    }

    getControls() {
        return this.controls;
    }

    isTouchDevice() {
        return this.isTouch;
    }
}
