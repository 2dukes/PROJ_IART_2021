const MAX_DEPTH = 1000;
const MAX_DEALS = 1;

let totalDeals = 0; // total number of used deals during the search

/*
    Represents a node in the search tree.
    move - corresponding move
    parent - a reference to the parent node
    currentDepth - depth in the tree
    board - the board associated with the node (game state)
     - number of deals move used until that node
    usedHeuristic - the heuristic function to use
*/
class Node {
    constructor(move, parent, currentDepth, board, usedDeals, usedHeuristic) {
        this.move = move;
        this.parent = parent;
        this.currentDepth = currentDepth;
        this.board = [...board];

        // if node represents a final game state, set reachedFinalState to true
        this.reachedFinalState = checkFinalState(this.board);

        this.usedDeals = usedDeals;

        switch(usedHeuristic) {
            case "1":
                this.heuristic = this.evaluateMove();
                break;
            case "2":
                this.heuristic = this.evaluateMove2();
                break;
            case "3":
                this.heuristic = this.evaluateMove3();
                break;
            case "4":
                this.heuristic = this.evaluateMove4();
                break;
            default:
                this.heuristic = 0;
        }

        this.usedHeuristic = usedHeuristic;
            
    }

    // Expands the node, returning all its children
    expand() {
        if (this.currentDepth > MAX_DEPTH) {
            console.log("Max Depth exceeded!");
            return [];
        }

        let children = [];

        let validMoves = getValidMoves(this.board);

        // for each valid move in the board, it is applied 
        // and a new node is created and added to the node's children
        for(let i = 0; i < validMoves.length; ++i) {
           
            let newBoard = cloneBoard(this.board);
            
            let newNode = new Node(validMoves[i], this, this.currentDepth + 1, applyMove(newBoard, validMoves[i]),this.usedDeals, this.usedHeuristic);
            children.push(newNode);
        }

        // deal move is always added to the children regardless of the valid moves
        let boardDealNode = deal(this.board);
        children.push(new Node(null, this, this.currentDepth + 1, boardDealNode, this.usedDeals + 1, this.usedHeuristic));

        return children;
    }

    
    // Expands the node and returns the children.
    // Used for the uninformed search algorithms as the deal move is the first child
    // and only expands the node if max deal moves is not reached
    expandUninformed() {


        if (this.currentDepth > MAX_DEPTH) {
            console.log("Max Depth exceeded!");
            return []; 
        }

        let children = [];
        let validMoves = getValidMoves(this.board);

        // adds deal move to the children only if limit has not been reached
        if (totalDeals++ < MAX_DEALS) {
            console.log("Using deal...");
            let boardDealNode = deal(this.board);
            children.push(new Node(null, this, this.currentDepth + 1, boardDealNode, this.usedDeals + 1, ""));
        }

        for(let i = 0; i < validMoves.length; ++i) {
            
            let newBoard = cloneBoard(this.board);
            
            let newNode = new Node(validMoves[i], this, this.currentDepth + 1, applyMove(newBoard, validMoves[i]), this.usedDeals, "");
            children.push(newNode);
        }
       
        
        return children;
    }

    // Counts the number of full cells in the booard
    countNotEmpty(board) {
        let count = 0;
        for (let y = 0; y < board.length; ++y)
            for (let x = 0; x < board[y].length; ++x)
                if (board[y][x] != 0) count++;
            
        return count;
    }

    // Used in heuristic 1 as part of the node's search/estimation of moves left to solve the board
    hintsEvaluate(auxBoard) {
        let numberOfMoves = 0;
        let validMove = getFirstValidMove(auxBoard);

        // Apply valid moves iteratively
        while(validMove != null) {
            numberOfMoves++;
            applyMove(auxBoard, validMove); // Already modifies original auxBoard
            validMove = getFirstValidMove(auxBoard);
        }

        // When a solution is found
        if(this.boardEmpty(auxBoard)) 
            numberOfMoves = 0;

        return {
            "finalBoard": auxBoard,
            "numberOfMoves": numberOfMoves + this.countNotEmpty(auxBoard) / 2 // Estimate the number of moves left otherwise + the moves already taken so far
        };
    }

    // Used in heuristic 3 as part of the node's search/estimation of moves left to solve the board
    hintsEvaluate2(auxBoard) {
        let validMove = getFirstValidMove(auxBoard);

        // Apply valid moves iteratively
        while(validMove != null) {
            applyMove(auxBoard, validMove); // Already modifies original auxBoard
            validMove = getFirstValidMove(auxBoard);
        }

        // When a solution is found
        if(this.boardEmpty(auxBoard)) {
            return {
                "finalBoard": auxBoard,
                "numberOfMoves": 0
            };
        }

        return {
            "finalBoard": auxBoard,
            "numberOfMoves": this.countNotEmpty(auxBoard) / 2 // Estimate the number of moves left otherwise
        };
    }

