const MAX_DEALS = 1;
const MAX_DEPTH = 1000;

let totalDeals = 0;

class Node {
    constructor(move, parent, currentDepth, board, usedDeals, usedHeuristic) {
        // this.id = id;
        this.move = move;
        this.parent = parent;
        this.currentDepth = currentDepth;
        this.board = [...board];

        this.reachedFinalState = checkFinalState(this.board);

        this.usedDeals = usedDeals;

        // this.validMoves = getValidMoves(this.board);

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
                console.log("Invalid heuristic!");
        }

        this.usedHeuristic = usedHeuristic;

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

        let validMoves = getValidMoves(this.board);

        for(let i = 0; i < validMoves.length; ++i) {
            let newBoard = [];

            // Clone board
            for (let j = 0; j < this.board.length; ++j)
                newBoard[j] = this.board[j].slice();
            
            let newNode = new Node(validMoves[i], this, this.currentDepth + 1, applyMove(newBoard, validMoves[i]),this.usedDeals, this.usedHeuristic);
            children.push(newNode);
        }

        let boardDealNode = deal(this.board);
        children.push(new Node(null, this, this.currentDepth + 1, boardDealNode, this.usedDeals + 1, this.usedHeuristic));

        

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
        let numberOfMoves = 0;
        let validMove = getFirstValidMove(auxBoard);

        while(validMove != null) {
            numberOfMoves++;
            applyMove(auxBoard, validMove); // Already modifies original auxBoard
            validMove = getFirstValidMove(auxBoard);
        }

        if(this.boardEmpty(auxBoard)) 
            numberOfMoves = 0;

