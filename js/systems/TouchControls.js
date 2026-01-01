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
        const padding = 40;
        const buttonSize = 80;

        // Container for all buttons (fixed to camera)
        this.container = this.scene.add.container(0, 0);
        this.container.setScrollFactor(0);
        this.container.setDepth(1000);

        // Left button
        this.createButton(
            padding + buttonSize / 2,
            GAME_HEIGHT - padding - buttonSize / 2,
            buttonSize,
            '◀',
            'left'
        );

        // Right button
        this.createButton(
            padding + buttonSize * 1.7,
            GAME_HEIGHT - padding - buttonSize / 2,
            buttonSize,
            '▶',
            'right'
        );

        // Jump button (right side, larger)
        this.createButton(
            GAME_WIDTH - padding - buttonSize * 0.7,
            GAME_HEIGHT - padding - buttonSize / 2,
            buttonSize * 1.2,
            '▲',
            'jump'
        );
    }

    createButton(x, y, size, label, controlKey) {
        // Button background
        const bg = this.scene.add.circle(x, y, size / 2, 0xFFFFFF, 0.25);
        bg.setStrokeStyle(4, 0xFFFFFF, 0.5);

        // Enable input with useHandCursor for better touch response
        bg.setInteractive({ useHandCursor: false, draggable: false });

        // Button label
        const text = this.scene.add.text(x, y, label, {
            fontFamily: 'monospace',
            fontSize: `${size * 0.45}px`,
            color: '#FFFFFF'
        });
        text.setOrigin(0.5);
        text.setAlpha(0.7);

        // Use scene-level input events for more reliable touch
        const self = this;

        bg.on('pointerdown', function (pointer) {
            this.setFillStyle(0xFFFFFF, 0.5);
            self.controls[controlKey] = true;
        });

        bg.on('pointerup', function (pointer) {
            this.setFillStyle(0xFFFFFF, 0.25);
            self.controls[controlKey] = false;
        });

        bg.on('pointerout', function (pointer) {
            this.setFillStyle(0xFFFFFF, 0.25);
            self.controls[controlKey] = false;
        });

        // Also handle pointer cancel (important for mobile)
        bg.on('pointerupoutside', function (pointer) {
            this.setFillStyle(0xFFFFFF, 0.25);
            self.controls[controlKey] = false;
        });

        this.container.add(bg);
        this.container.add(text);

        this.buttons[controlKey] = { bg, text };
    }

    getControls() {
        return this.controls;
    }

    isTouchDevice() {
        return this.isTouch;
    }
}
