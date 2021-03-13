class SearchTree {
    constructor(initialBoard) {
        /* this.queue = [new Node(null, null, 0, initialBoard)];
        this.visitedNodes = [...this.queue]; */
        
        //root.expand()[0].expand()[0].expand()[0].expand()[0].expand()[0].expand()[0];

        //this.bfs();

        // this.visitedNodes = [];

        this.queue = [];

        //this.result = this.dfs(new Node(null, null, 0, initialBoard, 0));
        this.result = this.bfs(new Node(null, null, 0, initialBoard, 0));

        if (this.result == null)
            console.log("Could not find a solution!");

    }

    // dfs(node, path, visitedNodes) {
    //     if(this.checkAlreadyVisited(visitedNodes, node.board)) {
    //         console.log("Already visited");
    //         return null;
    //     }

    //     visitedNodes.push(node.board);
    //     path.push([node.move, node.board]);

    //     if (node.reachedFinalState) {
    //         console.log("Found a solution:");
    //         console.log(path);
    //         console.log("The solution has " + this.countNumMoves(path) + " moves and used " + this.countNumDeals(path) + " deals");
    //         return node;
    //     }

    //     let children = node.expand();

    //     for (let i = 0; i < children.length; ++i) { // we need to check if the node was already visited
    //         let result = this.dfs(children[i], path, visitedNodes);
    //         if (result != null) return result;
    //         // console.log('.');
    //     }

    //     path.pop();

    //     return null;
    // }
    
    buildSolution(node) {
        let solution = [node];
        while(node.parent != null) {
            node = node.parent;
            solution.unshift(node);
        }
        return solution;
    }

    dfs(root) {
        let visitedBoards = [];
        let queue = [root];
        // let board = root.board;
        // queue.push(node);
        
        while(queue.length != 0) {
            let newNode = queue.shift();
            if(this.checkAlreadyVisited(visitedBoards, newNode.board)) {
                console.log("Already visited");
                continue;
            }
            if(newNode.reachedFinalState) {
                console.log("Found a solution:");
                console.log(this.buildSolution(newNode));
                // console.log(path);
                // console.log("The solution has " + this.countNumMoves(path) + " moves and used " + this.countNumDeals(path) + " deals");
                return newNode;
            }
            
            visitedBoards.push(newNode.board);
            
            let children = newNode.expand();
            queue.unshift(...children);
        }

        console.log('Could not find a solution');
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


function bfs( start ) {
    var listToExplore = [ start ];

    nodes[ start ].visited = true;

    while ( listToExplore.length > 0 ) {
        var nodeIndex = listToExplore.shift();
        nodes[ nodeIndex ].links.forEach( function( childIndex ) {
            if ( !nodes[ childIndex ].visited ) {
                nodes[ childIndex ].visited = true;
                listToExplore.push( childIndex );
            }
        } );
    }
};



    bfs(root) {
        let visitedBoards = [];
        let queue = [root];
        // let board = root.board;
        // queue.push(node);
        
        while(queue.length != 0) {
            let newNode = queue.shift();
            console.log(newNode.currentDepth);
            if(this.checkAlreadyVisited(visitedBoards, newNode.board)) {
                console.log("Already visited");
                continue;
            }
            if(newNode.reachedFinalState) {
                console.log("Found a solution:");
                console.log(this.buildSolution(newNode));
                // console.log(path);
                // console.log("The solution has " + this.countNumMoves(path) + " moves and used " + this.countNumDeals(path) + " deals");
                return newNode;
            }

            visitedBoards.push(newNode.board);
            
            let children = newNode.expand();
            queue.push(...children);
        }

        console.log('Could not find a solution');
    }

    // bfs() {
    //     while(this.queue.length) {
    //         let curr = this.queue.shift();
    //         curr.visited = true;
    //         this.visitedNodes.push(curr);

    //         console.log(curr.move);

    //         if (curr.state) {
    //             console.log("Found a solution");
    //             return;
    //         }

    //         let toVisit;
    //         if (this.numDeals++ < 2) {
    //             toVisit = curr.expand(true);
    //         } 
    //         else {
    //             toVisit = curr.expand(false);
    //         }
            
    //         for (let i = 0; i < toVisit.length; ++i) {
    //             if (!this.checkIfNodeWasVisited(toVisit[i])) {
    //                 this.queue.push(toVisit[i]);
    //             }
    //         }

    //         this.queue.shift();
            
    //     }

    //     console.log("Could not find a solution");
    // }  



    /* checkIfNodeWasVisited(node) {
        for (let i = 0; i < this.queue; ++i) {
            if (checkEqualNodes(node, this.visitedNodes[i]))
                return true;
        }
        return false;
    } */

    checkAlreadyVisited(visitedBoards, board) {
        for (let i = 0; i < this.visitedBoards; ++i)
            if (checkEqualBoards(board, visitedBoards[i]))
                return true;

        return false;
    }

    

}