    // Checks if the board is empty (reached final state)
    boardEmpty(board) {
        for (let y = 0; y < board.length; ++y)
            for (let x = 0; x < board[y].length; ++x)
                if (board[y][x] != 0) return false;

        return true;
    }
    
    // Counts the number of empty cells in the booard
    countEmpty(board) {
        let count = 0;
        for (let y = 0; y < board.length; ++y)
            for (let x = 0; x < board[y].length; ++x)
                if (board[y][x] == 0) count++;
            
        return count;
    }

    // Heuristic function 1
    evaluateMove() {
        // Hints
        let st1CB = cloneBoard(this.board);
        let nH_1 = this.hintsEvaluate(st1CB).numberOfMoves;

        // Hints + Deal + Hints
        let st2CB = cloneBoard(this.board);
        let hints_st2_1 = this.hintsEvaluate(st2CB);
        let hints_st2_2 = this.hintsEvaluate(deal(hints_st2_1.finalBoard));
        let nH_2;
        if(this.boardEmpty(hints_st2_2.finalBoard))
            nH_2 = 0;
        else
            nH_2 = hints_st2_1.numberOfMoves + 1 + hints_st2_2.numberOfMoves;

        // Deal + Hints
        let st3CB = cloneBoard(this.board);
        let nH_3 = this.hintsEvaluate(deal(st3CB)).numberOfMoves;

        let minHeuristic = Math.min(nH_1, nH_2, nH_3);
        if(minHeuristic == 0)
            return -this.currentDepth; // Because we want him to select the one with higher depth when it finds a solution
        return minHeuristic;
    }

    // Heuristic function 2
    evaluateMove2() {
        let board = cloneBoard(this.board);
        let numberOfMoves = getValidMoves(board).length;

        // number of full cells
        let currentCells = board.length * 9 - this.countEmpty(board) - numberOfMoves*2; 

        // Expected number of moves in the future + number of current valid moves
        return currentCells/2 + numberOfMoves;
    }

    // Heuristic function 3
    evaluateMove3() {
        // Hints
        let st1CB = cloneBoard(this.board);
        let nH_1 = this.hintsEvaluate2(st1CB).numberOfMoves;

        // Hints + Deal + Hints
        let st2CB = cloneBoard(this.board);
        let hints_st2_1 = this.hintsEvaluate2(st2CB);
        let hints_st2_2 = this.hintsEvaluate2(deal(hints_st2_1.finalBoard));
        let nH_2;
        if(this.boardEmpty(hints_st2_2.finalBoard))
            nH_2 = 0;
        else
            nH_2 = hints_st2_2.numberOfMoves;

        // Deal + Hints
        let st3CB = cloneBoard(this.board);
        let nH_3 = this.hintsEvaluate2(deal(st3CB)).numberOfMoves;

        let minHeuristic = Math.min(nH_1, nH_2, nH_3);
        if(minHeuristic == 0)
            return -this.currentDepth; // Because we want him to select the one with higher depth when it finds a solution
        return minHeuristic;
    }

    // Heuristic function 4
    evaluateMove4() {
        let board = cloneBoard(this.board);
        let cellValues = getRemainingCells(board);
        let ocur = countOccurrences(cellValues); // number of occurences of all numbers in the board
        let result = 0;
        let combs = [[1,9], [2,8], [3,7], [4,6]]; // possible matching combinations (excluding 5)
        let willDeal = false; // if true, a deal move is necessary (there are unmatched cells)

        for(let i = 0; i < combs.length; ++i) { 
            if(Math.min(ocur[combs[i][0]], ocur[combs[i][1]]) == ocur[combs[i][0]]) {
                
                let dif = ocur[combs[i][1]] - ocur[combs[i][0]];
                if(dif > 0) { // there are dif numbers that can only be matched with its equals
                    result += Math.floor(dif/2); // number of matches possible with the cells in dif

                    //if dif is not even, a cell is unmatched and another move and a deal is necessary
                    if(dif % 2 != 0) {
                        result += 1;
                        willDeal = true;
                    }
                }
                // if combs[i][0] is the minimum, then it is the number of
                // combs[i][0] - combs[i][1] matches possible in the board 
                // and it is added to the result
                result += ocur[combs[i][0]];
            } else { //same as above but the minimum is the second element
                let dif = ocur[combs[i][0]] - ocur[combs[i][1]];
                if(dif > 0) {
                    result += Math.floor(dif/2);
                    if(dif % 2 != 0) {
                        result += 1;
                        willDeal = true;
                    }
                }
                result += ocur[combs[i][1]];
            }
            
        }
        // checks if there are unmatched '5' cells and adds to the result, and deal becomes necessary
        if(ocur[5] % 2 != 0) {
            result += Math.floor(ocur[5]/2) + 1;
            willDeal = true;
        }

        // if a deal move is necessary, add 1 to the result, as deal counts as a move
        result += willDeal ? 1 : 0;
        
        return result;
    }

}


