/**
 * Game Entities
 * Creates and manages player, enemies, and artifacts
 */

/**
 * Create the player character
 * @returns {THREE.Group}
 */
function createPlayer() {
    const playerGroup = new THREE.Group();
    
    // Body
    const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x4169e1 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.75;
    body.castShadow = true;
    playerGroup.add(body);
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.4, 8, 8);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.9;
    head.castShadow = true;
    playerGroup.add(head);
    
    playerGroup.position.set(0, 0, 0);
    
    // Store body reference for animations
    playerGroup.userData.body = body;
    
    return playerGroup;
}

/**
 * Create a single artifact
 * @param {number} x - X position
 * @param {number} z - Z position
 * @returns {THREE.Mesh}
 */
function createArtifact(x, z) {
    const artifactGeometry = new THREE.OctahedronGeometry(0.8);
    const artifactMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffd700,
        emissive: 0xffd700,
        emissiveIntensity: 0.3,
        metalness: 0.8,
        roughness: 0.2
    });
    const artifact = new THREE.Mesh(artifactGeometry, artifactMaterial);
    artifact.position.set(x, 1.5, z);
    artifact.castShadow = true;
    artifact.userData.collected = false;
    artifact.userData.initialY = 1.5;
    
    return artifact;
}

/**
 * Create all artifacts
 * @param {THREE.Scene} scene
 * @returns {Array<THREE.Mesh>}
 */
function createArtifacts(scene) {
    const artifacts = [];
    const artifactPositions = [
        [30, -30],
        [-30, 30],
        [35, 10]
    ];
    
    artifactPositions.forEach(([x, z]) => {
        const artifact = createArtifact(x, z);
        scene.add(artifact);
        artifacts.push(artifact);
    });
    
    return artifacts;
}

/**
 * Create a single enemy
 * @param {number} x - X position
 * @param {number} z - Z position
 * @returns {THREE.Group}
 */
function createEnemy(x, z) {
    const enemyGroup = new THREE.Group();
    
    // Body
    const enemyBodyGeometry = new THREE.CylinderGeometry(0.6, 0.6, 1.2, 8);
    const enemyBodyMaterial = new THREE.MeshStandardMaterial({ color: 0x8b0000 });
    const enemyBody = new THREE.Mesh(enemyBodyGeometry, enemyBodyMaterial);
    enemyBody.position.y = 0.6;
    enemyBody.castShadow = true;
    enemyGroup.add(enemyBody);
    
    // Head
    const enemyHeadGeometry = new THREE.SphereGeometry(0.4, 8, 8);
    const enemyHeadMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const enemyHead = new THREE.Mesh(enemyHeadGeometry, enemyHeadMaterial);
    enemyHead.position.y = 1.5;
    enemyHead.castShadow = true;
    enemyGroup.add(enemyHead);
    
    enemyGroup.position.set(x, 0, z);
    enemyGroup.userData.alive = true;
    enemyGroup.userData.health = gameState.config.enemyHealth;
    enemyGroup.userData.lastAttackTime = 0;
    
    return enemyGroup;
}

/**
 * Create all enemies
 * @param {THREE.Scene} scene
 * @returns {Array<THREE.Group>}
 */
function createEnemies(scene) {
    const enemies = [];
    const enemyPositions = [
        [-20, -10],
        [10, -20],
        [-10, 25]
    ];
    
    enemyPositions.forEach(([x, z]) => {
        const enemy = createEnemy(x, z);
        scene.add(enemy);
        enemies.push(enemy);
    });
    
    return enemies;
}

/**
 * Animate artifacts (rotation and floating)
 * @param {Array<THREE.Mesh>} artifacts
 * @param {number} time
 */
function animateArtifacts(artifacts, time) {
    artifacts.forEach(artifact => {
        if (!artifact.userData.collected) {
            artifact.rotation.y += 0.02;
            artifact.position.y = artifact.userData.initialY + Math.sin(time * 2) * 0.2;
        }
    });
}

/**
 * Update enemy AI and animations
 * @param {Array<THREE.Group>} enemies
 * @param {THREE.Group} player
 * @param {number} time
 */
function updateEnemies(enemies, player, time) {
    enemies.forEach(enemy => {
        if (enemy.userData.alive) {
            const dx = player.position.x - enemy.position.x;
            const dz = player.position.z - enemy.position.z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            
            // Move towards player if not too close
            if (dist > gameState.config.enemyAttackRange) {
                enemy.position.x += (dx / dist) * gameState.config.enemySpeed;
                enemy.position.z += (dz / dist) * gameState.config.enemySpeed;
            }
            
            // Face the player
            enemy.rotation.y = Math.atan2(dx, dz);
            
            // Idle bounce animation
            enemy.position.y = Math.sin(time * 5) * 0.1;
            
            // Enemy attack
            if (dist < gameState.config.enemyAttackRange && Math.random() < 0.02) {
                takeDamage(gameState.config.enemyDamage);
                updateHUD();
                showMessage('You were hit! Press SPACE to attack!', '#ff4444');
                
                if (gameState.gameOver) {
                    showGameOver(false);
                }
            }
            
            // Handle player attack
            if (gameState.isAttacking && dist < gameState.config.attackRange) {
                enemy.userData.health -= gameState.config.playerDamage;
                
                if (enemy.userData.health <= 0) {
                    enemy.userData.alive = false;
                    enemy.parent.remove(enemy);
                    defeatEnemy();
                    updateHUD();
                    showMessage(`Enemy defeated! ${gameState.enemiesDefeated}/${gameState.totalEnemies}`, '#ff6666');
                    
                    if (gameState.victory) {
                        showGameOver(true);
                    }
                }
            }
        }
    });
}

/**
 * Check for artifact collection
 * @param {Array<THREE.Mesh>} artifacts
 * @param {THREE.Group} player
 */
function checkArtifactCollection(artifacts, player) {
    artifacts.forEach(artifact => {
        if (!artifact.userData.collected) {
            const dist = checkCollision(player.position, artifact.position, gameState.config.collectionRange);
            
            if (dist) {
                artifact.userData.collected = true;
                artifact.parent.remove(artifact);
                collectArtifact();
                updateHUD();
                showMessage(`Artifact collected! ${gameState.artifactsCollected}/${gameState.totalArtifacts}`, '#ffd700');
                
                if (gameState.victory) {
                    showGameOver(true);
                }
            }
        }
    });
}

/**
 * Check collision between two positions
 * @param {THREE.Vector3} pos1
 * @param {THREE.Vector3} pos2
 * @param {number} distance
 * @returns {boolean}
 */
function checkCollision(pos1, pos2, distance) {
    const dx = pos1.x - pos2.x;
    const dz = pos1.z - pos2.z;
    return Math.sqrt(dx * dx + dz * dz) < distance;
}