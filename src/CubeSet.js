import { Cube } from './Cube.js';
import { ClaimState } from './ClaimState.js';

export class CubeSet {
    constructor(game, size = 3) {
        this.cubes = [];
        for (let x = 0; x < size; x++) {
            this.cubes[x] = [];
            for (let y = 0; y < size; y++) {
                this.cubes[x][y] = [];
                for (let z = 0; z < size; z++) {
                    this.cubes[x][y][z] = new Cube(x, y, z);
                }
            }
        }
    }

    findByCoords(x, y, z) {
        return this.cubes[x][y][z];
    }

    toStringTUI() {
        let outstr = "\n";
        this.cubes.forEach(layer => {
            outstr += layer.map(rank => {
                return `  ${rank.map(it => it.claimState).join(" ┃ ")}  \n ━━━╋━━━╋━━━ \n`;
            }).join("").replace(/━━━╋━━━╋━━━ \n$/, "\n\n");
        });
        return outstr;
    }

    logAll() {
        //console.log(this.cubes[0])
        //console.log(this.cubes[1])
        //console.log(this.cubes[2])
    }

    getConsecutiveClaims(num) {
        const consecutiveClaims = [];

        // Define all possible directions
        const directions = [
            [1, 0, 0], // Right
            [-1, 0, 0], // Left
            [0, 1, 0], // Up
            [0, -1, 0], // Down
            [0, 0, 1], // Forward
            [0, 0, -1], // Backward
            [1, 1, 0], // Diagonal Right-Up
            [-1, -1, 0], // Diagonal Left-Down
            [1, -1, 0], // Diagonal Right-Down
            [-1, 1, 0], // Diagonal Left-Up
            [1, 0, 1], // Diagonal Right-Forward
            [-1, 0, -1], // Diagonal Left-Backward
            [0, 1, 1], // Diagonal Up-Forward
            [0, -1, -1], // Diagonal Down-Backward
            [0, 1, -1], // Diagonal Up-Backward
            [0, -1, 1], // Diagonal Down-Forward
            [1, 1, 1], // Diagonal Right-Up-Forward
            [-1, -1, -1], // Diagonal Left-Down-Backward
            [1, -1, -1], // Diagonal Right-Down-Backward
            [-1, 1, 1] // Diagonal Left-Up-Forward
        ];

        for (let x = 0; x < this.cubes.length; x++) {
            for (let y = 0; y < this.cubes[x].length; y++) {
                for (let z = 0; z < this.cubes[x][y].length; z++) {
                    const cube = this.findByCoords(x, y, z);
                    const claimState = cube.claimState;
                    if (claimState !== ClaimState.EMPTY) {
                        for (const direction of directions) {
                            let consecutiveCount = 0;
                            let currentX = x;
                            let currentY = y;
                            let currentZ = z;
                            while (currentX >= 0 && currentX < this.cubes.length &&
                                currentY >= 0 && currentY < this.cubes[currentX].length &&
                                currentZ >= 0 && currentZ < this.cubes[currentX][currentY].length &&
                                this.findByCoords(currentX, currentY, currentZ).claimState === claimState) {
                                consecutiveCount++;
                                if (consecutiveCount === num) {
                                    const consecutiveCubes = [];
                                    for (let i = 0; i < num; i++) {
                                        consecutiveCubes.push(this.findByCoords(currentX - direction[0] * i,
                                            currentY - direction[1] * i,
                                            currentZ - direction[2] * i));
                                    }
                                    consecutiveClaims.push(consecutiveCubes);
                                }
                                currentX += direction[0];
                                currentY += direction[1];
                                currentZ += direction[2];
                            }
                        }
                    }
                }
            }
        }

        return consecutiveClaims;
    }
}