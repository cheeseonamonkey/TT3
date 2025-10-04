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

        // Calculate the mouse position relative to the canvas element
        const canvasBounds = this.renderer.domElement.getBoundingClientRect();
        const mouseX = ((event.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1;
        const mouseY = -((event.clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1;

        // Set the mouse position for raycasting
        this.mouse.set(mouseX, mouseY);
        // Raycast from the camera to the mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // Find the first intersected cube
        const intersects = this.raycaster.intersectObjects(this.parentScene.children, true);
        const intersectedCube = intersects.find(intersect => intersect.object.userData.cubeObjectRef);

        // Check if an intersected cube was found
        if (intersectedCube) {
            let cubeObject = intersectedCube;
            let cubeSelected = intersectedCube.object.userData.cubeObjectRef;
            let game = this.parentGame;
            let cubeSet = game.cubeSet;

            const currentPlayer = game.players[game.currentPlayerIndex];

            // player makes move...
            currentPlayer.makeMove(cubeSet, true);

            console.log(game);
            console.log(cubeObject);
            console.log(cubeSelected);
            console.log(currentPlayer);

            if (cubeSelected)
                if (game.currentPlayerIndex == 0)
                    cubeSelected.setColor(0xff0000); // Change the color to red
                else if (game.currentPlayerIndex == 1)
                    cubeSelected.setColor(0x1111ff); // Change the color to blue

            const consecutiveClaims = cubeSet.getConsecutiveClaims(3);
            if (consecutiveClaims.length > 0) {
                console.log("consecutive 3 claims: ", consecutiveClaims);
                console.log(`Game over! ${game.winner} wins!`);
            } else {
                game.switchPlayers();
            }
        }
    }
}