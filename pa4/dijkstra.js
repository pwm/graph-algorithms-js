'use strict';

const Heap = (() => {
    const TYPE_MAX = 'max';
    const TYPE_MIN = 'min';
    const TYPES = [
        TYPE_MAX,
        TYPE_MIN
    ];

    class Heap {
        constructor(
            type = TYPE_MAX,
            getIdFn = id => id,
            getPriorityFn = p => p,
            // allows client code to use the 1st parameter freely
            setPriorityFn = (_, p, a, k) => a[k] = p
        ) {
            this.a = [];
            this.nodeIdKeyMap = new Map();
            this.setType(type);
            this.getId = getIdFn;
            this.getPriority = getPriorityFn;
            this.setPriority = setPriorityFn;
        }

        static typeMin() {
            return TYPE_MIN;
        }

        static typeMax() {
            return TYPE_MAX;
        }

        setType(type) {
            if (! TYPES.includes(type)) {
                throw Error('Invalid type.');
            }
            this.type = type;
        }

        insert(node) {
            const newKey = this.a.length;
            this.a[newKey] = node;
            this.nodeIdKeyMap.set(this.getId(node), newKey);
            this._siftUp(newKey);
        }

        getSize() {
            return this.a.length;
        }

        extractRoot() {
            const root = this.a[0];
            this.a[0] = this.a[this.a.length - 1];
            this.nodeIdKeyMap.set(this.getId(this.a[0]), 0);
            this._siftDown(0);
            this.a.pop();
            this.nodeIdKeyMap.delete(this.getId(root));
            return root;
        }

        changePriority(nodeId, newPriority) {
            const key = this.nodeIdKeyMap.get(nodeId);
            if (key === undefined) {
                return;
            }
            const currentPriority = this.getPriority(this.a[key]);
            this.setPriority(this.a[key], newPriority, this.a, key);
            this._priorityViolation(newPriority, currentPriority)
                ? this._siftUp(key)
                : this._siftDown(key);
        }

        _siftUp(key) {
            let parentKey = Heap._getParentKey(key);
            while (key > 0 && this._priorityViolation(this.getPriority(this.a[key]), this.getPriority(this.a[parentKey]))) {
                this._swap(Heap._getParentKey(key), key);
                key = Heap._getParentKey(key);
                parentKey = Heap._getParentKey(key);
            }
        }

        _siftDown(key) {
            let maxKey = key;
            let leftChildKey = Heap._getLeftChildKey(key);
            if (leftChildKey < this.a.length &&
                this._priorityViolation(this.getPriority(this.a[leftChildKey]), this.getPriority(this.a[maxKey]))) {
                maxKey = leftChildKey;
            }
            let rightChildKey = Heap._getRightChildKey(key);
            if (rightChildKey < this.a.length &&
                this._priorityViolation(this.getPriority(this.a[rightChildKey]), this.getPriority(this.a[maxKey]))) {
                maxKey = rightChildKey;
            }
            if (key !== maxKey) {
                this._swap(key, maxKey);
                this._siftDown(maxKey);
            }
        }

        _priorityViolation(a, b) {
            return this.type === TYPE_MAX ? a > b : a < b;
        }

        _swap(x, y) {
            this.nodeIdKeyMap.set(this.getId(this.a[x]), y);
            this.nodeIdKeyMap.set(this.getId(this.a[y]), x);
            [this.a[y], this.a[x]] = [this.a[x], this.a[y]];
        }

        static _getParentKey(key) {
            return Math.floor((key - 1) / 2);
        }

        static _getLeftChildKey(key) {
            return key * 2 + 1;
        }

        static _getRightChildKey(key) {
            return key * 2 + 2;
        }
    }

    return Heap;
})();

////////////////////////////////

// Directed weighted graph
const DWG = (() => {
    const params = new WeakMap();

    class DWG {
        constructor(vertexIds, edgeList) {
            this._reset();
            this._init(vertexIds, edgeList);
        }

        dijkstra(fromId, toId) {
            // same vertex
            if (fromId === toId) {
                return 0;
            }

            // from vertex has no outgoing edges
            if (params.get(this).adjacencyList.get(fromId).size === 0) {
                return -1;
            }

            const fromVertex = params.get(this).vertices.get(fromId);
            const toVertex = params.get(this).vertices.get(toId);
            // set start distance to 0
            fromVertex.distance = 0;

            // create min heap from vertices by distance as priority
            const minHeap = new Heap(
                Heap.typeMin(),
                vertex => vertex.id,
                vertex => vertex.distance,
                (vertex, newDistance) => vertex.distance = newDistance
            );
            params.get(this).vertices.forEach(v => { minHeap.insert(v); });

            // explore the graph
            while (minHeap.getSize() > 0) {
                let currVertex = minHeap.extractRoot();
                params.get(this).adjacencyList.get(currVertex.id).forEach((weight, nextVertexId) => {
                    let nextVertex = params.get(this).vertices.get(nextVertexId);
                    if (nextVertex.distance > currVertex.distance + weight) {
                        params.get(this).prevVertexMap.set(nextVertexId, currVertex.id);
                        // note: this also does nextVertex.distance = currVertex.distance + weight
                        // because of passing by reference
                        minHeap.changePriority(nextVertex.id, currVertex.distance + weight);
                    }
                });
            }

            return toVertex.distance < Number.MAX_SAFE_INTEGER
                ? toVertex.distance
                : -1;
        }
        
        _reset() {
            params.set(this, {
                vertices      : new Map(),
                adjacencyList : new Map(),
                prevVertexMap : new Map()
            });
        }

        _init(vertexIds, edgeList) {
            for (let vertexId = 1; vertexId <= vertexIds; vertexId++) {
                params.get(this).vertices.set(vertexId, new Vertex(vertexId, Number.MAX_SAFE_INTEGER));
                params.get(this).adjacencyList.set(vertexId, new Map());
                params.get(this).prevVertexMap.set(vertexId, null);
            }
            
            edgeList.forEach(edge => {
                let [fromId, toId, weight] = edge.split(' ').map(x => parseInt(x));
                let vertexFromAdjList = params.get(this).adjacencyList.get(fromId);
                if (! vertexFromAdjList.has(toId)) {
                    vertexFromAdjList.set(toId, weight);
                }
            });
        }
    }

    class Vertex {
        constructor(id, distance) {
            this.id = id;
            this.distance = distance;
        }
    }

    return DWG;
})();

////////////////////////////////

function readInputFile() {
    const argv = process.argv;
    try {
        const input = argv.length === 3 ? argv[2] : '/dev/stdin';
        return require('fs').readFileSync(input, 'utf8');
    } catch (e) {
        if (e.code === 'ENOENT') {
            console.log('File not found!');
            process.exit();
        }
        throw e;
    }
}

////////////////////////////////

const lines = readInputFile().match(/[^\r\n]+/g);
const verticesEdges = lines.shift();
const vertexIds = parseInt(verticesEdges.split(' ')[0]);

var verticesToConnect = lines.pop();
var start = parseInt(verticesToConnect.split(' ')[0]);
var end = parseInt(verticesToConnect.split(' ')[1]);
// note: lines = edgeList

// find path with the minimum weight
console.log((new DWG(vertexIds, lines)).dijkstra(start, end));
