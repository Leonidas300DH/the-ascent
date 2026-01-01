// Localization System
// Detects browser language - English only if explicitly set, French by default

const TRANSLATIONS = {
    fr: {
        // Game Over
        gameOver: 'GAME OVER',
        deathFall: '💀 Tu es tombé dans le vide',
        deathFrozen: '🥶 Tu as gelé sur place',
        deathAvalanche: '❄️ Enseveli par l\'avalanche',
        time: 'Temps',
        altitude: 'Altitude',
        ofSummit: 'du sommet',
        pressSpaceRetry: '[ Appuie sur ESPACE pour réessayer ]',

        // Victory
        summitReached: '⛰️ SOMMET ATTEINT! ⛰️',
        congratulations: 'Félicitations!',
        conqueredMountain: 'Tu as conquis la montagne!\nLa vue est magnifique.',
        pressSpacePlayAgain: '[ Appuie sur ESPACE pour rejouer ]',

        // HUD
        summit: 'SOMMET'
    },
    en: {
        // Game Over
        gameOver: 'GAME OVER',
        deathFall: '💀 You fell into the void',
        deathFrozen: '🥶 You froze to death',
        deathAvalanche: '❄️ Buried by the avalanche',
        time: 'Time',
        altitude: 'Altitude',
        ofSummit: 'of summit',
        pressSpaceRetry: '[ Press SPACE to try again ]',

        // Victory
        summitReached: '⛰️ SUMMIT REACHED! ⛰️',
        congratulations: 'Congratulations!',
        conqueredMountain: 'You conquered the mountain!\nThe view is breathtaking.',
        pressSpacePlayAgain: '[ Press SPACE to play again ]',

        // HUD
        summit: 'SUMMIT'
    }
};

// Detect language - English only if browser explicitly set to English
function detectLanguage() {
    const browserLang = navigator.language || navigator.userLanguage || 'fr';
    // Only use English if it starts with 'en'
    if (browserLang.toLowerCase().startsWith('en')) {
        return 'en';
    }
    return 'fr'; // French by default
}

const CURRENT_LANG = detectLanguage();

function t(key) {
    return TRANSLATIONS[CURRENT_LANG][key] || TRANSLATIONS['fr'][key] || key;
}
