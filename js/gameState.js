/**
 * Game State Management
 * Central state object for all game variables
 */

const gameState = {
    // Player stats
    health: 100,
    maxHealth: 100,
    
    // Progress tracking
    artifactsCollected: 0,
    enemiesDefeated: 0,
    totalArtifacts: 3,
    totalEnemies: 3,
    
    // Combat state
    isAttacking: false,
    attackCooldown: 0,
    attackCooldownMax: 30, // frames (~0.5 seconds at 60fps)
    
    // Game flow
    gameStarted: false,
    gameOver: false,
    victory: false,
    
    // Game configuration
    config: {
        playerSpeed: 0.2,
        enemySpeed: 0.05,
        attackRange: 3,
        collectionRange: 2,
        treeCollisionRange: 2,
        enemyAttackRange: 2,
        enemyDamage: 5,
        playerDamage: 10,
        enemyHealth: 30,
        mapBoundary: 90
    }
};

/**
 * Reset game state to initial values
 */
function resetGameState() {
    gameState.health = gameState.maxHealth;
    gameState.artifactsCollected = 0;
    gameState.enemiesDefeated = 0;
    gameState.isAttacking = false;
    gameState.attackCooldown = 0;
    gameState.gameStarted = false;
    gameState.gameOver = false;
    gameState.victory = false;
}

/**
 * Take damage
 * @param {number} amount - Amount of damage to take
 */
function takeDamage(amount) {
    gameState.health = Math.max(0, gameState.health - amount);
    if (gameState.health <= 0) {
        gameState.gameOver = true;
    }
}

/**
 * Collect an artifact
 */
function collectArtifact() {
    gameState.artifactsCollected++;
    checkVictory();
}

/**
 * Defeat an enemy
 */
function defeatEnemy() {
    gameState.enemiesDefeated++;
    checkVictory();
}

/**
 * Check if player has won
 */
function checkVictory() {
    if (gameState.artifactsCollected === gameState.totalArtifacts && 
        gameState.enemiesDefeated === gameState.totalEnemies) {
        gameState.victory = true;
    }
}

/**
 * Start attack action
 */
function startAttack() {
    if (!gameState.isAttacking && gameState.attackCooldown <= 0) {
        gameState.isAttacking = true;
        gameState.attackCooldown = gameState.attackCooldownMax;
        return true;
    }
    return false;
}

/**
 * Update attack cooldown (called each frame)
 */
function updateAttackCooldown() {
    if (gameState.attackCooldown > 0) {
        gameState.attackCooldown--;
    }
}