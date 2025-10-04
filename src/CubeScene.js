import { CubeObject } from './CubeObject.js';

export class CubesScene {
    constructor(parentGame) {
        this.parentGame = parentGame;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(70, 1.0);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.canvasEl = document.getElementById('divCubeCanvas');
        this.yScaleFactor = inpYScaleFactorSlider.value;
        this.mesh = null;
        this.cubes = new Array(3).fill(null).map(() => new Array(3).fill(null).map(() => new Array(3).fill(null)));
        this.controls = null;
        this.init();
    }

    init() {
        this.renderer.setSize(document.querySelector("#divCubeCanvas").clientWidth, document.querySelector("#divCubeCanvas").clientWidth);
        this.renderer.setPixelRatio(1.0);
        this.canvasEl.appendChild(this.renderer.domElement);
        this.camera.position.set(0, 0, 10);
        this.addCubesToScene();
        this.addEventListeners();
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.enablePan = false;
        this.controls.dampingFactor = 0.15;
        this.controls.rotateSpeed = 0.35;
        this.controls.zoomSpeed = 0.75;
        this.controls.target.set(0, 0, 0);
        this.animate();
        this.modifyMargin(inpMarginSlider.value);
        btnExplodeCubes.addEventListener("click", evn => {
            this.explodeCubes();
        });

        // Set a better target (after animate() call)
        const lookAtMe = this.cubes[1][1][1].mesh.position;
        this.controls.target.set(lookAtMe.x, lookAtMe.y, lookAtMe.z);
    }

    addEventListeners() {
        inpMarginSlider.addEventListener('input', (evn) => this.modifyMargin(evn.target.value));
        inpYScaleFactorSlider.addEventListener('input', (evn) => this.modifyYScaleFactor(evn.target.value));
    }

    findByCoordinates(x, y, z) {
        if (x < 0 || x >= 3 || y < 0 || y >= 3 || z < 0 || z >= 3) {
            return null;
        }
        return this.cubes[x][y][z];
    }

    addCubesToScene() {
        const margin = 1.11;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 3; k++) {
                    const cube = new CubeObject(this.scene, this.renderer, this.camera, this.parentGame, { x: i, y: j, z: k });
                    cube.mesh = CubeObject.createCubeMesh(this.yScaleFactor);
                    cube.mesh.userData.cubeObjectRef = cube;
                    this.cubes[i][j][k] = cube;
                    const x = (i - 1.5) * margin;
                    const y = (j - 1.5) * (margin * this.yScaleFactor);
                    const z = (k - 1.5) * margin;
                    cube.mesh.position.set(x, y, z);
                    this.scene.add(cube.mesh);
                }
            }
        }
    }

    allCubes() {
        return this.cubes.flat(2);
    }

    animate() {
        try {
            requestAnimationFrame(this.animate.bind(this));

            this.controls.update();
            this.renderer.render(this.scene, this.camera);

            // Set a better target (after animate() call)
            const lookAtMe = this.cubes[1][1][1].mesh.position;
            this.controls.target.set(lookAtMe.x, lookAtMe.y, lookAtMe.z);

        } catch (err) {
            console.error('Exception in animate() method:', err.message);
            console.error(err);
        }
    }

    explodeCubes() {
        const targetMargin = 10;
        const rotationSpeed = 0.01;

        const animateExplosion = () => {
            let currentMargin = 0.5;

            const animate = () => {
                currentMargin += 0.03;
                if (currentMargin >= targetMargin) {
                    currentMargin = targetMargin;
                    return;
                }

                this.modifyMargin(currentMargin);

                this.scene.rotation.x += rotationSpeed;
                this.scene.rotation.y += rotationSpeed;
                this.scene.rotation.z += rotationSpeed;

                this.camera.rotation.x += rotationSpeed;
                this.camera.rotation.y += rotationSpeed;
                this.camera.rotation.z += rotationSpeed;

                // Set better camera target
                const lookAtMe = this.cubes[1][1][1].mesh.position;
                this.controls.target.set(lookAtMe.x, lookAtMe.y, lookAtMe.z);

                this.renderer.render(this.scene, this.camera);

                requestAnimationFrame(animate);
            };

            animate();
        };

        animateExplosion();
    }

    modifyMargin(marginIn) {
        let margin = marginIn / 2.0;
        const marginIncrement = margin;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 3; k++) {
                    const cube = this.cubes[i][j][k];
                    const x = (i - 1.5) * margin ** 2;
                    const y = ((j - 1.5) * (marginIncrement * this.yScaleFactor));
                    const z = (k - 1.5) * margin ** 2;
                    cube.mesh.position.set(x, y, z);
                }
            }
        }
        this.renderer.render(this.scene, this.camera);

        // Set a better target (after animate() call)
        const lookAtMe = this.cubes[1][1][1].mesh.position;
        this.controls.target.set(lookAtMe.x, lookAtMe.y, lookAtMe.z);
    }

    modifyCameraZoom(zoom) {
        this.camera.zoom = zoom;
        this.camera.updateProjectionMatrix();
    }

    modifyYScaleFactor(yScaleFactor) {
        this.yScaleFactor = yScaleFactor;
        this.modifyMargin(inpMarginSlider.value);

        // Set a better target (after animate() call)
        const lookAtMe = this.cubes[1][1][1].mesh.position;
        this.controls.target.set(lookAtMe.x, lookAtMe.y, lookAtMe.z);
    }
}