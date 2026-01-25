class CollectibleManager {
    constructor(scene) {
        this.scene = scene;
        this.gems = [];
        this.score = 0;
    }

    create() {
        this.gemGroup = this.scene.physics.add.group();
        this.scene.physics.add.overlap(
            this.scene.player.sprite,
            this.gemGroup,
            this.onCollect,
            null,
            this
        );
    }

    spawnGem(x, y) {
        const gem = this.scene.physics.add.sprite(x, y, 'gem');
        gem.play('gem_spin');
        gem.body.allowGravity = false;
        gem.setDepth(60);

        // Float animation
        this.scene.tweens.add({
            targets: gem,
            y: y - 8,
            duration: 600,
            yoyo: true,
            repeat: -1
        });

        this.gems.push(gem);
        this.gemGroup.add(gem);
    }

    onCollect(playerSprite, gem) {
        this.score += 10;
        this.scene.hud.updateScore(this.score);

        // Collect effect
        this.scene.tweens.add({
            targets: gem,
            alpha: 0,
            scale: 2,
            duration: 150,
            onComplete: () => gem.destroy()
        });

        this.gems = this.gems.filter(g => g !== gem);
    }

    update(cameraY) {
        this.gems = this.gems.filter(gem => {
            if (gem.y > cameraY + GAME_HEIGHT + 100) {
                gem.destroy();
                return false;
            }
            return true;
        });
    }

    getScore() {
        return this.score;
    }
}
