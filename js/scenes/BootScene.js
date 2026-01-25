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
        const h = 24;
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        // Define colors for pixel art style
        const darkRock = 0x3D3429;
        const midRock = 0x5C5042;
        const lightRock = 0x756B5D;
        const snowWhite = 0xF0F8FF;
        const snowShade = 0xD4E5ED;
        const outline = 0x2A241D;

        // Draw pixel by pixel for crisp look
        const setPixel = (x, y, color) => {
            graphics.fillStyle(color);
            graphics.fillRect(x, y, 1, 1);
        };

        // Bottom outline
        graphics.fillStyle(outline);
        graphics.fillRect(0, h - 1, w, 1);

        // Main rock body with layered shading
        for (let y = 8; y < h - 1; y++) {
            for (let x = 0; x < w; x++) {
                // Create rocky texture with noise
                const noise = Math.sin(x * 0.5) * Math.cos(y * 0.3) + Math.random() * 0.3;
                if (noise > 0.3) {
                    setPixel(x, y, lightRock);
                } else if (noise > -0.2) {
                    setPixel(x, y, midRock);
                } else {
                    setPixel(x, y, darkRock);
                }
            }
        }

        // Left and right edges (darker)
        graphics.fillStyle(darkRock);
        graphics.fillRect(0, 8, 2, h - 9);
        graphics.fillRect(w - 2, 8, 2, h - 9);

        // Snow cap with irregular edge
        for (let x = 0; x < w; x++) {
            const snowHeight = 6 + Math.floor(Math.sin(x * 0.3) * 2);
            for (let y = 0; y < snowHeight; y++) {
                if (y < 2) {
                    setPixel(x, y, snowWhite);
                } else if (y < snowHeight - 1) {
                    setPixel(x, y, (x + y) % 3 === 0 ? snowShade : snowWhite);
                } else {
                    setPixel(x, y, snowShade);
                }
            }
        }

        // Snow drips (icicle-like)
        for (let x = 6; x < w - 6; x += 8) {
            const dripLen = 2 + Math.floor(Math.random() * 3);
            for (let dy = 0; dy < dripLen; dy++) {
                setPixel(x, 7 + dy, dy === dripLen - 1 ? snowShade : snowWhite);
                if (dy < dripLen - 1) setPixel(x + 1, 7 + dy, snowShade);
            }
        }

        // Highlight on top edge
        graphics.fillStyle(0xFFFFFF);
        graphics.fillRect(2, 0, w - 4, 1);

        graphics.generateTexture('platform_rock', w, h);
        graphics.destroy();
    }

    createIcePlatformTexture(palette) {
        const w = 64;
        const h = 24;
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        // Ice colors
        const iceDeep = 0x5BA3B0;
        const iceMid = 0x8ED5E0;
        const iceLight = 0xC5EEF5;
        const iceWhite = 0xE8F9FC;
        const iceShine = 0xFFFFFF;
        const outline = 0x3D8A96;

        const setPixel = (x, y, color) => {
            graphics.fillStyle(color);
            graphics.fillRect(x, y, 1, 1);
        };

        // Main ice body with crystalline texture
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                // Create crystalline pattern
                const pattern = (x + y * 2) % 8;
                const depth = y / h;

                if (y < 3) {
                    // Top shine
                    setPixel(x, y, y === 0 ? iceShine : iceWhite);
                } else if (y >= h - 2) {
                    // Bottom edge
                    setPixel(x, y, y === h - 1 ? outline : iceDeep);
                } else {
                    // Main body with crystal effect
                    if (pattern < 2) {
                        setPixel(x, y, iceLight);
                    } else if (pattern < 5) {
                        setPixel(x, y, iceMid);
                    } else {
                        setPixel(x, y, depth > 0.6 ? iceDeep : iceMid);
                    }
                }
            }
        }

        // Diagonal shine streaks
        for (let i = 0; i < 3; i++) {
            const startX = 8 + i * 18;
            for (let d = 0; d < 12; d++) {
                const x = startX + d;
                const y = 4 + Math.floor(d * 1.2);
                if (x < w - 2 && y < h - 3) {
                    setPixel(x, y, iceWhite);
                    setPixel(x + 1, y, iceLight);
                }
            }
        }

        // Icicle points at bottom
        for (let x = 4; x < w - 4; x += 6) {
            const icicleLen = 2 + (x % 3);
            for (let dy = 0; dy < icicleLen; dy++) {
                const y = h - 1 + dy;
                if (y < h + 3) {
                    // Draw icicle shape tapering down
                    graphics.fillStyle(dy === 0 ? iceMid : (dy === icicleLen - 1 ? iceWhite : iceLight));
                    graphics.fillRect(x, h - 2, 2 - (dy > 1 ? 1 : 0), 1);
                }
            }
        }

        // Left and right edges
        graphics.fillStyle(outline);
        graphics.fillRect(0, 0, 1, h);
        graphics.fillRect(w - 1, 0, 1, h);

        graphics.generateTexture('platform_ice', w, h);
        graphics.destroy();
    }

    createCrumblingPlatformTexture(palette) {
        const w = 64;
        const h = 24;
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        // Crumbling rock colors - weathered brown/grey
        const darkStone = 0x3E3224;
        const midStone = 0x5D4E37;
        const lightStone = 0x7A6B54;
        const dusty = 0x8B7B64;
        const crackDark = 0x1E1810;
        const outline = 0x2D2419;

        const setPixel = (x, y, color) => {
            graphics.fillStyle(color);
            graphics.fillRect(x, y, 1, 1);
        };

        // Main crumbling body with rough texture
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const noise = Math.random();
                if (y === 0 || y === h - 1) {
                    setPixel(x, y, outline);
                } else if (y < 3) {
                    // Dusty top
                    setPixel(x, y, noise > 0.3 ? dusty : lightStone);
                } else {
                    // Rough stone texture
                    if (noise > 0.7) {
                        setPixel(x, y, lightStone);
                    } else if (noise > 0.3) {
                        setPixel(x, y, midStone);
                    } else {
                        setPixel(x, y, darkStone);
                    }
                }
            }
        }

        // Draw cracks
        const drawCrack = (startX, startY) => {
            let x = startX;
            let y = startY;
            for (let i = 0; i < 8; i++) {
                setPixel(x, y, crackDark);
                setPixel(x + 1, y, darkStone);
                // Random direction
                x += Math.random() > 0.5 ? 1 : -1;
                y += Math.random() > 0.3 ? 1 : 0;
                if (y >= h - 1 || x < 1 || x >= w - 1) break;
            }
        };

        // Add several cracks
        drawCrack(12, 4);
        drawCrack(28, 5);
        drawCrack(45, 3);
        drawCrack(52, 6);

        // Missing chunks at edges (irregular outline)
        const chunks = [
            { x: 0, y: 3, w: 3, h: 4 },
            { x: w - 4, y: 5, w: 4, h: 5 },
            { x: 8, y: h - 4, w: 5, h: 4 },
            { x: w - 12, y: h - 3, w: 4, h: 3 }
        ];

        chunks.forEach(chunk => {
            graphics.fillStyle(0x000000, 0);
            for (let cy = 0; cy < chunk.h; cy++) {
                for (let cx = 0; cx < chunk.w; cx++) {
                    // Create rough edge
                    if (Math.random() > 0.4) {
                        graphics.fillStyle(0x000000, 0);
                        graphics.fillRect(chunk.x + cx, chunk.y + cy, 1, 1);
                    }
                }
            }
        });

        // Add warning coloring (subtle red/orange tint on edges)
        graphics.fillStyle(0x8B4513, 0.3);
        graphics.fillRect(0, 0, 3, h);
        graphics.fillRect(w - 3, 0, 3, h);

        graphics.generateTexture('platform_crumbling', w, h);
        graphics.destroy();
    }

    createWallTexture(palette) {
        const w = 64;
        const h = 128;
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        // Mountain wall colors
        const darkRock = 0x2A2520;
        const midRock = 0x3D3832;
        const lightRock = 0x524B44;
        const highlight = 0x6B635A;
        const snowPatch = 0xE8F1F2;
        const snowShade = 0xB3CDE0;

        const setPixel = (x, y, color) => {
            graphics.fillStyle(color);
            graphics.fillRect(x, y, 1, 1);
        };

        // Base rocky texture
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                // Create layered rock strata effect
                const strataOffset = Math.sin(x * 0.1) * 3;
                const strata = Math.floor((y + strataOffset) / 16) % 3;
                const noise = Math.random();

                let color;
                if (strata === 0) {
                    color = noise > 0.7 ? highlight : (noise > 0.3 ? midRock : darkRock);
                } else if (strata === 1) {
                    color = noise > 0.6 ? midRock : (noise > 0.2 ? darkRock : midRock);
                } else {
                    color = noise > 0.5 ? lightRock : midRock;
                }

                // Add vertical crack lines
                if ((x === 15 || x === 35 || x === 52) && noise > 0.3) {
                    color = darkRock;
                }

                setPixel(x, y, color);
            }
        }

        // Snow patches clinging to wall
        for (let y = 0; y < h; y += 24) {
            const patchHeight = 8 + Math.floor(Math.random() * 8);
            const patchStart = y + Math.floor(Math.random() * 8);
            for (let py = 0; py < patchHeight && patchStart + py < h; py++) {
                const patchWidth = 3 + Math.floor(Math.sin(py * 0.5) * 2);
                for (let px = 0; px < patchWidth; px++) {
                    const snowX = w - 1 - px;
                    if (snowX >= 0) {
                        setPixel(snowX, patchStart + py, py < 2 ? snowPatch : snowShade);
                    }
                }
            }
        }

        // Left edge highlight (light source from left)
        for (let y = 0; y < h; y++) {
            if (Math.random() > 0.3) {
                setPixel(0, y, highlight);
            }
        }

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
