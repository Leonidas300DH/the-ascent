class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        this.loadAssets();
        this.generateTextures();
        this.createLoadingBar();
    }

    loadAssets() {
        // Background layers
        this.load.image('bg_sky', 'assets/images/backgrounds/sky.png');
        this.load.image('bg_far_mountains', 'assets/images/backgrounds/far-mountains.png');
        this.load.image('bg_mountains', 'assets/images/backgrounds/mountains.png');
        this.load.image('bg_far_clouds', 'assets/images/backgrounds/far-clouds.png');
        this.load.image('bg_near_clouds', 'assets/images/backgrounds/near-clouds.png');
        this.load.image('bg_trees', 'assets/images/backgrounds/trees.png');

        // Player spritesheets (80x80 frames)
        this.load.spritesheet('player_idle', 'assets/images/player/player-idle.png', { frameWidth: 80, frameHeight: 80 });
        this.load.spritesheet('player_run', 'assets/images/player/player-run.png', { frameWidth: 80, frameHeight: 80 });
        this.load.spritesheet('player_jump', 'assets/images/player/player-jump.png', { frameWidth: 80, frameHeight: 80 });
        this.load.spritesheet('player_cling', 'assets/images/player/player-cling.png', { frameWidth: 80, frameHeight: 80 });
        this.load.spritesheet('player_hurt', 'assets/images/player/player-hurt.png', { frameWidth: 80, frameHeight: 80 });

        // Enemies
        this.load.spritesheet('crow', 'assets/images/enemies/crow-fly.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('bird', 'assets/images/enemies/flying-bird.png', { frameWidth: 32, frameHeight: 32 });

        // Gems (16x16 frames)
        this.load.spritesheet('gem', 'assets/images/collectibles/gems.png', { frameWidth: 16, frameHeight: 16 });

        // Platform tileset
        this.load.image('tileset', 'assets/images/platforms/tileset.png');
    }

    createLoadingBar() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

        const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading Assets...', {
            fontFamily: 'monospace',
            fontSize: '20px',
            color: '#ffffff'
        });
        loadingText.setOrigin(0.5, 0.5);

        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0x4EC0CA, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
        });
    }

    generateTextures() {
        // High-Quality Pixel Art Generation

        // Palettes
        const PALETTE = {
            snow: [0xE8F1F2, 0xB3CDE0, 0x6497B1],
            rock: [0x4A4036, 0x5C5042, 0x756B5D],
            ice: [0xA5DEE5, 0xE0FFFF, 0xFFFFFF],
            dirt: [0x5D4E37, 0x4A3B2A, 0x3E3224]
        };

        // 1. Improved Player Sprite (Mountaineer)
        this.createPlayerTexture();

        // 2. High-Quality Platform Textures
        this.createRockPlatformTexture(PALETTE);
        this.createIcePlatformTexture(PALETTE);
        this.createCrumblingPlatformTexture(PALETTE);

        // 3. Environment Textures
        this.createWallTexture(PALETTE);
        this.createCloudTexture();
        this.createSnowflakeTexture();
        this.createFlagTexture();
        this.createFlagIconTexture();
        this.createGlowTexture();
        this.createParticleTexture();

        // 4. Sounds (Placeholders)
        this.createSounds();
    }

    createPlayerTexture() {
        const w = 24; // Wider for better detail
        const h = 32; // Taller
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        // Colors
        const skin = 0xFFDBB5;
        const jacket = 0xD32F2F; // Red
        const jacketDark = 0xB71C1C;
        const pants = 0x263238; // Dark Blue Grey
        const scarf = 0xFFC107; // Yellow
        const backpack = 0x5D4037; // Brown

        // Draw helper
        const rect = (color, x, y, w, h) => {
            graphics.fillStyle(color);
            graphics.fillRect(x, y, w, h);
        };

        // Backpack (behind)
        rect(backpack, 4, 10, 16, 12);

        // Head
        rect(0x3E2723, 8, 2, 8, 8); // Hair/Hat base
        rect(skin, 8, 6, 8, 6); // Face
        rect(0x3E2723, 16, 5, 2, 2); // Ear?

        // Scarf (blowing in wind)
        rect(scarf, 6, 11, 12, 4);
        rect(scarf, 2, 12, 4, 3); // Tail left

        // Torso (Jacket)
        rect(jacket, 6, 14, 12, 10);
        rect(jacketDark, 6, 22, 12, 2); // Shadow

        // Arms
        rect(jacket, 4, 15, 3, 8); // Left
        rect(jacket, 17, 15, 3, 8); // Right
        rect(skin, 4, 23, 3, 2); // Hands
        rect(skin, 17, 23, 3, 2);

        // Legs (Pants)
        rect(pants, 7, 24, 4, 6); // Left leg
        rect(pants, 13, 24, 4, 6); // Right leg

        // Boots
        rect(0x212121, 6, 30, 5, 2);
        rect(0x212121, 13, 30, 5, 2);

        graphics.generateTexture('player', w, h);
        graphics.destroy();
    }

    createRockPlatformTexture(palette) {
        const w = 64;
        const h = 24; // Thicker
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        // Main Rock Body
        graphics.fillStyle(palette.rock[1]);
        graphics.fillRect(0, 0, w, h);

        // Shading / Texture
        graphics.fillStyle(palette.rock[0]); // Dark spots
        for (let i = 0; i < 30; i++) {
            const x = Phaser.Math.Between(0, w);
            const y = Phaser.Math.Between(0, h);
            graphics.fillRect(x, y, Phaser.Math.Between(2, 5), Phaser.Math.Between(2, 5));
        }

        // Snow Cap (thick)
        graphics.fillStyle(palette.snow[0]); // White snow
        graphics.fillRect(0, 0, w, 6);

        // Snow drip
        graphics.fillStyle(palette.snow[0]);
        for (let x = 4; x < w; x += 12) {
            graphics.fillRect(x, 6, 4, Phaser.Math.Between(2, 4));
        }

        // Bottom Shadow
        graphics.fillStyle(0x000000, 0.3);
        graphics.fillRect(0, h - 2, w, 2);

        // Border/Outline effect (Top/Bottom only)
        graphics.fillStyle(palette.rock[0]);
        graphics.fillRect(0, h - 1, w, 1);

        graphics.generateTexture('platform_rock', w, h);
        graphics.destroy();
    }

    createIcePlatformTexture(palette) {
        const w = 64;
        const h = 24;
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        // Base Ice (Translucent look)
        graphics.fillStyle(palette.ice[0], 0.8);
        graphics.fillRect(0, 0, w, h);

        // Shine / Highlight
        graphics.fillStyle(palette.ice[2], 0.4);
        graphics.fillRect(0, 0, w, 4); // Top shine

        // Diagonal streaks (reflections)
        graphics.fillStyle(palette.ice[1], 0.6);
        for (let i = 0; i < 3; i++) {
            const startX = Phaser.Math.Between(5, w - 20);
            graphics.beginPath();
            graphics.moveTo(startX, 6);
            graphics.lineTo(startX + 10, h - 4);
            graphics.lineTo(startX + 15, h - 4);
            graphics.lineTo(startX + 5, 6);
            graphics.fillPath();
        }

        // Bottom darker edge
        graphics.fillStyle(palette.ice[0], 1.0);
        graphics.fillRect(0, h - 2, w, 2);

        graphics.generateTexture('platform_ice', w, h);
        graphics.destroy();
    }

    createCrumblingPlatformTexture(palette) {
        const w = 64;
        const h = 24;
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        // Base Dirt/Old Stone
        graphics.fillStyle(palette.dirt[1]);
        graphics.fillRect(0, 0, w, h);

        // Cracks
        graphics.fillStyle(palette.dirt[2]); // Dark crack color
        for (let i = 0; i < 5; i++) {
            const x = Phaser.Math.Between(10, w - 10);
            const y = Phaser.Math.Between(5, h - 5);
            graphics.fillRect(x, y, 6, 2);
            graphics.fillRect(x + 2, y - 2, 2, 6);
        }

        // Moss/Grass spots? No, keep it dry/crumbling
        graphics.fillStyle(palette.dirt[0]); // Light dust
        graphics.fillRect(0, 0, w, 3); // Dusty top

        graphics.generateTexture('platform_crumbling', w, h);
        graphics.destroy();
    }

    createWallTexture(palette) {
        const w = 64;
        const h = 128; // Larger to tile better
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        // Dark mountain rock base
        graphics.fillStyle(0x2D3436);
        graphics.fillRect(0, 0, w, h);

        // Rock strata / layers
        graphics.fillStyle(0x353B48);
        for (let y = 10; y < h; y += 20) {
            graphics.fillRect(0, y, w, 8);
        }

        // Vertical cracks
        graphics.fillStyle(0x1e272e);
        for (let x = 10; x < w; x += 20) {
            graphics.fillRect(x, 0, 4, h);
        }

        // Snow clinging to sides
        graphics.fillStyle(palette.snow[1], 0.5);
        graphics.fillRect(w - 4, 0, 4, h); // Right edge snow

        graphics.generateTexture('wall', w, h);
        graphics.destroy();
    }

    createCloudTexture() {
        const w = 128;
        const h = 64;
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        // Fluffy cumulus shape
        const circles = [
            { x: 40, y: 40, r: 24 },
            { x: 65, y: 30, r: 30 },
            { x: 90, y: 40, r: 24 },
            { x: 65, y: 50, r: 20 }
        ];

        // Base white
        graphics.fillStyle(0xFFFFFF, 0.9);
        circles.forEach(c => graphics.fillCircle(c.x, c.y, c.r));

        // Shading
        graphics.fillStyle(0xDFE6E9, 0.5);
        circles.forEach(c => graphics.fillCircle(c.x, c.y + 4, c.r * 0.9));

        graphics.generateTexture('cloud', 128, 80);
        graphics.destroy();
    }

    createSnowflakeTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.lineStyle(1, 0xFFFFFF, 1);
        graphics.moveTo(4, 0); graphics.lineTo(4, 8);
        graphics.moveTo(0, 4); graphics.lineTo(8, 4);
        graphics.moveTo(2, 2); graphics.lineTo(6, 6);
        graphics.moveTo(6, 2); graphics.lineTo(2, 6);
        graphics.strokePath();
        graphics.generateTexture('snowflake', 9, 9);
        graphics.destroy();
    }

    createFlagTexture() {
        const w = 48;
        const h = 64;
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        // Wooden pole
        graphics.fillStyle(0x5D4037);
        graphics.fillRect(4, 8, 6, 56);
        graphics.fillStyle(0x4E342E);
        graphics.fillRect(4, 8, 2, 56); // Shadow

        // Pole cap (golden)
        graphics.fillStyle(0xFFD700);
        graphics.fillCircle(7, 8, 5);
        graphics.fillStyle(0xFFC107);
        graphics.fillCircle(7, 6, 3);

        // Flag (red, waving)
        graphics.fillStyle(0xE53935);
        graphics.beginPath();
        graphics.moveTo(10, 10);
        graphics.lineTo(44, 16);
        graphics.lineTo(42, 28);
        graphics.lineTo(10, 32);
        graphics.closePath();
        graphics.fillPath();

        // Flag highlight
        graphics.fillStyle(0xEF5350);
        graphics.beginPath();
        graphics.moveTo(10, 10);
        graphics.lineTo(30, 14);
        graphics.lineTo(28, 22);
        graphics.lineTo(10, 20);
        graphics.closePath();
        graphics.fillPath();

        // Pole base (rocks/snow)
        graphics.fillStyle(0x607D8B);
        graphics.fillCircle(7, 62, 8);
        graphics.fillStyle(0xFFFFFF);
        graphics.fillCircle(5, 60, 4);
        graphics.fillCircle(10, 61, 3);

        graphics.generateTexture('flag', w, h);
        graphics.destroy();
    }

    createFlagIconTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0xFF5252);
        graphics.fillTriangle(0, 0, 14, 7, 0, 14);
        graphics.fillStyle(0xFFFFFF);
        graphics.fillRect(0, 0, 2, 16);
        graphics.generateTexture('flag_icon', 16, 16);
        graphics.destroy();
    }

    createGlowTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0xFFD700, 0.1);
        graphics.fillCircle(32, 32, 32);
        graphics.fillStyle(0xFFD700, 0.2);
        graphics.fillCircle(32, 32, 24);
        graphics.fillStyle(0xFFD700, 0.4);
        graphics.fillCircle(32, 32, 16);
        graphics.fillStyle(0xFFFFFF, 0.8);
        graphics.fillCircle(32, 32, 6);
        graphics.generateTexture('glow', 64, 64);
        graphics.destroy();
    }

    createParticleTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0xFFFFFF);
        graphics.fillCircle(2, 2, 2);
        graphics.generateTexture('particle', 4, 4);
        graphics.destroy();
    }

    createSounds() {
        // Load actual audio files from assets/audio/
        this.load.audio('jump1', 'assets/audio/jump1.mp3');
        this.load.audio('jump2', 'assets/audio/jump2.mp3');
        this.load.audio('wind', 'assets/audio/wind.mp3');
        this.load.audio('avalanche', 'assets/audio/avalanche.mp3');
        this.load.audio('crumble', 'assets/audio/crumble.mp3');
        this.load.audio('falling', 'assets/audio/falling.mp3');
        this.load.audio('game_over', 'assets/audio/game_over.mp3');
        this.load.audio('victory', 'assets/audio/victory.mp3');
        this.load.audio('music', 'assets/audio/background_music.mp3');

        // Start loading
        this.load.start();
    }

    create() {
        // Create animations
        this.createAnimations();

        // Start game scene
        this.scene.start('GameScene');
    }

    createAnimations() {
        // Player animations
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player_idle', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('player_run', { start: 0, end: 9 }),
            frameRate: 12,
            repeat: -1
        });
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('player_jump', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: 'fall',
            frames: this.anims.generateFrameNumbers('player_jump', { start: 3, end: 5 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'wall_slide',
            frames: this.anims.generateFrameNumbers('player_cling', { start: 0, end: 0 }),
            frameRate: 1,
            repeat: -1
        });

        // Enemy animations
        this.anims.create({
            key: 'crow_fly',
            frames: this.anims.generateFrameNumbers('crow', { start: 0, end: 1 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'bird_fly',
            frames: this.anims.generateFrameNumbers('bird', { start: 0, end: 6 }),
            frameRate: 10,
            repeat: -1
        });

        // Gem animation (cyan gems = frames 8-15 in row 1)
        this.anims.create({
            key: 'gem_spin',
            frames: this.anims.generateFrameNumbers('gem', { start: 8, end: 15 }),
            frameRate: 10,
            repeat: -1
        });

        // Flag animation (procedural)
        this.anims.create({
            key: 'flag_wave',
            frames: [{ key: 'flag' }],
            frameRate: 5,
            repeat: -1
        });
    }
}
