class TouchControls {
    constructor(scene) {
        this.scene = scene;
        this.isTouch = false;
        this.controls = {
            left: false,
            right: false,
            jump: false
        };
        this.buttons = {};
    }

    create() {
        // Detect touch device
        this.isTouch = this.detectTouchDevice();

        if (!this.isTouch) return;

        // Create touch control buttons
        this.createButtons();
    }

    detectTouchDevice() {
        // Check for touch capability
        const hasTouch = ('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0);

        // Also check for mobile/tablet user agent
        const isMobile = /iPad|iPhone|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        return hasTouch || isMobile;
    }

    createButtons() {
        const padding = 30;
        const buttonSize = 70;
        const alpha = 0.4;

        // Container for all buttons (fixed to camera)
        this.container = this.scene.add.container(0, 0);
        this.container.setScrollFactor(0);
        this.container.setDepth(1000);

        // Left button
        const leftBtn = this.createButton(
            padding + buttonSize / 2,
            GAME_HEIGHT - padding - buttonSize / 2,
            buttonSize,
            '◀',
            () => { this.controls.left = true; },
            () => { this.controls.left = false; }
        );
        this.buttons.left = leftBtn;

        // Right button
        const rightBtn = this.createButton(
            padding + buttonSize * 1.5 + 20,
            GAME_HEIGHT - padding - buttonSize / 2,
            buttonSize,
            '▶',
            () => { this.controls.right = true; },
            () => { this.controls.right = false; }
        );
        this.buttons.right = rightBtn;

        // Jump button (right side, larger)
        const jumpBtn = this.createButton(
            GAME_WIDTH - padding - buttonSize / 2 - 20,
            GAME_HEIGHT - padding - buttonSize / 2,
            buttonSize * 1.3,
            '▲',
            () => { this.controls.jump = true; },
            () => { this.controls.jump = false; }
        );
        this.buttons.jump = jumpBtn;
    }

    createButton(x, y, size, label, onDown, onUp) {
        // Button background
        const bg = this.scene.add.circle(x, y, size / 2, 0xFFFFFF, 0.3);
        bg.setStrokeStyle(3, 0xFFFFFF, 0.6);
        bg.setInteractive();

        // Button label
        const text = this.scene.add.text(x, y, label, {
            fontFamily: 'monospace',
            fontSize: `${size * 0.5}px`,
            color: '#FFFFFF'
        });
        text.setOrigin(0.5);
        text.setAlpha(0.8);

        // Touch events
        bg.on('pointerdown', () => {
            bg.setFillStyle(0xFFFFFF, 0.5);
            onDown();
        });

        bg.on('pointerup', () => {
            bg.setFillStyle(0xFFFFFF, 0.3);
            onUp();
        });

        bg.on('pointerout', () => {
            bg.setFillStyle(0xFFFFFF, 0.3);
            onUp();
        });

        this.container.add(bg);
        this.container.add(text);

        return { bg, text };
    }

    getControls() {
        return this.controls;
    }

    isTouchDevice() {
        return this.isTouch;
    }
}
