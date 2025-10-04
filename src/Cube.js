import { ClaimState } from './ClaimState.js';

export class Cube {
    constructor(x, y, z) {
        this.claimState = ClaimState.EMPTY;
        this.x = x;
        this.y = y;
        this.z = z;
    }

    getNeighbors() {
        const neighbors = [];
        const size = this.cubes.length;
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                for (let dz = -1; dz <= 1; dz++) {
                    if (dx === 0 && dy === 0 && dz === 0) {
                        continue; // Skip the current cube
                    }
                    const neighborX = this.x + dx;
                    const neighborY = this.y + dy;
                    const neighborZ = this.z + dz;
                    if (neighborX >= 0 &&
                        neighborX < size &&
                        neighborY >= 0 &&
                        neighborY < size &&
                        neighborZ >= 0 &&
                        neighborZ < size) {
                        neighbors.push(cubeSet.findByCoords(neighborX, neighborY, neighborZ));
                    }
                }
            }
        }
        return neighbors;
    }

    getMatchingNeighbors() {
        const neighbors = this.getNeighbors();
        const matchingNeighbors = neighbors.filter(neighbor => neighbor.claimState === this.claimState);
        return matchingNeighbors;
    }
}