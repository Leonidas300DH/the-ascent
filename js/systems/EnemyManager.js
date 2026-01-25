class EnemyManager {
    constructor(scene) {
        this.scene = scene;
        this.enemies = [];
        this.spawnTimer = 0;
    }

    create() {
        this.enemyGroup = this.scene.physics.add.group();
        this.scene.physics.add.overlap(
            this.scene.player.sprite,
            this.enemyGroup,
            this.onPlayerHit,
            null,
            this
        );
    }

    update(time, delta, cameraY, playerAltitude) {
        // Spawn enemies at higher altitudes
        if (playerAltitude > 1000) {
            this.spawnTimer += delta;
            if (this.spawnTimer > 4000) { // Every 4 seconds
                this.trySpawnEnemy(cameraY, playerAltitude);
                this.spawnTimer = 0;
            }
        }

        // Update enemies, remove off-screen
        this.enemies = this.enemies.filter(enemy => {
            if (enemy.sprite.y > cameraY + GAME_HEIGHT + 100) {
                enemy.destroy();
                return false;
            }
            enemy.update(time, delta);
            return true;
        });
    }

    trySpawnEnemy(cameraY, altitude) {
        const spawnChance = Math.min(0.7, altitude / LEVEL.SUMMIT_ALTITUDE);
        if (Math.random() > spawnChance) return;

        const type = Math.random() > 0.5 ? 'crow' : 'bird';
        const fromLeft = Math.random() > 0.5;
        const x = fromLeft ? -50 : GAME_WIDTH + 50;
        const y = cameraY + Phaser.Math.Between(100, 400);

        const enemy = new FlyingEnemy(this.scene, x, y, type, fromLeft ? 1 : -1);
        this.enemies.push(enemy);
        this.enemyGroup.add(enemy.sprite);
    }

    onPlayerHit(playerSprite, enemySprite) {
        this.scene.triggerGameOver('enemy');
    }
}

class FlyingEnemy {
    constructor(scene, x, y, type, direction) {
        this.scene = scene;
        this.type = type;
        this.sprite = scene.physics.add.sprite(x, y, type);
        this.sprite.play(type === 'crow' ? 'crow_fly' : 'bird_fly');
        this.sprite.setDepth(90);
        this.sprite.body.allowGravity = false;

        // Scale enemies appropriately
        if (type === 'crow') {
            this.sprite.setScale(0.8);
        } else {
            this.sprite.setScale(1);
        }

        const speed = type === 'crow' ? 100 : 70;
        this.sprite.body.velocity.x = speed * direction;
        this.sprite.setFlipX(direction < 0);

        this.baseY = y;
        this.time = Math.random() * 1000;
    }

    update(time, delta) {
        // Sinusoidal vertical movement
        this.time += delta;
        this.sprite.y = this.baseY + Math.sin(this.time * 0.003) * 15;
    }

    destroy() {
        this.sprite.destroy();
    }
}
