
class Game {
    constructor() {
        
        console.log("Starting game...");

        
    }

    run() {
        let board = new Board();
		var t0 = performance.now();
		console.log(board.getValidMoves());
		var t1 = performance.now();
		console.log("Call to function took " + (t1 - t0) + " milliseconds.");
    }
}
