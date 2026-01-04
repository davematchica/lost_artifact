/**
 * World Creation
 * Creates the game environment (ground, trees, lighting)
 */

/**
 * Create the ground plane
 * @param {THREE.Scene} scene
 */
function createGround(scene) {
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x3a8c3a,
        roughness: 0.8
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    
    return ground;
}

/**
 * Create lighting for the scene
 * @param {THREE.Scene} scene
 */
function createLighting(scene) {
    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    // Directional light for shadows
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(50, 50, 50);
    dirLight.castShadow = true;
    
    // Shadow camera configuration
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 500;
    dirLight.shadow.camera.left = -100;
    dirLight.shadow.camera.right = 100;
    dirLight.shadow.camera.top = 100;
    dirLight.shadow.camera.bottom = -100;
    
    scene.add(dirLight);
    
    return { ambientLight, dirLight };
}

/**
 * Create a single tree
 * @param {number} x - X position
 * @param {number} z - Z position
 * @returns {THREE.Group}
 */
function createTree(x, z) {
    const treeGroup = new THREE.Group();
    
    // Trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.6, 4, 8);
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 2;
    trunk.castShadow = true;
    treeGroup.add(trunk);
    
    // Leaves
    const leavesGeometry = new THREE.SphereGeometry(2, 8, 8);
    const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.y = 5;
    leaves.castShadow = true;
    treeGroup.add(leaves);
    
    treeGroup.position.set(x, 0, z);
    
    return treeGroup;
}

/**
 * Create all trees in the forest
 * @param {THREE.Scene} scene
 * @returns {Array<THREE.Group>}
 */
function createTrees(scene) {
    const trees = [];
    const treePositions = [
        [15, 15], [-15, 15], [15, -15], [-15, -15],
        [25, 0], [-25, 0], [0, 25], [0, -25],
        [20, 20], [-20, -20], [20, -20], [-20, 20]
    ];
    
    treePositions.forEach(([x, z]) => {
        const tree = createTree(x, z);
        scene.add(tree);
        trees.push(tree);
    });
    
    return trees;
}

/**
 * Initialize the complete game world
 * @param {THREE.Scene} scene
 * @returns {Object} World objects
 */
function createWorld(scene) {
    // Set scene properties
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 50, 200);
    
    // Create world elements
    const ground = createGround(scene);
    const lighting = createLighting(scene);
    const trees = createTrees(scene);
    
    return {
        ground,
        lighting,
        trees
    };
}