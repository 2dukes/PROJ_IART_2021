let MENU = 0;
let FIRST_CELL = 1;
let SECOND_CELL = 2;
let VIEW_SOL = 3;
let PLAY_SOL = 4;
let END = 5;

let HUMAN = 0;
let COMPUTER = 1;

class Game {
    constructor() {
        console.log("Starting game...");
        
        this.state = MENU; // 0 - choose first cell, 1 - choose second cell

        this.firstX = -1;
        this.firstY = -1;
        
        this.hints = false;

        this.boardsSel = document.getElementById("board_sel");
        this.boardsSel.addEventListener("change", this.changeBoard.bind(this));
        
        this.boards = this.getBoards();
        
        this.board = new Board(this, this.boards[this.boardsSel.value].board);

        if (this.boardsSel.value == "random") // random
            this.board.buildRandomBoard();
        else 
            this.board.setBoard(this.boards[this.boardsSel.value].board);

        this.modesSel = document.getElementById("mode_sel");
        this.modesSel.addEventListener("change", this.changeMode.bind(this));
        this.mode = this.modesSel.value;

        this.algSel = document.getElementById("algorithm_sel");
        this.algSel.addEventListener("change", this.changeAlgorithm.bind(this));
        this.algorithm = this.algSel.value;

		this.searchTree = new SearchTree();

        this.solution = null;

        this.running = false;

        this.startButton = document.getElementById("start_button");
        this.startButton.addEventListener("click", this.run.bind(this));

        this.backMenuButton = document.getElementById("backMenu");
        this.backMenuButton.addEventListener("click", this.switchToMenu.bind(this));

    }

    run() {
        if(this.running)
            return;
        // this.board.initBoard(this.currentBoard);
        // this.reset();

        // this.board.setBoard(this.boards[this.boardsSel.value].board);
        // this.board.initBoard();

        if(this.mode == COMPUTER) {
            this.running = true;
            try {
                console.log(this.board.board);
                this.solution = this.runSearch(this.algorithm, this.board);
                // this.drawSolutionAnimation(this.solution);
                this.drawSolution();
            } catch (err) {
                console.log(err.toString());
            }
            this.running = false;

        } else if(this.mode == HUMAN) {
            this.board.setDrawSolution(false);
            this.board.clearBoard();
            this.board.drawBoard();
            this.state = FIRST_CELL;
        } 

        this.switchToGame();
       
    }

    reset() {
        console.log("Resetting");
        this.boards = this.getBoards();

        if (this.boardsSel.value == "random") // random
            this.board.buildRandomBoard();
        else 
            this.board.setBoard(this.boards[this.boardsSel.value].board);
                
        this.state = MENU;
        this.solution = null;
        this.hints = false;
        this.firstX = -1;
        this.firstY = -1;
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
            if(this.state == FIRST_CELL) {
                this.state = 1;

                event.target.classList.add("selected");

                let xAndY = event.target.id.split('c');
                this.firstY = parseInt(xAndY[0]);
                this.firstX = parseInt(xAndY[1]);

                this.state = SECOND_CELL;

            } else if(this.state == SECOND_CELL) {
                let x, y;
                let xAndY = event.target.id.split('c');
                y = parseInt(xAndY[0]); 
                x = parseInt(xAndY[1]);

                if(x == this.firstX && y == this.firstY) {
                    this.state = FIRST_CELL;
                    
                    this.board.removeSelected();

                    return;
                }

                if(this.board.handleCellOrder(this.firstX, this.firstY, x, y)) {
                    this.state = FIRST_CELL;
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

        this.state = VIEW_SOL;

        this.board.setDrawSolution(true);
        for (let i = 0; i < solution.length; ++i) {
            this.board.board = solution[i].board;
            this.board.clearBoard();
            this.board.drawBoard();
            await new Promise(r => setTimeout(r, 500));
        }
        this.board.setDrawSolution(false);

        this.state = END;
    }

    drawSolution() {
        this.board.setDrawSolution(true);
        this.state = VIEW_SOL;
        this.currentMoveView = 0;
        this.updateBoardSolution();
    }

    solutionBack() {
        if(this.currentMoveView > 0 && this.state == VIEW_SOL) {
            console.log("back");
            this.currentMoveView--;
            this.updateBoardSolution();
        }
    }

    solutionForward() {
        if(this.currentMoveView < this.solution.length - 1 && this.state == VIEW_SOL) {
            console.log("forward");
            this.currentMoveView++;
            this.updateBoardSolution();
        }
    }

    updateBoardSolution() {
        this.board.board = this.solution[this.currentMoveView].board;
        this.board.clearBoard();
        this.board.drawBoard();
    }

    changeBoard() {
        if(!this.running) {
            if (this.boardsSel.value == "random") // random
                this.board.buildRandomBoard();
            else 
                this.board.setBoard(this.boards[this.boardsSel.value].board);
            console.log(this.board.board);
        }
    }

    changeAlgorithm() {
        if(!this.running) {
            this.algorithm = this.algSel.value;
        }
    }

    changeMode() {
        if(this.state == MENU) {
            this.mode = this.modesSel.value;
        }
    }

    switchToGame() {
        let menuDiv = document.getElementById("menu");
        menuDiv.style.display = "none";

        let gameDiv = document.getElementById("main_game");
        gameDiv.style.display = "block";

        let menuButtonDiv = document.getElementById("back_to_menu");
        menuButtonDiv.style.display = "block";
    }

    switchToMenu() {
        let menuDiv = document.getElementById("menu");
        menuDiv.style.display = "block";

        let gameDiv = document.getElementById("main_game");
        gameDiv.style.display = "none";

        let menuButtonDiv = document.getElementById("back_to_menu");
        menuButtonDiv.style.display = "none";

        this.reset();

    }
}	
