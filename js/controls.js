/**
 * Controls Management
 * Handles keyboard input for player movement and mouse for camera/attack
 */

// Keyboard state
const keys = {};

// Mouse state
const mouse = {
    isLocked: false,
    sensitivity: 0.002,
    rotation: { x: 0, y: 0 }
};

/**
 * Initialize control event listeners
 */
function initControls() {
    // Key down handler
    window.addEventListener('keydown', (e) => {
        keys[e.key.toLowerCase()] = true;
    });
    
    // Key up handler
    window.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
    });
    
    // Mouse click for attack
    window.addEventListener('click', () => {
        // Request pointer lock on first click
        if (!mouse.isLocked && gameState.gameStarted) {
            requestPointerLock();
        }
        
        // Attack on click if game is running
        if (mouse.isLocked && gameState.gameStarted && !gameState.gameOver && !gameState.victory) {
            if (startAttack()) {
                if (typeof triggerAttackAnimation === 'function') {
                    triggerAttackAnimation();
                }
            }
        }
    });
    
    // Mouse move for camera rotation
    window.addEventListener('mousemove', (e) => {
        if (mouse.isLocked) {
            mouse.rotation.y -= e.movementX * mouse.sensitivity;
            mouse.rotation.x -= e.movementY * mouse.sensitivity;
            
            // Clamp vertical rotation
            mouse.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, mouse.rotation.x));
        }
    });
    
    // Pointer lock change events
    document.addEventListener('pointerlockchange', onPointerLockChange);
    document.addEventListener('pointerlockerror', onPointerLockError);
}

/**
 * Request pointer lock
 */
function requestPointerLock() {
    const canvas = document.querySelector('canvas');
    if (canvas) {
        canvas.requestPointerLock = canvas.requestPointerLock || 
                                    canvas.mozRequestPointerLock || 
                                    canvas.webkitRequestPointerLock;
        canvas.requestPointerLock();
    }
}

/**
 * Handle pointer lock change
 */
function onPointerLockChange() {
    const canvas = document.querySelector('canvas');
    if (document.pointerLockElement === canvas ||
        document.mozPointerLockElement === canvas ||
        document.webkitPointerLockElement === canvas) {
        mouse.isLocked = true;
        console.log('🎮 Mouse locked - Use mouse to look around, click to attack!');
    } else {
        mouse.isLocked = false;
        console.log('🔓 Mouse unlocked - Click to re-lock');
    }
}

/**
 * Handle pointer lock error
 */
function onPointerLockError() {
    console.error('Pointer lock failed');
}

/**
 * Get movement direction based on key states
 * @returns {Object} Movement vector {x, z}
 */
function getMovementInput() {
    const movement = { x: 0, z: 0 };
    
    // Forward/Backward (W/S)
    if (keys['w']) {
        movement.z += 1;
    }
    if (keys['s']) {
        movement.z -= 1;
    }
    
    // Left/Right (A/D)
    if (keys['a']) {
        movement.x -= 1;
    }
    if (keys['d']) {
        movement.x += 1;
    }
    
    return movement;
}

/**
 * Get mouse rotation
 * @returns {Object} Rotation {x, y}
 */
function getMouseRotation() {
    return mouse.rotation;
}

/**
 * Check if mouse is locked
 * @returns {boolean}
 */
function isMouseLocked() {
    return mouse.isLocked;
}

/**
 * Reset all key states
 */
function resetControls() {
    Object.keys(keys).forEach(key => {
        keys[key] = false;
    });
    mouse.rotation = { x: 0, y: 0 };
}

// Initialize controls when script loads
initControls();