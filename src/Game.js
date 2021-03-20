class Game {
    constructor() {
        console.log("Starting game...");
        
        this.state = 0; // 0 - choose first cell, 1 - choose second cell

        this.firstX = -1;
        this.firstY = -1;
        
        this.hints = false;


        this.boardsSel = document.getElementById("board_sel");
        this.boardsSel.addEventListener("change", this.changeBoard.bind(this));
        
        this.boards = this.getBoards();
        this.board = new Board(this, this.boards[this.boardsSel.value].board);


		this.searchTree = new SearchTree();

        // this.currentBoard = [[1,3,7,3,1,4,1,9,6],
        //                     [3,6,1,6,1,1,8,9,6],
        //                     [5,4,5,6,8,2,5,0,0]];

        this.solution = null;

        this.running = false;
        this.startButton = document.getElementById("start_button");
        this.startButton.addEventListener("click", this.run.bind(this));
    }

    run() {
        if(this.running)
            return;
        // this.board.initBoard(this.currentBoard);
        this.running = true;
        try {
            console.log(this.board.board);
            this.solution = this.runSearch("greedy", this.board);
            this.drawSolutionAnimation(this.solution);
        } catch (err) {
            console.log(err.toString());
        }
        this.running = false;
       
    }

    runSearch(method) {
        let t0 = performance.now();
        let solution = this.searchTree.run(method, this.board.board);
		let t1 = performance.now();
		console.log("Call to function took " + (t1 - t0) + " milliseconds.");
        return solution;
    }

    getBoards() {
        let request = new XMLHttpRequest();
        request.open("GET", "../resources/boards.json", false);
        request.send(null)
        let boards = JSON.parse(request.responseText).boards;
        
        return boards;
    }

    handleCellClick(event) {
        if(event.target.innerHTML != 0) {
            if(this.state == 0) {
                this.state = 1;

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

    async drawSolutionAnimation(solution) {

        this.board.setDrawSolution(true);
        for (let i = 0; i < solution.length; ++i) {
            this.board.board = solution[i].board;
            this.board.clearBoard();
            this.board.drawBoard();
            await new Promise(r => setTimeout(r, 500));
        }
        this.board.setDrawSolution(false);
    }

    drawSolution() {

    }

    solutionForward() {

    }

    solutionBack() {

    }

    changeBoard() {
        if(!this.running) {
            this.board.setBoard(this.boards[this.boardsSel.value].board);
            console.log(this.board.board);
        }
    }
}	
