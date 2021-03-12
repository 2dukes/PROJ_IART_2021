class Board {
    constructor(game) {
        this.boardTable = document.querySelector("body table#board tbody");
        
        this.game = game;
        console.log(this.game);

        this.initBoard();
    }

    initBoard() {
        this.board = [
            [1,2,3,4,5,6,7,8,9],
            [1,1,1,2,1,3,1,4,1],
            [5,1,6,1,7,1,8,1,9],
            [1,2,3,4,5,6,7,8,9],
            [1,1,1,2,1,3,1,4,1],
            [5,1,6,1,7,1,8,1,9],
            [1,2,3,4,5,6,7,8,9],
            [1,1,1,2,1,3,1,4,1],
            [5,1,6,1,7,1,8,1,9],
        ];
        this.drawBoard();
    }

    // [1,2,3,4,5,6,7,8,9],
    // [1,1,1,2,1,3,1,4,1],
    // [5,1,6,1,7,1,8,1,9]

    getValidMoves() {
        let moves = [];
        for(let y = 0 ; y < this.board.length; ++y) {
            for(let x = 0; x < 9; ++x) {
                if(this.board[y][x] != 0)
                    moves.push(...this.getValidMovesCell(x,y));
            }
        }
        return moves;
    }

    getValidMovesCell(x, y) {
        let moves = [];
        let initX = x;
        let initY = y;
        let n = this.board[y][x];
        // console.log(x, y);

        if(++y < this.board.length) {
            do { // Columns
                if(this.board[y][x] == n || this.board[y][x] + n == 10) {
                    moves.push(new Move(new Position(initX, initY), new Position(x, y)));
                    break;
                }
                else if(this.board[y][x] == 0)
                    continue;
                else
                    break;
            } while(++y < this.board.length);
        }

        y = initY;

        if(x == 8) {
            x = 0;
            if(y + 1 < this.board.length)
                y++;
        }
        else 
            x++;

        do { // Lines
            if(this.board[y][x] == n || this.board[y][x] + n == 10) {
                moves.push(new Move(new Position(initX, initY), new Position(x, y)));
                break;
            }
            else if(this.board[y][x] == 0) { // Line Break with zeros
                if(x == 8) {  
                    x = -1;
                    y++;
                }
                continue;
            }
            else if(x == 8) {  // Line Break without zeros
                x = -1;
                y++;
            }
            else 
                break;
        } while(++x < this.board[0].length && y < this.board.length);

        return moves;
    }

    drawBoard() {
        let colors = ["#00add4", "#c03ffc", "#22e345", "#ff0000", "#e3e3e3", "#ff0000", "#22e345", "#c03ffc", "#00add4"];
        
        for(let y = 0; y < this.board.length; y++) {
            let tableRow = document.createElement("tr");
            tableRow.id = y;
            for(let x = 0; x < this.board[0].length; x++) {
                let tableCell = document.createElement("td");
                tableCell.id = y + "c" + x;
                let number = this.board[y][x];
                if (number != 0) {
                    tableCell.innerHTML = number;
                    tableCell.style.color = colors[number - 1];
                    tableCell.style.backgroundColor = "#171717";

                    tableCell.addEventListener('click', this.game.handleCellClick.bind(this.game));
                }

                tableRow.appendChild(tableCell);
            } 
            this.boardTable.appendChild(tableRow);
        }
    }

    handleCellOrder(firstX, firstY, secondX, secondY) {
        let validPairs;
        if(secondY > firstY) {
            validPairs = this.getValidMovesCell(firstX, firstY);
            return this.checkValidPair(validPairs, secondX, secondY);

        } else if(secondY < firstY) {
            validPairs = this.getValidMovesCell(secondX, secondY);
            return this.checkValidPair(validPairs, firstX, firstY);

        } else {
            if(secondX > firstX) {
                validPairs = this.getValidMovesCell(firstX, firstY);
                return this.checkValidPair(validPairs, secondX, secondY);

            } else {
                validPairs = this.getValidMovesCell(secondX, secondY);
                return this.checkValidPair(validPairs, firstX, firstY);
            }
        }
    }

    checkValidPair(validPairs, x, y) {
        console.log(validPairs, x, y);
        for(let i = 0; i < validPairs.length; ++i) {
            if(validPairs[i].p2.x == x && validPairs[i].p2.y == y) {
                console.log("VALID");
                return true;
            }
        }
        console.log("NOT VALID");
        return false;
    }
    
    emptyCell(x, y) {
        this.board[y][x] = 0;
        let cell = document.getElementById(y + "c" + x);
        cell.innerHTML = 0;
        cell.style.backgroundColor = "#171717";
        cell.style.color = "#171717";
    }

}

