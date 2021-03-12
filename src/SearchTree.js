class SearchTree {
    constructor(initialBoard) {
        this.nodes = [];
        let root = new Node(null, null, 0, initialBoard);
        
        root.expand()[0].expand()[0].expand();


    }
}
