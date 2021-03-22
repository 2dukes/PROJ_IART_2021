const MAX_DEALS = 1;
const MAX_DEPTH = 1000;

let totalDeals = 0;

class Node {
    constructor(move, parent, currentDepth, board, usedDeals) {
        // this.id = id;
        this.move = move;
        this.parent = parent;
        this.currentDepth = currentDepth;
        this.board = [...board];

        this.reachedFinalState = checkFinalState(this.board);

        this.usedDeals = usedDeals;

        this.validMoves = getValidMoves(this.board);
        this.heuristic = this.evaluateMove();
        // console.log(this.heuristic);
        
        //if(isHeuristic) 
            
    }

    expand() {
        // console.log("Node depth: " + this.currentDepth);
        if (this.currentDepth > MAX_DEPTH) {
            console.log("Max Depth exceeded!");
            return [];
        }

        let children = [];

        // if (totalDeals < MAX_DEALS /* || this.validMoves.length == 0 */) {
        //     console.log("Using deal...");
        // let boardDealNode = deal(this.board);
        // totalDeals++;
        // children.push(new Node(null, this, this.currentDepth + 1, boardDealNode, this.usedDeals + 1));
        // } 

        // let boardDealNode = deal(this.board);
        // children.push(new Node(null, this, this.currentDepth + 1, boardDealNode, this.usedDeals + 1));

        for(let i = 0; i < this.validMoves.length; ++i) {
            let newBoard = [];

            // Clone board
            for (let j = 0; j < this.board.length; ++j)
                newBoard[j] = this.board[j].slice();
            
            let newNode = new Node(this.validMoves[i], this, this.currentDepth + 1, applyMove(newBoard, this.validMoves[i]),this.usedDeals);
            children.push(newNode);
        }

        let boardDealNode = deal(this.board);
        children.push(new Node(null, this, this.currentDepth + 1, boardDealNode, this.usedDeals + 1));

        return children;
    }

    countNotEmpty(board) {
        let count = 0;
        for (let y = 0; y < board.length; ++y)
            for (let x = 0; x < board[y].length; ++x)
                if (board[y][x] != 0) count++;
            
        return count;
    }

    hintsEvaluate(auxBoard) {
        let validMove = getFirstValidMove(auxBoard);

        while(validMove != null) {
            applyMove(auxBoard, validMove); // Already modifies original auxBoard
            validMove = getFirstValidMove(auxBoard);
        }

        if(this.boardEmpty(auxBoard)) {
            return {
                // "notEmptyCell": this.countNotEmpty(auxBoard),
                "finalBoard": auxBoard,
                "numberOfMoves": 0
            };
        }

        return {
            // "notEmptyCell": this.countNotEmpty(auxBoard),
            "finalBoard": auxBoard,
            "numberOfMoves": this.countNotEmpty(auxBoard) / 2
        };
    }

    boardEmpty(board) {
        for (let y = 0; y < board.length; ++y)
            for (let x = 0; x < board[y].length; ++x)
                if (board[y][x] != 0) return false;

        return true;
    }

    cloneBoard() {
        let auxBoard = [];
        for (let i = 0; i < this.board.length; ++i)
            auxBoard[i] = this.board[i].slice();
        
        return auxBoard;
    }

    evaluateMove() {
        // Hints
        let st1CB = this.cloneBoard();
        let nH_1 = this.hintsEvaluate(st1CB).numberOfMoves;

        // Hints + Deal + Hints
        let st2CB = this.cloneBoard();
        let hints_st2_1 = this.hintsEvaluate(st2CB);
        let hints_st2_2 = this.hintsEvaluate(deal(hints_st2_1.finalBoard));
        let nH_2;
        if(this.boardEmpty(hints_st2_2.finalBoard))
            nH_2 = 0;
        else
            nH_2 = hints_st2_2.numberOfMoves;

        // Deal + Hints
        let st3CB = this.cloneBoard();
        let nH_3 = this.hintsEvaluate(deal(st3CB)).numberOfMoves;

        let minHeuristic = Math.min(nH_1, nH_2, nH_3);
        if(minHeuristic == 0)
            return -this.currentDepth; // Because we want him to select the one with higher depth when it finds a solution
        return minHeuristic;
    }

    countEmpty() {
        let count = 0;
        for (let y = 0; y < this.board.length; ++y)
            for (let x = 0; x < this.board[y].length; ++x)
                if (this.board[y][x] == 0) count++;
            
        return count;
    }
    
    checkExistsVerticalMatchesOrSumTenPairs(moves) {
        for (let i = 0; i < moves.length; ++i)
            if (moves[i] != null) {
                // console.log(this.parent.board);
                // console.log(moves[i]);
                if((moves[i].startNumber + moves[i].endNumber == 10) || moves[i].p1.x == moves[i].p2.x) 
                    return true;    
            }
        return false;
    }

    getBestMove(moves) {
        //let bestMove;
        let maxNumMoves = Number.MIN_VALUE;

        let numMoves;
        for (let i = 0; i < moves.length; ++i) {

            let newBoard0 = [];

            // Clone board
            for (let j = 0; j < this.board.length; ++j)
                newBoard0[j] = this.board[j].slice();

            let newBoard = applyMove(newBoard0, moves[i]);

            numMoves = getValidMoves(newBoard).length;

            if (numMoves > maxNumMoves) {
                maxNumMoves = numMoves;
                //bestMove = moves[i];
            }
        }

        return maxNumMoves;

        //return bestMove;
    }

}


function checkFinalState(board) {
    for (let y = 0; y < board.length; ++y) {
        for (let x = 0; x < board[0].length; ++x) {
            if (board[y][x] != 0)
                return false;
        }
    }
    return true;
}

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

// [[1,2,3,4,5,6,7,8,9],
// [1,1,1,2,1,3,1,4,1],
// [5,1,6,1,7,1,8,1,9]]

function applyMove(board, move) {
    let x1 = move.p1.x;
    let y1 = move.p1.y;
    let x2 = move.p2.x;
    let y2 = move.p2.y;

    board[y1][x1] = 0;
    board[y2][x2] = 0;

    return board;
}

function checkEqualBoards(board1, board2) {
    if (board1 === board2) return true;
    if (board1 == null || board2 == null) return false;
    if (board1.length != board2.length) return false;
    
    for (let i = 0; i < board1.length; ++i) 
        for (let j = 0; j < board1[0].length; ++j) 
           if (board1[i][j] !== board2[i][j]) return false;
        
    return true;
}

function checkEqualNodes(node1, node2) {

    return checkEqualBoards(node1.board, node2.board);
}


function deal(board0) { // duplicada

    let board = [];

    // Clone board
    for (let j = 0; j < board0.length; ++j)
        board[j] = board0[j].slice();


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

