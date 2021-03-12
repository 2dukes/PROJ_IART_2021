class SearchTree {
    constructor(initialBoard) {
        this.queue = [new Node(null, null, 0, initialBoard)];
        this.visitedNodes = [...this.queue];
        
        //root.expand()[0].expand()[0].expand()[0].expand()[0].expand()[0].expand()[0];

        this.numDeals = 0;
        
        //this.bfs();

        this.result = this.dfs(new Node(null, null, 0, initialBoard));

        if (this.result == null)
            console.log("Could not find a solution!");

    }

    dfs(curr) {
        if (curr.state) {
            console.log("Found a solution");
            return curr;
        }

        let children;
        if (this.numDeals++ < 1) {
            children = curr.expand(true);
        } 
        else {
            children = curr.expand(false);
        }

        for (let i = 0; i < children.length; ++i) {
            let result = this.dfs(children[i]);
            if (result != null) return result;
        }

        return null;

    }

    bfs() {
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
    }



    checkIfNodeWasVisited(node) {
        for (let i = 0; i < this.queue; ++i) {
            if (checkEqualNodes(node, this.visitedNodes[i]))
                return true;
        }
        return false;
    }

    

}
