# 🧗 The Ascent - Jeu de Plateforme Vertical

Un jeu de plateforme 2D vertical développé avec **Phaser.js 3** où le joueur escalade une montagne en affrontant des conditions météorologiques hostiles.

🎮 **Jouer maintenant** : [https://the-ascent.vercel.app](https://the-ascent.vercel.app)

---

## 📚 Guide Pédagogique

Ce projet est conçu pour aider les **étudiants en informatique** à comprendre :
- La structure d'un jeu vidéo 2D
- Le framework Phaser.js 3
- La programmation orientée objet en JavaScript
- Les patterns de conception (composition, systèmes modulaires)
- La gestion des entrées (clavier + tactile)
- Les effets visuels (particules, parallaxe)

---

## 🏗️ Architecture du Projet

```
The Ascent/
├── index.html              # Point d'entrée HTML
├── styles.css              # Styles CSS (responsive mobile)
├── js/
│   ├── main.js             # Configuration Phaser et démarrage
│   ├── config.js           # Constantes du jeu (physique, niveaux)
│   ├── i18n.js             # Internationalisation (FR/EN)
│   │
│   ├── entities/           # Entités du jeu (objets avec logique)
│   │   ├── Player.js       # Joueur : mouvements, sauts, wall-jump
│   │   └── Platform.js     # Plateformes : roche, glace, croulante
│   │
│   ├── systems/            # Systèmes globaux (logique du monde)
│   │   ├── LevelGenerator.js    # Génération procédurale des niveaux
│   │   ├── ParallaxBackground.js # Arrière-plan avec effet parallaxe
│   │   ├── ParticleSystem.js    # Système de particules de neige
│   │   ├── WindSystem.js        # Rafales de vent aléatoires
│   │   ├── AvalancheSystem.js   # Avalanches avec phase d'alerte
│   │   ├── ColdSystem.js        # Système de gel si immobile
│   │   ├── TouchControls.js     # Contrôles tactiles (iPad/mobile)
│   │   └── HUD.js               # Interface utilisateur (altitude, temps)
│   │
│   └── scenes/             # Scènes Phaser (états du jeu)
│       ├── BootScene.js    # Chargement et génération des textures
│       ├── GameScene.js    # Scène principale du gameplay
│       ├── GameOverScene.js # Écran de défaite
│       └── VictoryScene.js # Écran de victoire
```

---

## 🎮 Concepts Clés

### 1. Scènes Phaser

Phaser utilise un système de **scènes** pour organiser le jeu :

```javascript
// Chaque scène a 3 méthodes principales :
class GameScene extends Phaser.Scene {
    preload() { }  // Charger les assets (images, sons)
    create() { }   // Initialiser les objets du jeu
    update() { }   // Boucle principale (60 fois/seconde)
}
```

### 2. Physique Arcade

Le jeu utilise le moteur physique **Arcade** de Phaser :

```javascript
// Créer un sprite avec physique
this.sprite = scene.physics.add.sprite(x, y, 'player');

// Appliquer la gravité
this.sprite.body.setGravityY(1000);

// Définir la vélocité (mouvement)
this.sprite.body.velocity.x = 200;  // Déplacement horizontal
this.sprite.body.velocity.y = -500; // Saut (négatif = vers le haut)
```

### 3. Système de Particules

Les effets visuels utilisent le système de particules :

```javascript
// Créer un émetteur de particules
this.emitter = scene.add.particles(x, y, 'snowflake', {
    frequency: 100,      // Intervalle d'émission (ms)
    quantity: 2,         // Particules par émission
    lifespan: 4000,      // Durée de vie (ms)
    speedY: { min: 50, max: 150 }, // Vitesse verticale
    alpha: { start: 0.8, end: 0.2 } // Fondu
});
```

### 4. Génération Procédurale

Le niveau est généré dynamiquement pendant le jeu :

```javascript
// Algorithme de génération par rangées
// Chaque rangée peut avoir 1-3 plateformes
// L'écart vertical respecte la hauteur de saut maximale
// Les types varient : roche (60%), glace (20%), croulante (20%)
```

### 5. Détection Mobile et Contrôles Tactiles

```javascript
// Détecter un appareil tactile
const hasTouch = ('ontouchstart' in window) || 
                 (navigator.maxTouchPoints > 0);

// Créer des zones de toucher virtuelles
// Polling chaque frame pour fiabilité sur iOS/Android
```

---

## 🔧 Systèmes du Jeu

| Système | Fichier | Description |
|---------|---------|-------------|
| **Joueur** | `Player.js` | Mouvements, sauts, wall-slide, wall-jump |
| **Plateformes** | `Platform.js` | 3 types avec comportements différents |
| **Niveau** | `LevelGenerator.js` | Génération procédurale infinie |
| **Vent** | `WindSystem.js` | Rafales aléatoires affectant le joueur |
| **Avalanche** | `AvalancheSystem.js` | Danger avec phase d'avertissement |
| **Froid** | `ColdSystem.js` | Gel progressif si immobile |
| **Neige** | `ParticleSystem.js` | Intensité selon l'altitude |
| **Fond** | `ParallaxBackground.js` | Montagnes et nuages en parallaxe |

---

## 🎓 Exercices Suggérés

### Niveau Débutant
1. Modifier les constantes dans `config.js` (vitesse, saut)
2. Changer les couleurs dans `BootScene.js`
3. Ajuster la fréquence des avalanches

### Niveau Intermédiaire
4. Ajouter un nouveau type de plateforme (rebondissante)
5. Créer un collectible (pièces, étoiles)
6. Ajouter un compteur de score

### Niveau Avancé
7. Implémenter un système de sauvegarde (localStorage)
8. Ajouter des ennemis mobiles
9. Créer un éditeur de niveaux

---

## 🚀 Lancer le Projet Localement

```bash
# 1. Cloner le repository
git clone https://github.com/Leonidas300DH/the-ascent.git
cd the-ascent

# 2. Démarrer un serveur local (Python)
python3 -m http.server 8080

# 3. Ouvrir dans le navigateur
open http://localhost:8080
```

**Alternatives pour le serveur :**
```bash
# Node.js
npx serve .

# PHP
php -S localhost:8080
```

---

## 📖 Ressources d'Apprentissage

- [Documentation Phaser 3](https://photonstorm.github.io/phaser3-docs/)
- [Phaser 3 Examples](https://phaser.io/examples)
- [MDN JavaScript](https://developer.mozilla.org/fr/docs/Web/JavaScript)
- [Game Programming Patterns](https://gameprogrammingpatterns.com/)

---

## 📝 Licence

MIT - Libre pour usage éducatif et personnel.

---

*Développé avec ❤️ pour l'apprentissage de la programmation de jeux vidéo.*
