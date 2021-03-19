class SearchTree {
    constructor(initialBoard) {
        this.initialBoard = initialBoard;
    }

    run(method) {
        switch(method) {
            case "dfs":
                this.result = this.dfs(new Node(null, null, 0, this.initialBoard, 0), null);
                break;
            case "bfs":
                this.result = this.bfs(new Node(null, null, 0, this.initialBoard, 0));
                break;
            case "iterative":
                this.result = this.iterativeDeepening(new Node(null, null, 0, this.initialBoard, 0));
                break;
            case "greedy":
                this.result = this.greedy(new Node(null, null, 0, this.initialBoard, 0));
                break;
            case "a_star":
                this.result = this.a_star(new Node(null, null, 0, this.initialBoard, 0));
                break;  
        }
        return this.buildSolution(this.result);
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
        let visitedBoards = [];
        
        let queue = new PriorityQueue();
        queue.enqueue(root, root.heuristic);

        let t0 = performance.now();
        let timeout = 20000;

        while(queue.items.length > 0 && (performance.now() - t0) < timeout) {

            let newNode = queue.dequeue().element;

            if(this.checkAlreadyVisited(visitedBoards, newNode.board.toString())) {
                console.log("Already visited");
                continue;
            }
            if(newNode.reachedFinalState) {
                console.log("Found a solution:");
                console.log(this.buildSolution(newNode));

                return newNode;
            }

            visitedBoards.push(newNode.board.toString());
            
            let children = newNode.expand();

            for (let i = 0; i < children.length; ++i) {
                queue.enqueue(children[i], children[i].heuristic);
            }
                
        }
        throw "Solution not Found!";
    }

    a_star(root) {
        let queue = new PriorityQueue();
        queue.enqueue(root, root.heuristic); // distance on root is 0
        let count = 0;

        let t0 = performance.now();
        let timeout = 20000;

        while(queue.items.length > 0 && (performance.now() - t0) < timeout) {

            let newNode = queue.dequeue().element;

            if(newNode.reachedFinalState) {
                console.log("Found a solution:");
                console.log(this.buildSolution(newNode));
                return newNode;
            }

            let children = newNode.expand();

            for (let i = 0; i < children.length; ++i)
                queue.enqueue(children[i], children[i].heuristic + children[i].currentDepth);
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

        let t0 = performance.now();
        let timeout = 20000;

        while(result == -1 && (performance.now() - t0) < timeout) {
            result = this.dfs(root, depth);
            console.log("Depth: " + depth);
            depth++;
        }

        return result;
    }

    dfs(root, limit) {
        let visitedBoards = [];
        let queue = [root];

        let t0 = performance.now();
        let timeout = 20000;
        
        while(queue.length != 0 && (performance.now() - t0) < timeout) {
            let newNode = queue.shift();
            if(this.checkAlreadyVisited(visitedBoards, newNode.board.toString())) {
                console.log("Already visited");
                continue;
            }
            if(newNode.reachedFinalState) {
                console.log("Found a solution:");
                console.log(this.buildSolution(newNode));
                return newNode;
            }
            
            if(newNode.currentDepth < limit || limit == null) {
                visitedBoards.push(newNode.board.toString());
                
                let children = newNode.expand();
                queue.unshift(...children);
            }
        }

        return -1;
    }

    dfsWithPriority(root, limit) {
        let visitedBoards = [];

        let queue = new PriorityQueue();
        queue.enqueue(root, root.heuristic);
        
        let t0 = performance.now();
        let timeout = 20000;
        
        while(queue.length != 0 && (performance.now() - t0) < timeout) {

            let newNode = queue.dequeueRear().element;

            if(this.checkAlreadyVisited(visitedBoards, newNode.board.toString())) {
                console.log("Already visited");
                continue;
            }
            if(newNode.reachedFinalState) {
                console.log("Found a solution:");
                console.log(this.buildSolution(newNode));
                return newNode;
            }
            
            if(newNode.currentDepth < limit || limit == null) {
                visitedBoards.push(newNode.board.toString());
                
                let children = newNode.expand();

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

        let t0 = performance.now();
        let timeout = 20000;
        
        while(queue.length != 0 && (performance.now() - t0) < timeout) {
            let newNode = queue.shift();

            if(this.checkAlreadyVisited(visitedBoards, newNode.board.toString())) {
                console.log("Already visited");
                continue;
            }
            if(newNode.reachedFinalState) {
                console.log("Found a solution:");
                console.log(this.buildSolution(newNode));
                return newNode;
            }

            visitedBoards.push(newNode.board);
            
            let children = newNode.expand();
            queue.push(...children);
        }

        console.log('Could not find a solution');
    }

    checkAlreadyVisited(visitedBoards, board) {
        for (let i = 0; i < visitedBoards; ++i) {
            if(visitedBoards[i] === board)
                return true;
        }
        return false;
    }
}