// creates a copy of the board (matrix)
function cloneBoard(board) {
    let auxBoard = [];
    for (let i = 0; i < board.length; ++i)
        auxBoard[i] = board[i].slice();
    
    return auxBoard;
}

// Returns true if the given board represents a final state of the game
function checkFinalState(board) {
    for (let y = 0; y < board.length; ++y) {
        for (let x = 0; x < board[0].length; ++x) {
            if (board[y][x] != 0)
                return false;
        }
    }
    return true;
}

// Returns all the valid moves in a given board state
function getValidMoves(board) {
    let moves = [];
    for (let y = 0; y < board.length; ++y) {
        for (let x = 0; x < 9; ++x) {
            if (board[y][x] != 0)
                moves.push(...getValidMovesCell(board, x, y));
        }
    }
    return moves;
}

// Gets the first valid move of the board
function getFirstValidMove(board) {
    let moves = [];
    for (let y = 0; y < board.length; ++y) {
        for (let x = 0; x < 9; ++x) {
            if (board[y][x] != 0) {
                moves.push(...getValidMovesCell(board, x, y));
                if(moves.length != 0)
                    return moves[0];
            }
        }
    }
    return null;
}

// Gets all the valid moves for a given cell
function getValidMovesCell(board, x, y) {
    let moves = [];
    let initX = x;
    let initY = y;
    let n = board[y][x];

    if (++y < board.length) {
        do {
            // Columns
            if (board[y][x] == n || board[y][x] + n == 10) {
                moves.push(
                    new Move(new Position(initX, initY), new Position(x, y), board[initY][initX], board[y][x])
                );
                break;
            } else if (board[y][x] == 0) continue;
            else break;
        } while (++y < board.length);
    }

    y = initY;

    let checkLines = true;

    if (x == 8) {
        x = 0;
        if (y + 1 < board.length)
            y++;
        else checkLines = false;

    } else x++;

    if(checkLines) {
        do {
            // Lines
            if (board[y][x] == n || board[y][x] + n == 10) {
                moves.push(
                    new Move(new Position(initX, initY), new Position(x, y), board[initY][initX], board[y][x])
                );
                break;
            } else if (board[y][x] == 0) {
                // Line Break with zeros
                if (x == 8) {
                    x = -1;
                    y++;
                }
                continue;
            } else break;
        } while (++x < board[0].length && y < board.length);
    }

    return moves;
}

// Applies a given move to a board and returns the new board state. 
// If the move is not valid, the board is not changed
function applyMove(board, move) {
    let x1 = move.p1.x;
    let y1 = move.p1.y;
    let x2 = move.p2.x;
    let y2 = move.p2.y;

    if(board[y1][x1] != 0 && board[y2][x2] != 0) {
        board[y1][x1] = 0;
        board[y2][x2] = 0;
    }

    return board;
}

// Duplicates the current board
function deal(board0) { 

    let board = cloneBoard(board0);

    let currentHeight = board.length;
    let toAdd = [], row = [];

    for(let y = 0; y < currentHeight; ++y) {
        for(let x = 0; x < board[0].length; ++x) {
            if(board[y][x] != 0) {
                row.push(board[y][x]);
                if(row.length == board[0].length) {
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

    board.push(...toAdd);

    return board;
}

// Given a board state, returns an array containing all the values of its non-empty cells
// in order with possible repetition
function getRemainingCells(board) {

    let remaining = [];

    for(let y = 0; y < board.length; ++y) {
        for(let x = 0; x < board[0].length; ++x) {
            if(board[y][x] != 0) {
                remaining.push(board[y][x]);
            }
        }
    }

    return remaining;
}

// Given an array with numbers, returns a dictionary with the number of occurrences of the
// integers from 1 to 9 in that array. For example, countOccurrences([1,2,1,3,1])[1] == 3
function countOccurrences(values) {
    let ocur = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0};

    for(let i = 0; i < values.length; ++i) {
        ocur[values[i]]++;
    }

    return ocur;
}