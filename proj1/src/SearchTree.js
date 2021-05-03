const TIMEOUT = 20000;

class SearchTree {
    constructor() {}

    // Starts the search, given the method, board and heuristic
    run(method, board, heuristic) {
        switch(method) {
            case "dfs":
                totalDeals = 0;
                this.result = this.dfs(new Node(null, null, 0, board, 0, heuristic), null);
                break;
            case "bfs":
                totalDeals = 0;
                this.result = this.bfs(new Node(null, null, 0, board, 0, heuristic));
                break;
            case "iterative":
                totalDeals = 0;
                this.result = this.iterativeDeepening(new Node(null, null, 0, board, 0, heuristic));
                break;
            case "greedy":
                this.result = this.greedy(new Node(null, null, 0, board, 0, heuristic));
                break;
            case "a_star":
                this.result = this.a_star(new Node(null, null, 0, board, 0, heuristic));
                break;  
        }
        if(this.result == -1) 
            throw "No solution found within 20s";
        else
            return this.buildSolution(this.result);
    }

    // Builds the path to the solution (a list of nodes, each one with a move)
    buildSolution(node) {
        let solution = [node];
        while(node.parent != null) {
            node = node.parent;
            solution.unshift(node);
        }
        return solution;
    }

    // Greedy search algorithm
    greedy(root) {
        
        let queue = new PriorityQueue();
        queue.enqueue(root, root.heuristic);

        let t0 = performance.now();

        while(queue.items.length > 0 && (performance.now() - t0) < TIMEOUT) {

            let newNode = queue.dequeue().element;
            
            if(newNode.reachedFinalState) {
                console.log("Found a solution:");
                console.log(this.buildSolution(newNode));

                return newNode;
            }
            
            let children = newNode.expand();

            for (let i = 0; i < children.length; ++i) {
                queue.enqueue(children[i], children[i].heuristic);
            }
        }
        
        return -1;
    }

    // A-Star search algorithm
    a_star(root) {
        let queue = new PriorityQueue();
        queue.enqueue(root, root.heuristic); // distance on root is 0
        let count = 0;

        let t0 = performance.now();

        while(queue.items.length > 0 && (performance.now() - t0) < TIMEOUT) {

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

        return -1;
    }

    // Iterative deepening search algorithm
    iterativeDeepening(root) {
        let depth = 0, result = -1;

        let t0 = performance.now();

        while(result == -1 && (performance.now() - t0) < TIMEOUT) {
            result = this.dfs(root, depth);
            depth++;
        }
        if((performance.now() - t0) >= TIMEOUT)
            throw "Solution not Found!";

        return result;
    }

    // Depth First Search algorithm
    dfs(root, limit) {
        let visitedBoards = [];
        let queue = [root];

        let t0 = performance.now();
        
        while(queue.length != 0 && (performance.now() - t0) < TIMEOUT) {
            let newNode = queue.shift();
            if(this.checkAlreadyVisited(visitedBoards, newNode.board.toString())) {
                console.log("Already visited");
                continue;
            }
            if(newNode.reachedFinalState) { 
                console.log("Queue Size: " + queue.length);
                console.log("Found a solution:");
                console.log(this.buildSolution(newNode));
                return newNode;
            }

            if(newNode.currentDepth < limit || limit == null) {
                visitedBoards.push(newNode.board.toString());
                
                let children = newNode.expandUninformed();
                queue.unshift(...children);
            }
        }

        return -1;
    }

    // Breadth First Search algorithm
    bfs(root) {
        let visitedBoards = [];
        let queue = [root];

        let t0 = performance.now();
        
        while(queue.length != 0 && (performance.now() - t0) < TIMEOUT) {
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
            
            let children = newNode.expandUninformed();
            queue.push(...children);
        }

        return -1;
    }

    // Checks if a board was already visited in the search
    checkAlreadyVisited(visitedBoards, board) {
        for (let i = 0; i < visitedBoards; ++i) {
            if(visitedBoards[i] === board)
                return true;
        }
        return false;
    }
}

