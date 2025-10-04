import { ClaimState } from './ClaimState.js';

export class CubeObject {
    constructor(parentScene, renderer, camera, parentGame, coords) {
        this.parentScene = parentScene;
        this.renderer = renderer;
        this.camera = camera;
        this.parentGame = parentGame;
        this.coords = coords;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.renderer.domElement.removeEventListener('click', this.handleMouseClick.bind(this));
        this.renderer.domElement.addEventListener('click', this.handleMouseClick.bind(this));
        this.raycaster.precision = 0.05;
    }

    static createCubeMesh(yScaleFactor) {
        const geometry = new THREE.BoxGeometry(1, yScaleFactor, 1);
        const edgesGeometry = new THREE.EdgesGeometry(geometry);
        const material = new THREE.MeshBasicMaterial({ color: 0x28df31 });
        const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x33aabb, linewidth: 5 });
        const cube = new THREE.Mesh(geometry, material);
        this.cubeMesh = cube;

        const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
        cube.add(edges);
        return cube;
    }

    setColor(color) {
        const material = this.mesh.material;
        material.color.set(color);
        material.needsUpdate = true;
    }

    handleMouseClick(event) {
        event.preventDefault();
        event.stopPropagation();

        const game = this.parentGame;
        
        // Check if game is over
        if (game.gameOver) {
            console.log("Game is over!");
            return;
        }

        // Check if current player is human
        const currentPlayer = game.players[game.currentPlayerIndex];
        if (!currentPlayer.isHuman) {
            console.log("Wait for AI to move!");
            return;
        }

        // Calculate mouse position relative to canvas
        const canvasBounds = this.renderer.domElement.getBoundingClientRect();
        const mouseX = ((event.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1;
        const mouseY = -((event.clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1;

        this.mouse.set(mouseX, mouseY);
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // Find intersected cube
        const intersects = this.raycaster.intersectObjects(this.parentScene.children, true);
        const intersectedCube = intersects.find(intersect => intersect.object.userData.cubeObjectRef);

        if (intersectedCube) {
            const cubeObject = intersectedCube.object.userData.cubeObjectRef;
            const cubeSet = game.cubeSet;
            
            // Get the logical cube from CubeSet
            const logicalCube = cubeSet.findByCoords(
                cubeObject.coords.x,
                cubeObject.coords.y,
                cubeObject.coords.z
            );

            // Check if cube is empty
            if (logicalCube.claimState !== ClaimState.EMPTY) {
                console.log("Cube already claimed!");
                return;
            }

            // Claim the cube
            logicalCube.claimState = currentPlayer.claimSymbol;

            // Update visual
            const color = game.currentPlayerIndex === 0 ? 0xff0000 : 0x1111ff;
            cubeObject.setColor(color);

            console.log(`${currentPlayer.name} claimed cube at (${logicalCube.x}, ${logicalCube.y}, ${logicalCube.z})`);

            // Check win condition and switch players
            game.checkWinCondition();
        }
    }
}