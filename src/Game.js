
class Game {
    constructor() {
        this.board = new Board(this);
        console.log("Starting game...");
        
        this.state = 0; // 0 - choose first cell, 1 - choose second cell

        this.firstX = -1;
        this.firstY = -1;
    }

    run() {
        var t0 = performance.now();
        console.log(this.board.getValidMoves());
        var t1 = performance.now();
        console.log("Call to function took " + (t1 - t0) + " milliseconds.");
    }

    handleCellClick(event) {
/*       t  if (event.target.style.backgroundColor == "#666666")
            event.target.style.backgroundColor = "#171717";
        else
            event.target.syle.backgroundColor = "#666666"; */

        if(event.target.innerHTML != 0) {
            if(this.state == 0) {
                this.state = 1;
                event.target.style.backgroundColor = "#666666";
                let xAndY = event.target.id.split('c');
                this.firstY = parseInt(xAndY[0]);
                this.firstX = parseInt(xAndY[1]);

            } else {
                let x, y;
                let xAndY = event.target.id.split('c');
                y = parseInt(xAndY[0]); 
                x = parseInt(xAndY[1]);

                if(x == this.firstX && y == this.firstY) {
                    this.state = 0;
                    event.target.style.backgroundColor = "#171717";
                    return;
                }

                if(this.board.handleCellOrder(this.firstX, this.firstY, x, y)) {
                    this.state = 0;
                    this.board.emptyCell(x,y);
                    this.board.emptyCell(this.firstX, this.firstY);
                }
            }
        }
	}

}	
