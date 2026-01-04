/**
 * Game Logic
 * Main game loop and player movement
 */

// Game objects (will be initialized when game starts)
let scene, camera, renderer;
let player, enemies, artifacts, trees;
let gameInitialized = false;

/**
 * Initialize the game world
 */
function initGameWorld() {
    if (gameInitialized) return;
    
    // Create scene
    scene = new THREE.Scene();
    
    // Create renderer and add to DOM
    renderer = createRenderer();
    document.getElementById('game-container').appendChild(renderer.domElement);
    
    // Create camera
    camera = createCamera();
    
    // Create world
    const world = createWorld(scene);
    trees = world.trees;
    
    // Create entities
    player = createPlayer();
    scene.add(player);
    
    artifacts = createArtifacts(scene);
    enemies = createEnemies(scene);
    
    // Setup resize handler
    setupResizeHandler(camera, renderer);
    
    // Initial camera position
    camera.position.copy(player.position);
    camera.position.y += 1.5;
    
    // Start game loop
    gameInitialized = true;
    animate();
    
    // Show instruction to click for mouse lock
    showMessage('Click anywhere to lock mouse and start playing!');
}

/**
 * Handle player movement with first-person controls
 */
function updatePlayerMovement() {
    const movement = getMovementInput();
    
    // Get camera directions
    const forward = getCameraDirection(camera);
    const right = getCameraRight(camera);
    
    // Calculate movement vector based on camera orientation
    const moveVector = new THREE.Vector3();
    
    // Forward/backward
    moveVector.add(forward.multiplyScalar(movement.z));
    
    // Left/right (strafe)
    moveVector.add(right.multiplyScalar(movement.x));
    
    // Normalize diagonal movement
    if (moveVector.length() > 0) {
        moveVector.normalize();
    }
    
    // Calculate new position
    const newPos = player.position.clone();
    newPos.x += moveVector.x * gameState.config.playerSpeed;
    newPos.z += moveVector.z * gameState.config.playerSpeed;
    
    // Apply boundary limits
    newPos.x = Math.max(-gameState.config.mapBoundary, Math.min(gameState.config.mapBoundary, newPos.x));
    newPos.z = Math.max(-gameState.config.mapBoundary, Math.min(gameState.config.mapBoundary, newPos.z));
    
    // Check collision with trees
    let collision = false;
    trees.forEach(tree => {
        if (checkCollision(newPos, tree.position, gameState.config.treeCollisionRange)) {
            collision = true;
        }
    });
    
    // Update player position if no collision
    if (!collision) {
        player.position.copy(newPos);
    }
}

/**
 * Trigger attack animation
 */
function triggerAttackAnimation() {
    if (!player || !player.userData.body) return;
    
    const body = player.userData.body;
    
    // Scale animation for attack
    body.scale.set(1.2, 0.9, 1.2);
    
    // Show attack indicator
    showMessage('⚔️ Attack!', '#ffaa00');
    
    setTimeout(() => {
        body.scale.set(1, 1, 1);
        gameState.isAttacking = false;
    }, 100);
}

/**
 * Create crosshair for aiming
 */
function createCrosshair() {
    const crosshair = document.createElement('div');
    crosshair.id = 'crosshair';
    crosshair.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 4px;
        height: 4px;
        background: white;
        border: 2px solid black;
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        box-shadow: 0 0 0 2px rgba(255,255,255,0.5);
    `;
    document.body.appendChild(crosshair);
}

/**
 * Main game loop
 */
let time = 0;
function animate() {
    requestAnimationFrame(animate);
    
    // Don't update game logic if game is over
    if (gameState.gameOver || gameState.victory) {
        renderer.render(scene, camera);
        return;
    }
    
    // Update time
    time += 0.016;
    
    // Only update if mouse is locked
    if (isMouseLocked()) {
        // Update player
        updatePlayerMovement();
        updateAttackCooldown();
        
        // Update camera to follow player (first-person)
        updateCamera(camera, player);
        
        // Update entities
        animateArtifacts(artifacts, time);
        updateEnemies(enemies, player, time);
        
        // Check artifact collection
        checkArtifactCollection(artifacts, player);
    }
    
    // Render scene
    renderer.render(scene, camera);
}

// Create crosshair when game starts
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createCrosshair);
} else {
    createCrosshair();
}