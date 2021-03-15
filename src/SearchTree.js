class SearchTree {
    constructor(initialBoard) {
        /* this.queue = [new Node(null, null, 0, initialBoard)];
        this.visitedNodes = [...this.queue]; */
        
        //root.expand()[0].expand()[0].expand()[0].expand()[0].expand()[0].expand()[0];

        //this.bfs();

        // this.visitedNodes = [];

        this.queue = [];

        // this.result = this.dfs(new Node(null, null, 0, initialBoard, 0), null);
        // this.result = this.bfs(new Node(null, null, 0, initialBoard, 0));
        // this.result = this.iterativeDeepening(new Node(null, null, 0, initialBoard, 0));
        this.result = this.greedy(new Node(null, null, 0, initialBoard, 0));
        
        //this.result = this.dfsWithPriority(new Node(null, null, 0, initialBoard, 0), null);
        

        if (this.result == -1)
            console.log("Could not find a solution!");
        else
            console.log('Yeah boy!' + this.result);
    }
    
    buildSolution(node) {
        let solution = [node];
        while(node.parent != null) {
            node = node.parent;
            solution.unshift(node);
        }
        return solution;
    }

    greedy(root) {
        // let visitedBoards = [];
        //let queue = [root];
        
        let queue = new PriorityQueue();
        queue.enqueue(root, root.heuristic);
        let totalMoves = 0;

        while(queue.length != 1) {
            //let newNode = chooseBestChild(queue);
            let newNode = queue.dequeueRear().element;
            totalMoves++;
            // console.log(newNode);

            // if(this.checkAlreadyVisited(visitedBoards, newNode.board.toString())) {
            //     console.log("Already visited");
            //     continue;
            // }
            if(newNode.reachedFinalState) {
                console.log("Found a solution:");
                console.log(this.buildSolution(newNode));
                // console.log(path);
                // console.log("The solution has " + this.countNumMoves(path) + " moves and used " + this.countNumDeals(path) + " deals");
                return newNode;
            }

            // visitedBoards.push(newNode.board.toString());
            
            let children = newNode.expand();

            for (let i = 0; i < children.length; ++i)
                queue.enqueue(children[i], children[i].heuristic);
        }
    }

    chooseBestChild(nodes) {
        let bestChild;
        bestChild.heuristic = Number.MAX_VALUE;
        for (let i = 0; i < nodes.length; ++i) 
            if (nodes[i].heuristic < bestChild)
                bestChild = nodes[i];

        return bestChild;
    }

    iterativeDeepening(root) {
        let depth = 0, result = -1;

        while(result == -1) {
            result = this.dfs(root, depth);
            console.log("Depth: " + depth);
            depth++;
        }

        return result;
    }

    dfs(root, limit) {
        let visitedBoards = [];
        let queue = [root];
        // let board = root.board;
        // queue.push(node);
        
        while(queue.length != 0) {
            let newNode = queue.shift();
            if(this.checkAlreadyVisited(visitedBoards, newNode.board.toString())) {
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
            
            if(newNode.currentDepth < limit || limit == null) {
                // console.log(newNode.currentDepth);
                visitedBoards.push(newNode.board.toString());
                
                let children = newNode.expand();
                queue.unshift(...children);
            }
        }

        return -1;
    }

    dfsWithPriority(root, limit) {
        let visitedBoards = [];
        //let queue = [root];
        // let board = root.board;
        // queue.push(node);

        let queue = new PriorityQueue();
        queue.enqueue(root, root.heuristic);
        
        while(queue.length != 0) {
            //let newNode = queue.shift();

            let newNode = queue.dequeueRear().element;

            if(this.checkAlreadyVisited(visitedBoards, newNode.board.toString())) {
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
            
            if(newNode.currentDepth < limit || limit == null) {
                // console.log(newNode.currentDepth);
                visitedBoards.push(newNode.board.toString());
                
                let children = newNode.expand();
                //queue.unshift(...children);

                for (let i = 0; i < children.length; ++i)
                    queue.enqueue(children[i], children[i].heuristic);

            }
        }

        return -1;
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


    bfs(root) {
        let visitedBoards = [];
        let queue = [root];
        // let board = root.board;
        // queue.push(node);
        
        while(queue.length != 0) {
            let newNode = queue.shift();
            // console.log(newNode.currentDepth);
            if(this.checkAlreadyVisited(visitedBoards, newNode.board.toString())) {
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

    heuristic(node) {
        return node.evaluateMove();
    }

    checkAlreadyVisited(visitedBoards, board) {
        for (let i = 0; i < visitedBoards; ++i) {
            if(visitedBoards[i] === board)
                return true;
            // if (checkEqualBoards(board, visitedBoards[i]))
            //     return true;
        }
        return false;
    }

    

}
