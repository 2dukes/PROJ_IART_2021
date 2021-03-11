class Node {
    constructor(id, move, parent, state, currentDepth) {
        this.id = id;
        this.move = move;
        this.parent = parent;
        this.state = state;
        this.currentDepth = currentDepth;
    }
    
    getChildren() {
        let xLen = this.state[0].length;
        let yLen = this.state.length;
        let x = 0, y = 0;
        for (x = 0; x < xLen; x++) {
            let rightElem = this.state.getRightElement(x, y);
            let bottomElem = this.state.getBottomElement(x, y);   
        }
    }
}

// [[1,2,3,4,5,6,7,8,9],
// [1,1,1,2,1,3,1,4,1],
// [5,1,6,1,7,1,8,1,9]]