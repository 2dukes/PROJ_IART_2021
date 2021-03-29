class Board {
	constructor(game, board) {
		this.boardTable = document.querySelector("body table#board tbody");

		this.game = game;
		this.board = board;

		this.isSolution = false;	

		this.initBoard();
	}

	initBoard() {
		let dealButton = document.querySelector("body button#deal");
		let hintButton = document.querySelector("body button#hints");
		let backButton = document.querySelector("body button#back");
		let forwardButton = document.querySelector("body button#forward");
		
		dealButton.addEventListener("click", this.deal.bind(this));

		hintButton.addEventListener("click", this.giveHints.bind(this));

		backButton.addEventListener("click", this.game.solutionBack.bind(this.game));

		forwardButton.addEventListener("click", this.game.solutionForward.bind(this.game));
	}

	setBoard(board) {
		this.board = board;
	}

	buildRandomBoard() {
		this.board = [];
		for (let i = 0; i < 3; ++i) {
			let aux = [];
			for (let j = 0; j < 9; ++j) {
				aux.push(Math.floor(Math.random() * Math.floor(9))+1);
			}
			this.board.push(aux);
		}
	}

	clearBoard() {
		document.querySelector("table#board tbody").innerHTML = "";
	}

	drawBoard() {
		this.clearBoard();
		if(this.board == null)
			return;

		let colors = [
			"#00add4",
			"#c03ffc",
			"#22e345",
			"#ff0000",
			"#e3e3e3",
			"#ff0000",
			"#22e345",
			"#c03ffc",
			"#00add4",
		];

		for (let y = 0; y < this.board.length; y++) {
			let tableRow = document.createElement("tr");
			tableRow.id = y;
			for (let x = 0; x < this.board[0].length; x++) {
				let tableCell = document.createElement("td");
				tableCell.id = y + "c" + x;
				let number = this.board[y][x];
				if (number != 0) {
                    tableCell.classList.add("selectable");
					tableCell.innerHTML = number;
					tableCell.style.color = colors[number - 1];
					
					if(!this.isSolution) {
						tableCell.addEventListener(
							"click",
							this.game.handleCellClick.bind(this.game)
						);
					}
				} else {
                    tableCell.innerHTML = "0";
                    tableCell.style.color = "#171717";
                }

				tableRow.appendChild(tableCell);
			}
			this.boardTable.appendChild(tableRow);
		}
	}

	handleCellOrder(firstX, firstY, secondX, secondY) {
		let validPairs;
		if (secondY > firstY) {
			validPairs = getValidMovesCell(this.board, firstX, firstY);
			return this.checkValidPair(validPairs, secondX, secondY);
		} else if (secondY < firstY) {
			validPairs = getValidMovesCell(this.board, secondX, secondY);
			return this.checkValidPair(validPairs, firstX, firstY);
		} else {
			if (secondX > firstX) {
				validPairs = getValidMovesCell(this.board, firstX, firstY);
				return this.checkValidPair(validPairs, secondX, secondY);
			} else {
				validPairs = getValidMovesCell(this.board, secondX, secondY);
				return this.checkValidPair(validPairs, firstX, firstY);
			}
		}
	}

	checkValidPair(validPairs, x, y) {
		for (let i = 0; i < validPairs.length; ++i) {
			if (validPairs[i].p2.x == x && validPairs[i].p2.y == y) {
				return true;
			}
		}
		return false;
	}

	emptyCell(x, y) {
		this.board[y][x] = 0;
		let cell = document.getElementById(y + "c" + x);
		cell.innerHTML = 0;
		cell.style.backgroundColor = "#171717";
		cell.style.color = "#171717";
		cell.classList.remove("selectable");
	}

	deal() {
        let currentHeight = this.board.length;
        let toAdd = [], row = [];

		let y = 0;
		let x = 0;

		for(let y = 0; y < currentHeight; ++y) {
			for(let x = 0; x < this.board[0].length; ++x) {
				if(this.board[y][x] != 0) {
					row.push(this.board[y][x]);
					if(row.length == this.board[0].length) {
						toAdd.push(row);
						row = [];
					}
				}
			}
		}
        if(row.length > 0 && row.length < 9) {
			while(row.length != 9) {
				row.push(0);
			}
            toAdd.push(row);
		}
    

        this.board.push(...toAdd);
        this.insertDeal(toAdd, currentHeight);
    }

    insertDeal(toAdd, previousHeight) {

        let colors = [
			"#00add4",
			"#c03ffc",
			"#22e345",
			"#ff0000",
			"#e3e3e3",
			"#ff0000",
			"#22e345",
			"#c03ffc",
			"#00add4",
		];
		for (let y = 0; y < toAdd.length; y++) {
			let tableRow = document.createElement("tr");
			tableRow.id = y;
			for (let x = 0; x < this.board[0].length; x++) {
				let tableCell = document.createElement("td");
				tableCell.id = previousHeight + y + "c" + x;
				let number = toAdd[y][x];
				if (number != 0) {
                    tableCell.classList.add("selectable");
					tableCell.innerHTML = number;
					tableCell.style.color = colors[number - 1];

					if(!this.isSolution) {
						tableCell.addEventListener(
							"click",
							this.game.handleCellClick.bind(this.game)
						);
					}
				} else {
                    tableCell.innerHTML = "0";
                    tableCell.style.color = "#171717";
                }

				tableRow.appendChild(tableCell);
			}
			this.boardTable.appendChild(tableRow);
		}

		if(this.game.hints)
			this.giveHints();
    }

    giveHints() {
        let validMoves = getValidMoves(this.board);
        this.game.showHints();

        for (let i = 0; i < validMoves.length; ++i) {
            this.changeHintColor(validMoves[i]);
        }
    }

    changeHintColor(move) {
		let x1, x2, y1, y2;
		x1 = move.p1.x; y1 = move.p1.y;
		x2 = move.p2.x; y2 = move.p2.y;
		document.getElementById(y1 + "c" + x1).classList.add("hint");
        document.getElementById(y2 + "c" + x2).classList.add("hint");
    }
	
	removeHints() {
		let cells = document.querySelectorAll("#board td");
		for(let i = 0; i < cells.length; ++i) {
			cells[i].classList.remove("hint");
		}
	}

	removeSelected() {
		let cells = document.querySelectorAll("#board td");
		for(let i = 0; i < cells.length; ++i) {
			cells[i].classList.remove("selected");
		}
	}

	setDrawSolution(isSolution) {
		let dealButton = document.querySelector("body button#deal");
		let hintButton = document.querySelector("body button#hints");
		let backButton = document.querySelector("body button#back");
		let forwardButton = document.querySelector("body button#forward");

		if(isSolution) {
			dealButton.style.display = "none";
			hintButton.style.display = "none";
			backButton.style.display = "block";
			forwardButton.style.display = "block";

		} else if(!isSolution) {
			dealButton.style.display = "block";
			hintButton.style.display = "block";
			backButton.style.display = "none";
			forwardButton.style.display = "none";
		}
		this.isSolution = isSolution;
	}

}

