//import { CubeSet } from './CubeSet.js';
//import { Player } from './Player.js';
//import { ClaimState } from './ClaimState.js';
//import { CubesScene } from './CubesScene.js';

import { ClaimState } from "./ClaimState";
import { CubesScene } from "./CubeScene";
import { CubeSet } from "./CubeSet";
import { Player } from "./Player";

export class Game {
    constructor() {
        this.cubeScene = null;
        this.cubeSet = new CubeSet(this);
        this.players = [
            new Player("Player 1", ClaimState.X),
            new Player("Player 2", ClaimState.O),
        ];
        this.currentPlayerIndex = 0;
        this.winner = null;
        this.gameOver = false;
    }

    switchPlayers(verbose = false) {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        if (verbose) console.log("the current player is now: " + this.currentPlayer);
    }

    render() {
        this.cubeScene = new CubesScene(this);
    }

    play(verboseConsole = false) {
        this.gameOver = false;
        this.winner = null;

        while (!this.gameOver) {
            const currentPlayer = this.players[this.currentPlayerIndex];
            const move = currentPlayer.makeMove(this.cubeSet);

            if (verboseConsole) {
                console.log(`${currentPlayer.name} claimed cube at (${move.x}, ${move.y}, ${move.z})`);
                console.log(`${this.cubeSet.toStringTUI()}`);
            }

            const consecutiveClaims = this.cubeSet.getConsecutiveClaims(3);
            if (consecutiveClaims.length > 0) {
                this.gameOver = true;
                this.winner = currentPlayer;
                if (verboseConsole)
                    console.log(`Game over! ${this.winner.name} wins!`);
            } else {
                this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
            }
        }
    }
}