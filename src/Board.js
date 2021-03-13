class Board {
	constructor(game) {
		this.boardTable = document.querySelector("body table#board tbody");

		this.game = game;

		this.initBoard();
	}

	initBoard() {
		this.board = [
			// [0, 2, 3, 4, 5, 6, 7, 8, 9],
			// [0, 1, 1, 2, 1, 3, 1, 4, 1],
			// [0, 1, 6, 1, 7, 1, 8, 1, 9]

			/* [0,1,0,0,5,0,0,0,9],
			[0,0,3,0,0,0,7,0,0],
			[5,9,0,0,5,0,0,4,1], */

			/* [1,0,0,0,0,0,7,8,9],
			[1,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,7,8,9],
			[0,1,1,2,1,3,1,4,1],
			[0,1,6,1,7,1,8,1,9], */

			[1,2,3,4,5,6,7,8,9],
			[1,1,1,2,1,3,1,4,1],
			[5,1,6,1,7,1,8,1,9],
			/* [1,2,3,4,5,6,7,8,9],
			[1,1,1,2,1,3,1,4,1],
			[5,1,6,1,7,1,8,1,9], */


			/* [1,2,3,4,5,6,7,8,9],
			[1,1,1,2,1,3,1,4,1],
			[5,1,6,1,7,1,8,1,9], */
		];
		this.drawBoard();
		document.querySelector("body button#deal").addEventListener("click", this.deal.bind(this));
        document.querySelector("body button#hints").addEventListener("click", this.giveHints.bind(this));
	}

	// [1,2,3,4,5,6,7,8,9],
	// [1,1,1,2,1,3,1,4,1],
	// [5,1,6,1,7,1,8,1,9]

	

	

	drawBoard() {
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

					tableCell.addEventListener(
						"click",
						this.game.handleCellClick.bind(this.game)
					);
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

					tableCell.addEventListener(
						"click",
						this.game.handleCellClick.bind(this.game)
					);
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


	
}

