/**
 * UI Management
 * Handles all user interface updates and interactions
 */

// DOM Elements
const ui = {
    instructions: document.getElementById('instructions'),
    startBtn: document.getElementById('start-btn'),
    hud: document.getElementById('hud'),
    healthDisplay: document.getElementById('health'),
    artifactsDisplay: document.getElementById('artifacts'),
    enemiesDisplay: document.getElementById('enemies'),
    message: document.getElementById('message'),
    gameOver: document.getElementById('game-over'),
    gameOverTitle: document.getElementById('game-over-title'),
    gameOverText: document.getElementById('game-over-text'),
    finalArtifacts: document.getElementById('final-artifacts'),
    finalEnemies: document.getElementById('final-enemies'),
    finalHealth: document.getElementById('final-health'),
    restartBtn: document.getElementById('restart-btn')
};

/**
 * Update the HUD display
 */
function updateHUD() {
    ui.healthDisplay.textContent = `❤️ Health: ${gameState.health}/${gameState.maxHealth}`;
    ui.artifactsDisplay.textContent = `✨ Artifacts: ${gameState.artifactsCollected}/${gameState.totalArtifacts}`;
    ui.enemiesDisplay.textContent = `👹 Enemies: ${gameState.totalEnemies - gameState.enemiesDefeated}/${gameState.totalEnemies}`;
}

/**
 * Show a status message
 * @param {string} text - Message to display
 * @param {string} color - Text color (default: white)
 */
function showMessage(text, color = 'white') {
    ui.message.textContent = text;
    ui.message.style.color = color;
    
    // Update border color based on message type
    if (color === '#4CAF50' || color === '#f44336') {
        ui.message.style.borderColor = color;
    } else {
        ui.message.style.borderColor = '#ffd700';
    }
}

/**
 * Show the game over screen
 * @param {boolean} victory - True if player won, false if lost
 */
function showGameOver(victory) {
    ui.gameOver.style.display = 'block';
    
    if (victory) {
        ui.gameOverTitle.textContent = '🎉 Victory!';
        ui.gameOverTitle.style.color = '#4CAF50';
        ui.gameOverText.textContent = 'You are a true hero! All artifacts collected and enemies defeated!';
        ui.gameOver.style.border = '3px solid #4CAF50';
        ui.restartBtn.style.background = '#4CAF50';
    } else {
        ui.gameOverTitle.textContent = '💀 Game Over';
        ui.gameOverTitle.style.color = '#f44336';
        ui.gameOverText.textContent = 'You have fallen in battle. Better luck next time!';
        ui.gameOver.style.border = '3px solid #f44336';
        ui.restartBtn.style.background = '#f44336';
    }
    
    // Update final stats
    ui.finalArtifacts.textContent = `Artifacts Collected: ${gameState.artifactsCollected}/${gameState.totalArtifacts}`;
    ui.finalEnemies.textContent = `Enemies Defeated: ${gameState.enemiesDefeated}/${gameState.totalEnemies}`;
    ui.finalHealth.textContent = `Final Health: ${gameState.health}/${gameState.maxHealth}`;
}

/**
 * Hide the instructions screen and show the game
 */
function startGame() {
    ui.instructions.classList.add('hidden');
    ui.hud.classList.remove('hidden');
    ui.message.classList.remove('hidden');
    gameState.gameStarted = true;
    showMessage('Find the 3 lost artifacts and defeat all enemies!');
}

/**
 * Initialize UI event listeners
 */
function initUI() {
    // Start button
    ui.startBtn.addEventListener('click', () => {
        startGame();
        if (typeof initGameWorld === 'function') {
            initGameWorld();
        }
    });
    
    // Restart button
    ui.restartBtn.addEventListener('click', () => {
        location.reload();
    });
}

// Initialize UI when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUI);
} else {
    initUI();
}