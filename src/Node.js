class Node {
    constructor(id, move, parent, state, currentDepth, board) {
        this.id = id;
        this.move = move;
        this.parent = parent;
        this.state = state;
        this.currentDepth = currentDepth;
        this.board = [...board];
    }
}

// [[1,2,3,4,5,6,7,8,9],
// [1,1,1,2,1,3,1,4,1],
// [5,1,6,1,7,1,8,1,9]]