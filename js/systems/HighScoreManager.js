/**
 * HighScoreManager - Gestionnaire des meilleurs scores
 * Utilise localStorage pour persister les scores entre les sessions
 * Stocke les 10 meilleurs temps (plus bas = meilleur)
 */
class HighScoreManager {
    constructor() {
        this.storageKey = 'theAscent_highScores';
        this.maxScores = 10;
    }

    /**
     * Récupère tous les scores triés (meilleur en premier = temps le plus bas)
     * @returns {Array<{name: string, time: number}>}
     */
    getScores() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (!data) return [];
            const scores = JSON.parse(data);
            // Tri par temps croissant (plus petit = meilleur)
            return scores.sort((a, b) => a.time - b.time);
        } catch (e) {
            console.error('Error reading high scores:', e);
            return [];
        }
    }

    /**
     * Vérifie si un temps qualifie pour le tableau des scores
     * @param {number} time - Temps en millisecondes
     * @returns {boolean}
     */
    isHighScore(time) {
        const scores = this.getScores();
        // Qualifie si moins de 10 scores ou meilleur que le pire
        if (scores.length < this.maxScores) return true;
        const worstScore = scores[scores.length - 1];
        return time < worstScore.time;
    }

    /**
     * Ajoute un nouveau score
     * @param {string} name - Nom du joueur
     * @param {number} time - Temps en millisecondes
     * @returns {number} Position dans le classement (1 = premier)
     */
    addScore(name, time) {
        const scores = this.getScores();

        // Ajouter le nouveau score
        scores.push({ name: name.trim() || 'Anonyme', time: time });

        // Trier et limiter à maxScores
        scores.sort((a, b) => a.time - b.time);
        const trimmedScores = scores.slice(0, this.maxScores);

        // Sauvegarder
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(trimmedScores));
        } catch (e) {
            console.error('Error saving high scores:', e);
        }

        // Retourner la position (1-indexed)
        return trimmedScores.findIndex(s => s.name === name.trim() && s.time === time) + 1;
    }

    /**
     * Formate un temps en mm:ss
     * @param {number} ms - Temps en millisecondes
     * @returns {string}
     */
    formatTime(ms) {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    /**
     * Efface tous les scores (pour debug)
     */
    clearScores() {
        localStorage.removeItem(this.storageKey);
    }
}

// Instance globale
const highScoreManager = new HighScoreManager();