        return {
            // "notEmptyCell": this.countNotEmpty(auxBoard),
            "finalBoard": auxBoard,
            "numberOfMoves": numberOfMoves + this.countNotEmpty(auxBoard) / 2
        };
    }

    hintsEvaluate2(auxBoard) {
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
            nH_2 = hints_st2_1.numberOfMoves + 1 + hints_st2_2.numberOfMoves;

        // Deal + Hints
        let st3CB = this.cloneBoard();
        let nH_3 = this.hintsEvaluate(deal(st3CB)).numberOfMoves;

        let minHeuristic = Math.min(nH_1, nH_2, nH_3);
        if(minHeuristic == 0)
            return -this.currentDepth; // Because we want him to select the one with higher depth when it finds a solution
        return minHeuristic;
    }

    evaluateMove2() {
        let board = this.cloneBoard();
        let numberOfMoves = getValidMoves(board).length;

        let currentCells = board.length * 9 - this.countEmpty(board) - numberOfMoves*2;  

        return currentCells/2 + numberOfMoves;
    }

    evaluateMove3() {
        // Hints
        let st1CB = this.cloneBoard();
        let nH_1 = this.hintsEvaluate2(st1CB).numberOfMoves;

        // Hints + Deal + Hints
        let st2CB = this.cloneBoard();
        let hints_st2_1 = this.hintsEvaluate2(st2CB);
        let hints_st2_2 = this.hintsEvaluate2(deal(hints_st2_1.finalBoard));
        let nH_2;
        if(this.boardEmpty(hints_st2_2.finalBoard))
            nH_2 = 0;
        else
            nH_2 = hints_st2_2.numberOfMoves;

        // Deal + Hints
        let st3CB = this.cloneBoard();
        let nH_3 = this.hintsEvaluate2(deal(st3CB)).numberOfMoves;

        let minHeuristic = Math.min(nH_1, nH_2, nH_3);
        if(minHeuristic == 0)
            return -this.currentDepth; // Because we want him to select the one with higher depth when it finds a solution
        return minHeuristic;
    }

    // evaluateMove4() {
    //     let board = this.cloneBoard();
    //     let validMoves = getValidMoves(board)
    //     let numberOfMoves = validMoves.length;

    //     // let remainingCells = board.length * 9 - this.countEmpty(board) - numberOfMoves*2;  

    //     let remainingBoard = applyMoves(this.cloneBoard(), validMoves);
    //     let remainingValues = getRemainingCells(remainingBoard);

    //     let result = 0;
    //     let willDeal = false;

    //     let removedDuplicates = [...new Set(remainingValues)];
    //     let rest = remainingValues.length.length - removedDuplicates.length;
    //     if(rest != removedDuplicates.length) { //n deu match igual de todos os restantes
    //         let ocur = countOccurrences(remainingValues);
    //         if(ocur[1] != ocur[9]) {
    //             if(ocur[1] > 0 && ocur[9] > 0) {
    //                 if(ocur[1] % 2 != 0 || ocur[9] % 2 != 0) {
    //                     result += 1;
    //                     willDeal = true;
    //                 }
    //             }
    //         }
    //         if(ocur[2] != ocur[8]) {
    //             if(ocur[2] > 0 && ocur[8] > 0) {
    //                 if(ocur[2] % 2 != 0 || ocur[8] % 2 != 0) {
    //                     result += 1;
    //                     willDeal = true;
    //                 }
    //             }
    //         }
    //         if(ocur[3] != ocur[7]) {
    //             if(ocur[3] > 0 && ocur[7] > 0) {
    //                 if(ocur[3] % 2 != 0 || ocur[7] % 2 != 0) {
    //                     result += 1;
    //                     willDeal = true;
    //                 }
    //             }
    //         }
    //         if(ocur[4] != ocur[6]) {
    //             if(ocur[4] > 0 && ocur[6] > 0) {
    //                 if(ocur[4] % 2 != 0 || ocur[6] % 2 != 0) {
    //                     result += 1;
    //                     willDeal = true;
    //                 }
    //             }
    //         }
    //         if(ocur[5] % 2 != 0) {
    //             result += 1;
    //             // willDeal = true;
    //         }
    //     } else {

    //     }

    //     if(remainingValues.length % 2 != 0) {
    //         result += Math.floor(remainingValues.length/2) + (willDeal ? 2 : 1);
    //     } else {
    //         result += remainingValues.length/2 + numberOfMoves;
    //     }
    //     // console.log(result, this.move);
    //     return result;
    // }

    evaluateMove4() {
        let board = this.cloneBoard();
        let cellValues = getRemainingCells(board);
        let ocur = countOccurrences(cellValues);
        let result = 0;
        let combs = [[1,9], [2,8], [3,7], [4,6]];
        let willDeal = false;

        for(let i = 0; i < combs.length; ++i) { 
            if(Math.min([ocur[combs[i][0]], ocur[combs[i][1]]]) == ocur[combs[i][0]]) {
                let dif = ocur[combs[i][1]] - ocur[combs[i][0]];
                if(dif > 0) {
                    result += Math.floor(dif/2);
                    if(dif % 2 != 0) {
                        result += 1;
                        willDeal = true;
                    }
                }
                result += ocur[combs[i][0]];
            } else {
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
        if(ocur[5] % 2 != 0) {
            result += Math.floor(ocur[5]/2) + 1;
            willDeal = true;
        }
        result += willDeal ? 1 : 0;
        // console.log(result, this.move)
        return result;

        // if(Math.min([ocur[1], ocur[9]]) == ocur[1]) {
        //     let dif = ocur[9] - ocur[1];
        //     if(dif > 0) {
        //         if(dif % 2 != 0) {
        //             result += Math.floor(dif/2) + 1;
        //         }
        //     }
        //     result += ocur[1];
        // } else {
        //     let dif = ocur[1] - ocur[9];
        //     if(dif > 0) {
        //         if(dif % 2 != 0) {
        //             result += Math.floor(dif/2) + 1;
        //         }
        //     }
        //     result += ocur[9];
        // }
    }
    
    countEmpty(board) {
        let count = 0;
        for (let y = 0; y < board.length; ++y)
            for (let x = 0; x < board[y].length; ++x)
                if (board[y][x] == 0) count++;
            
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

function applyMoves(board, moves) {
    for(let i = 0; i < moves.length; ++i) {
        board = applyMove(board, moves[i]);
    }

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

function countOccurrences(values) {
    let ocur = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0};

    for(let i = 0; i < values.length; ++i) {
        ocur[values[i]]++;
    }

    return ocur;
}