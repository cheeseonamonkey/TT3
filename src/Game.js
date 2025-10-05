import { ClaimState } from "./ClaimState";
import { CubesScene } from "./CubeScene";
import { CubeSet } from "./CubeSet";
import { Player } from "./Player";

export class Game {
    constructor() {
        this.cubeScene = null;
        this.cubeSet = new CubeSet(this);
        this.players = [
            new Player("Player 1", ClaimState.X, true),  // Human player
            new Player("Player 2", ClaimState.O, false), // AI player
        ];
        this.currentPlayerIndex = 0;
        this.winner = null;
        this.gameOver = false;
    }

    switchPlayers(verbose = false) {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        if (verbose) console.log("the current player is now: " + this.currentPlayer);
        
        // Update status
        const currentPlayer = this.players[this.currentPlayerIndex];
        document.getElementById('gameStatus').textContent = currentPlayer.isHuman ? 'Your turn!' : "Opponent's turn...";
        
        // If next player is AI, make their move
        if (!currentPlayer.isHuman && !this.gameOver) {
            setTimeout(() => this.makeAIMove(), ((Math.random() * 1300)+550)); // Delay for better UX
        }
    }
    makeAIMove() {
        if (this.gameOver) return;
        
        const currentPlayer = this.players[this.currentPlayerIndex];
        const move = currentPlayer.makeMove(this.cubeSet);
        
        if (move) {
            // Update visual representation
            const cubeObject = this.cubeScene.findByCoordinates(move.x, move.y, move.z);
            if (cubeObject) {
                const color = this.currentPlayerIndex === 0 ? 0xff0000 : 0x1111ff;
                cubeObject.setColor(color);
            }
            
            this.checkWinCondition();
        }
    }

    checkWinCondition() {
        const consecutiveClaims = this.cubeSet.getConsecutiveClaims(3);
        if (consecutiveClaims.length > 0) {
            this.gameOver = true;
            this.winner = this.players[this.currentPlayerIndex];
            console.log(`Game over! ${this.winner.name} wins!`);
            alert(`${this.winner.name} wins!`);
        } else {
            this.switchPlayers();
        }
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