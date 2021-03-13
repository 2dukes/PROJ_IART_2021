class SearchTree {
    constructor(initialBoard) {
        /* this.queue = [new Node(null, null, 0, initialBoard)];
        this.visitedNodes = [...this.queue]; */
        
        //root.expand()[0].expand()[0].expand()[0].expand()[0].expand()[0].expand()[0];

        //this.bfs();

        this.result = this.dfs(new Node(null, null, 0, initialBoard,0),[]);

        if (this.result == null)
            console.log("Could not find a solution!");

    }

    dfs(node, path) {

        path.push([node.move, node.board]);

        if (node.state) {
            console.log("Found a solution:");
            console.log(path);
            console.log("The solution has " + this.countNumMoves(path) + " moves and used " + this.countNumDeals(path) + " deals");
            return node;
        }

        let children = node.expand();

        for (let i = 0; i < children.length; ++i) { // we need to check if the node was already visited
            let result = this.dfs(children[i],path);
            if (result != null) return result;
        }

        path.pop();

        return null;
    }

    countNumMoves(path) {
        let result = 0;
        for (let i = 0; i < path.length; ++i) {
            if (path[i][0] != null)
                result++;
        }
        return result;
    }

    countNumDeals(path) {
        let result = 0;
        for (let i = 0; i < path.length; ++i) {
            if (path[i][0] == null)
                result++;
        }
        return result - 1; // -1 because of the root node
    }

    /* bfs() {
        while(this.queue.length) {
            let curr = this.queue.shift();
            curr.visited = true;
            this.visitedNodes.push(curr);

            console.log(curr.move);

            if (curr.state) {
                console.log("Found a solution");
                return;
            }

            let toVisit;
            if (this.numDeals++ < 2) {
                toVisit = curr.expand(true);
            } 
            else {
                toVisit = curr.expand(false);
            }
            
            for (let i = 0; i < toVisit.length; ++i) {
                if (!this.checkIfNodeWasVisited(toVisit[i])) {
                    this.queue.push(toVisit[i]);
                }
            }

            this.queue.shift();
            
        }

        console.log("Could not find a solution");
    } */



    /* checkIfNodeWasVisited(node) {
        for (let i = 0; i < this.queue; ++i) {
            if (checkEqualNodes(node, this.visitedNodes[i]))
                return true;
        }
        return false;
    } */

    

}
