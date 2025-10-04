(async () => {
    const Game = await import("./Game.js");
    let game = new Game.default();
    game.render();
})();