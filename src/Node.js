
const MAX_DEALS = 0;
const MAX_DEPTH = 100;

class Node {
    constructor(move, parent, currentDepth, board, usedDeals) {
        // this.id = id;
        this.move = move;
        this.parent = parent;
        this.currentDepth = currentDepth;
        this.board = [...board];

        this.state = checkFinalState(this.board);

        this.visited = false;

        this.usedDeals = usedDeals;

    }

    expand() {

        if (this.currentDepth > MAX_DEPTH) {
            console.log("Max Depth exceeded!");
            return []; 
        }

        let children = [];
        let validMoves = getValidMoves(this.board);

        if (validMoves.length == 0) { // use deal when there are no more solutions
            if (this.usedDeals < MAX_DEALS) {
                console.log("No more solutions now... Using deal...");
                let newBoard = deal(this.board);
                children.push(new Node(null, this, this.currentDepth + 1, newBoard,this.usedDeals+1));
            }
        }

        // use deal in the root node (we need to remove this)
        if (this.parent == null) {
            let newBoard = deal(this.board);
            children.push(new Node(null, this, this.currentDepth + 1, newBoard,this.usedDeals+1));
        }
        

        for(let i = 0; i < validMoves.length; ++i) {

            let newBoard = [];

            // Clone board
            for (let j = 0; j < this.board.length; ++j)
                newBoard[j] = this.board[j].slice();
            
            let newNode = new Node(validMoves[i], this, this.currentDepth + 1, applyMove(newBoard, validMoves[i]),this.usedDeals);
            children.push(newNode);

            if (this.usedDeals < MAX_DEALS) {
                console.log("Using deal...");
                let newBoard = deal(this.board);
                children.push(new Node(null, this, this.currentDepth + 1, newBoard,this.usedDeals+1));
            }
        }
        
        return children;
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
                    new Move(new Position(initX, initY), new Position(x, y))
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
                    new Move(new Position(initX, initY), new Position(x, y))
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
    if (board1.length !== board2.length) return false;

    for (let i = 0; i < board1.length; ++i)
        if (board1[i] !== board2[i]) return false;
    
    return true;
}

function checkEqualNodes(node1, node2) {

    if (node1.move.equals(node2.move) && checkEqualBoards(node1.board, node2.board))
        return true;

    return false;
}


function deal(board0) {

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

