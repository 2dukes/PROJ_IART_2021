class Board {
    constructor() {
        this.board = [
            [1,0,0,0,0,0,0,9,0],
            [0,0,0,0,0,0,0,0,0],
            [1,0,0,0,0,0,0,9,0]
        ];
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

    // getValidMovesCell(x, y) {
    //     let moves = [];
    //     let initX = x;
    //     let initY = y;
    //     let n = this.board[y][x];
        
    //     if(++y < this.board.length) {
    //         do { // Columns
    //             if(this.board[y][x] == n || this.board[y][x] + n == 10) {
    //                 moves.push(new Move(new Position(initX, initY), new Position(x, y)));
    //                 break;
    //             }
    //             else if(this.board[y][x] == 0)
    //                 continue;
    //             else
    //                 break;
    //         } while(++y < this.board.length);
    //     }

    //     y = initY;

    //     if(x == 8) {
    //         x = 0;
    //         if(y + 1 < this.board.length)
    //             y++;
    //     }
    //     else 
    //         x++;

    //     do { // Lines
    //         if(this.board[y][x] == n || this.board[y][x] + n == 10) {
    //             moves.push(new Move(new Position(initX, initY), new Position(x, y)));
    //             break;
    //         }
    //         else if(this.board[y][x] == 0)
    //             continue;
    //         else if(x == 8) {  // Line Break
    //             x = -1;
    //             y++;
    //         }
    //         else 
    //             break;
    //     } while(++x < this.board[0].length && y < this.board.length);
       

    //     return moves;
    // }

    getValidMovesCell(x, y) {
        let moves = [];
        let n = this.board[y][x];
        let initX = x;
        let initY = y;
        let blockedBottom = false;
        let blockedSide = false;

        if(++x >= 9) {
            x = 0;
            y++;
        }

        for( ; y < this.board.length; ++y) {
            for( ; x < 9; ++x) {
                if(this.board[y][x] != 0) {
                    if(!blockedSide && !blockedBottom) {
                        if(x == initX) {
                            if(this.board[y][x] == n || this.board[y][x] + n == 10) {
                                moves.push(new Move(new Position(initX, initY), new Position(x, y)));
                            }
                            break;
                        } else {
                            if(this.board[y][x] == n || this.board[y][x] + n == 10) {
                                moves.push(new Move(new Position(initX, initY), new Position(x, y)));
                            }
                        }
                    } else if(!blockedBottom) {
                        if(x != initX)
                            continue;
                        if(this.board[y][x] == n || this.board[y][x] + n == 10) {
                            moves.push(new Move(new Position(initX, initY), new Position(x, y)));
                        }
                        blockedBottom = true;
                        break;
                    } else break;
                }
            }
            if(blockedBottom && blockedSide) {
                break;
            }
            x = 0;
        }
        return moves;
    }
}

