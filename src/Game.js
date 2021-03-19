
class Game {
    constructor() {
        this.board = new Board(this);
        console.log("Starting game...");
        
        this.state = 0; // 0 - choose first cell, 1 - choose second cell

        this.firstX = -1;
        this.firstY = -1;
        
        this.hints = false;

		this.searchTree = new SearchTree(this.board.board);
    }

    async run() {
        let solution = this.runSearch("greedy");
        this.drawSolution(solution);
    }

    runSearch(method) {
        var t0 = performance.now();
        let solution = this.searchTree.run(method);
		var t1 = performance.now();
		console.log("Call to function took " + (t1 - t0) + " milliseconds.");
        return solution;
    }

    handleCellClick(event) {
        if(event.target.innerHTML != 0) {
            if(this.state == 0) {
                this.state = 1;

                // event.target.style.backgroundColor = "#666666";
                event.target.classList.add("selected");

                let xAndY = event.target.id.split('c');
                this.firstY = parseInt(xAndY[0]);
                this.firstX = parseInt(xAndY[1]);

            } else {
                let x, y;
                let xAndY = event.target.id.split('c');
                y = parseInt(xAndY[0]); 
                x = parseInt(xAndY[1]);

                if(x == this.firstX && y == this.firstY) {
                    this.state = 0;
                    
                    this.board.removeSelected();

                    return;
                }

                if(this.board.handleCellOrder(this.firstX, this.firstY, x, y)) {
                    this.state = 0;
                    this.board.emptyCell(x,y);
                    this.board.emptyCell(this.firstX, this.firstY);
                    if(this.hints) {
                        this.board.removeHints();
                    }
                    this.board.removeSelected();
                }
            }
        }
	}

    showHints() {
        this.hints = true;
    }

    async drawSolution(solution) {
        //this.board.board = solution[0].board;
        for (let i = 0; i < solution.length; ++i) {
            this.board.board = solution[i].board;
            this.board.clearBoard();
            this.board.drawBoard();
            await new Promise(r => setTimeout(r, 1000));
        }
    }
}	



