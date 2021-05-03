// Game states
let MENU = 0;
let FIRST_CELL = 1; // User must select first cell
let SECOND_CELL = 2; // User must select the second cell
let VIEW_SOL = 3; // Solution is being displayed
let PLAY_SOL = 4; 
let END = 5;

// Game modes
let HUMAN = 0; 
let COMPUTER = 1;

/*
    Game class which is the main core of the entire game. 
    It holds information about the game state, algorithm/board/heuristic picked, interface buttons, etc.
*/
class Game {
    constructor() {
        console.log("Starting game...");
        
        this.state = MENU; 

        this.firstX = -1;
        this.firstY = -1;
        
        this.hints = false;

        this.boardsSel = document.getElementById("board_sel");
        this.boardsSel.addEventListener("change", this.changeBoard.bind(this));
        
        this.boards = this.getBoards();
        
        this.board = new Board(this, this.boards[this.boardsSel.value].board);

        if (this.boardsSel.value == "random") // Random boards
            this.board.buildRandomBoard();
        else 
            this.board.setBoard(this.boards[this.boardsSel.value].board);

        this.modesSel = document.getElementById("mode_sel");
        this.modesSel.addEventListener("change", this.changeMode.bind(this));
        this.mode = this.modesSel.value;
        
        this.algSel = document.getElementById("algorithm_sel");
        this.algSel.addEventListener("change", this.changeAlgorithm.bind(this));
        this.algorithm = this.algSel.value;

        this.heuSel = document.getElementById("heuristic_sel");
        this.heuSel.addEventListener("change", this.changeHeuristic.bind(this));
        this.heuristic = this.algSel.value;

		this.searchTree = new SearchTree();

        this.solution = null;

        this.running = false;

        this.startButton = document.getElementById("start_button");
        this.startButton.addEventListener("click", this.run.bind(this));

        this.startSpin = document.getElementById("run_spinner");
        this.startText = document.getElementById("start_button_text");

        this.backMenuButton = document.getElementById("backMenu");
        this.backMenuButton.addEventListener("click", this.switchToMenu.bind(this));

    }

    // Responsible for running the game logic
    // Starts the respective search algorithm in case of computer game mode
    // or normal interactive game when in human mode
    async run() {
        if(this.running)
            return;

        if(this.mode == COMPUTER) {
            this.running = true;
            this.startSpin.classList.remove("d-none");
            this.startText.innerHTML = "Calculating";
            await new Promise(r => setTimeout(r, 50));
            try {
                console.log(this.board.board);
                // Search runs according to selected algorithm 
                // and calls setSolution to display the solution
                this.solution = this.runSearch(this.algorithm, this.board);
                this.setSolution();
            } catch (err) {
                console.log(err.toString());
                this.board.setDrawSolution(false);
                this.board.drawBoard();
            }
            this.startSpin.classList.add("d-none");
            this.startText.innerHTML = "Start";
            this.running = false;

        } else if(this.mode == HUMAN) {
            this.board.setDrawSolution(false);
            this.board.clearBoard();
            this.board.drawBoard();
            this.state = FIRST_CELL;
        } 

        this.switchToGame();
       
    }

    // Resets some attributes so that we are able to restart the game
    reset() {
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

    // Starts the search, given the method name
    // Returns the array of moves computed to finish the game (solution)
    runSearch(method) {
        let t0 = performance.now();
        let solution = this.searchTree.run(method, this.board.board, this.heuristic);
		let t1 = performance.now();
		console.log("Call to function took " + (t1 - t0) + " milliseconds.");
        return solution;
    }

    // Gets predefined boards
    getBoards() {
        let request = new XMLHttpRequest();
        request.open("GET", "../resources/boards.json", false);
        request.send(null)
        let boards = JSON.parse(request.responseText).boards;
        
        return boards;
    }

    // Makes the necessary actions when a cell is clicked, depending of the game state
    handleCellClick(event) {
        if(event.target.innerHTML != 0) {
            // User selects the first cell
            if(this.state == FIRST_CELL) {
                this.state = 1;

                event.target.classList.add("selected");

                let xAndY = event.target.id.split('c');
                this.firstY = parseInt(xAndY[0]);
                this.firstX = parseInt(xAndY[1]);

                this.state = SECOND_CELL;

            } 
            // User selects the second and last cell for a move 
            // and it is applied to the board
            else if(this.state == SECOND_CELL) {
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

    // Change hints flag to true
    showHints() {
        this.hints = true;
    }
    
    // Display the movie solution (demonstration only)
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

    // Set up for showing the solution
    setSolution() {
        this.board.setDrawSolution(true);
        this.state = VIEW_SOL;
        this.currentMoveView = 0;
        this.updateBoardSolution();
    }

    // Goes to the previous board state when showing the solution
    solutionBack() {
        if(this.currentMoveView > 0 && this.state == VIEW_SOL) {
            this.currentMoveView--;
            this.updateBoardSolution();
        }
    }

    // Goes to the next board state when showing the solution
    solutionForward() {
        if(this.currentMoveView < this.solution.length - 1 && this.state == VIEW_SOL) {
            this.currentMoveView++;
            this.updateBoardSolution();
        }
    }
    
    // Display a new move according to the board's solution
    updateBoardSolution() {
        this.board.board = this.solution[this.currentMoveView].board;
        this.board.clearBoard();
        this.board.drawBoard();
    }

    // Game board event listener
    changeBoard() {
        if(!this.running) {
            if (this.boardsSel.value == "random") // random
                this.board.buildRandomBoard();
            else 
                this.board.setBoard(this.boards[this.boardsSel.value].board);
            console.log(this.board.board);
        }
    }

    // Algorithm event listener
    changeAlgorithm() {
        if(!this.running) {
            this.changeHeuristic();
            this.algorithm = this.algSel.value;
        }
    }

    // Game mode event listener
    changeMode() {
        if(this.state == MENU) {
            this.changeHeuristic();
            this.mode = this.modesSel.value;
        }
    }
    
    // Responsible for displaying the right dropdown in case a computer mode or a greedy/A-Star algorithm is selected
    changeHeuristic() {
        if (!this.running) {
            let gameMode = document.querySelector("div.choose-game-mode");
            let searchAlgorithm = document.querySelector("div.choose-algorithm");
            let heuristicFunc = document.querySelector("div.choose-heuristic");

            if(this.modesSel.value == 1) {
                searchAlgorithm.classList.remove("d-none");
                if(this.algSel.value == "greedy" || this.algSel.value == "a_star") {
                    gameMode.classList.remove("col-6");
                    gameMode.classList.add("col-4");
                    searchAlgorithm.classList.remove("col-6");
                    searchAlgorithm.classList.add("col-4");
                    heuristicFunc.classList.remove("d-none");
                } else {
                    heuristicFunc.classList.add("d-none");
                    searchAlgorithm.classList.remove("col-4");
                    searchAlgorithm.classList.add("col-6");
                    gameMode.classList.add("col-6");
                }
            }
            else {
                gameMode.classList.remove("col-4");
                gameMode.classList.remove("col-6");

                searchAlgorithm.classList.add("d-none");        
                heuristicFunc.classList.add("d-none");
            }
            this.heuristic = this.heuSel.value;
        }
    }

    // Switch from menu interface to game.
    switchToGame() {
        let menuDiv = document.getElementById("menu");
        menuDiv.style.display = "none";

        let gameDiv = document.getElementById("main_game");
        gameDiv.style.display = "block";

        let menuButtonDiv = document.getElementById("back_to_menu");
        menuButtonDiv.style.display = "block";
    }

    // Switch from game interface to menu.
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
