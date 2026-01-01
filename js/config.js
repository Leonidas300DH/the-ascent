// Game Physics Configuration
const PHYSICS = {
    GRAVITY: 1000,
    PLAYER_SPEED: 220,
    JUMP_VELOCITY: -520,
    WALL_SLIDE_SPEED: 80,
    WALL_JUMP_X: 300,
    WALL_JUMP_Y: -480,
    ICE_FRICTION: 0.98,
    CRUMBLE_DELAY: 1500
};

const ENVIRONMENT = {
    WIND: {
        MIN_DELAY: 10000,
        MAX_DELAY: 25000,
        DURATION_MIN: 2000,
        DURATION_MAX: 3000,
        FORCE: 300
    },
    AVALANCHE: {
        MIN_DELAY: 30000,
        MAX_DELAY: 60000,
        WARNING_DURATION: 4000,
        ACTIVE_DURATION: 3000,
        SNOW_DENSITY: 50
    }
};


// Level Generation
const LEVEL = {
    MAX_JUMP_HEIGHT: 85,
    MAX_HORIZONTAL_REACH: 120,
    MIN_VERTICAL_GAP: 40,
    PLATFORM_MIN_WIDTH: 80,
    PLATFORM_MAX_WIDTH: 180,
    SUMMIT_ALTITUDE: 8000,
    INITIAL_PLATFORMS: 15,
    SPAWN_AHEAD: 600,
    CLEANUP_BEHIND: 800
};


// Platform type chances
const PLATFORM_TYPES = {
    ROCK: 0.6,
    ICE: 0.2,
    CRUMBLING: 0.2
};

// Visual Settings
const VISUALS = {
    SKY_COLOR_BASE: 0x87CEEB,
    SKY_COLOR_SUMMIT: 0x0a0a2a,
    PARALLAX_SPEEDS: [0.1, 0.25, 0.4],
    SNOW_BASE_RATE: 5,
    SNOW_MAX_RATE: 80
};

// Game dimensions
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
