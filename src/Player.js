import { ClaimState } from './ClaimState.js';

export class Player {
    constructor(name, claimSymbol, isHuman = false) {
        this.name = name;
        this.claimSymbol = claimSymbol;
        this.isHuman = isHuman;
    }

    makeMove(cubeSet, verboseConsole = false) {
        // If human, don't auto-move (handled by click)
        if (this.isHuman) {
            return null;
        }

        const winningMove = this.getWinningMove(cubeSet);
        if (winningMove) {
            return winningMove;
        }

        const defensiveMove = this.getDefensiveMove(cubeSet);
        if (defensiveMove) {
            return defensiveMove;
        }

        const strategicMove = this.getStrategicMove(cubeSet);
        if (strategicMove) {
            return strategicMove;
        }

        const randomMove = this.getRandomMove(cubeSet);
        return randomMove;
    }

    getWinningMove(cubeSet) {
        const consecutiveClaims = cubeSet.getConsecutiveClaims(2);
        for (const consecutiveGroup of consecutiveClaims) {
            const emptyCube = consecutiveGroup.find((cube) => cube.claimState === ClaimState.EMPTY);
            if (emptyCube) {
                emptyCube.claimState = this.claimSymbol;
                return emptyCube;
            }
        }
        return null;
    }

    getDefensiveMove(cubeSet) {
        const consecutiveClaims = cubeSet.getConsecutiveClaims(2);
        for (const consecutiveGroup of consecutiveClaims) {
            const emptyCube = consecutiveGroup.find((cube) => cube.claimState === ClaimState.EMPTY);
            if (emptyCube) {
                emptyCube.claimState = this.claimSymbol;
                return emptyCube;
            }
        }
        return null;
    }

    getStrategicMove(cubeSet) {
        const consecutiveClaims = cubeSet.getConsecutiveClaims(1);
        for (const consecutiveGroup of consecutiveClaims) {
            const emptyCube = consecutiveGroup.find((cube) => cube.claimState === ClaimState.EMPTY);
            if (emptyCube) {
                emptyCube.claimState = this.claimSymbol;
                return emptyCube;
            }
        }
        return null;
    }

    getRandomMove(cubeSet) {
        const emptyCubes = [];
        for (let x = 0; x < cubeSet.cubes.length; x++) {
            for (let y = 0; y < cubeSet.cubes[x].length; y++) {
                for (let z = 0; z < cubeSet.cubes[x][y].length; z++) {
                    const cube = cubeSet.findByCoords(x, y, z);
                    if (cube.claimState === ClaimState.EMPTY) {
                        emptyCubes.push(cube);
                    }
                }
            }
        }
        if (emptyCubes.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyCubes.length);
            const randomCube = emptyCubes[randomIndex];
            randomCube.claimState = this.claimSymbol;
            return randomCube;
        }
        return null;
    }
}