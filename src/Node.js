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
        this.heuristic = this.evaluateMove(this.validMoves);
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

        if (this.usedDeals < MAX_DEALS) {
            console.log("Using deal...");
            let boardDealNode = deal(this.board);
            //totalDeals++;
            children.push(new Node(null, this, this.currentDepth + 1, boardDealNode, this.usedDeals + 1));
        } 

        for(let i = 0; i < this.validMoves.length; ++i) {
            let newBoard = [];

            // Clone board
            for (let j = 0; j < this.board.length; ++j)
                newBoard[j] = this.board[j].slice();
            
            let newNode = new Node(this.validMoves[i], this, this.currentDepth + 1, applyMove(newBoard, this.validMoves[i]),this.usedDeals);
            children.push(newNode);
        }
       
        
        return children;
    }

    evaluateMove(moves) {
        // Deals case

        

        // if (this.move == null) {
            
        //     if (this.parent == null) return 10;
        //     if (this.parent.validMoves.length == 0)
        //         return -10;

        //     // console.log("hello");
        //     if (this.checkExistsVerticalMatchesOrSumTenPairs(moves)) {
        //         // console.log('hello again :)');
        //         return this.currentDepth + 5;
        //     }
        //     else return -1;
        // }

        // let score = 0; // minor score -> better solution 
        // if(this.parent != null) {
        //     if (this.move.startNumber + this.move.endNumber == 10) { // sum = 10 first 
        //         if (this.move.p1.x == this.move.p2.x) // vertical matches first
        //             score += 0;
        //         else if (this.move.p1.y == this.move.p2.y) // horizontal matches last
        //             score += 2;
        //     }   
        //     else if (this.move.startNumber == this.move.endNumber) { // same digits last
        //         if (this.move.p1.x == this.move.p2.x) // vertical matches first
        //             score += 3;
        //         else if (this.move.p1.y == this.move.p2.y) // horizontal matches last
        //             score += 4;
        //     }
        // }

        let score = 0;
        
        let numCells = this.board.length * this.board[0].length;
        let percentageEmpty =  this.countEmpty() / numCells;
        score += percentageEmpty * (1 / this.currentDepth);

        return score;
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

