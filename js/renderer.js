/**
 * Renderer Setup
 * Handles Three.js renderer and camera configuration
 */

/**
 * Create and configure the Three.js renderer
 * @returns {THREE.WebGLRenderer}
 */
function createRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    return renderer;
}

/**
 * Create and configure the camera
 * @returns {THREE.PerspectiveCamera}
 */
function createCamera() {
    const camera = new THREE.PerspectiveCamera(
        75, // Field of view
        window.innerWidth / window.innerHeight, // Aspect ratio
        0.1, // Near clipping plane
        1000 // Far clipping plane
    );
    
    camera.position.set(0, 3, 0);
    
    return camera;
}

/**
 * Update camera for first-person view with mouse look
 * @param {THREE.PerspectiveCamera} camera
 * @param {THREE.Group} player
 */
function updateCamera(camera, player) {
    // Get mouse rotation
    const mouseRot = getMouseRotation();
    
    // Position camera at player's head height
    camera.position.x = player.position.x;
    camera.position.y = player.position.y + 1.5; // Eye level
    camera.position.z = player.position.z;
    
    // Apply mouse rotation to camera
    camera.rotation.order = 'YXZ';
    camera.rotation.y = mouseRot.y;
    camera.rotation.x = mouseRot.x;
    
    // Update player rotation to match camera's horizontal rotation
    player.rotation.y = mouseRot.y;
}

/**
 * Get camera's forward direction for movement
 * @param {THREE.PerspectiveCamera} camera
 * @returns {THREE.Vector3}
 */
function getCameraDirection(camera) {
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    // Flatten to horizontal plane
    direction.y = 0;
    direction.normalize();
    return direction;
}

/**
 * Get camera's right direction for strafing
 * @param {THREE.PerspectiveCamera} camera
 * @returns {THREE.Vector3}
 */
function getCameraRight(camera) {
    const right = new THREE.Vector3();
    const forward = getCameraDirection(camera);
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0));
    right.normalize();
    return right;
}

/**
 * Handle window resize
 * @param {THREE.PerspectiveCamera} camera
 * @param {THREE.WebGLRenderer} renderer
 */
function onWindowResize(camera, renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * Setup resize event listener
 * @param {THREE.PerspectiveCamera} camera
 * @param {THREE.WebGLRenderer} renderer
 */
function setupResizeHandler(camera, renderer) {
    window.addEventListener('resize', () => {
        onWindowResize(camera, renderer);
    });
}