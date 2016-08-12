'use strict';

const UG = (() => {
    const params = new WeakMap();

    class UG {
        constructor(vertexKeys, edgeList) {
            params.set(this, {
                vertices       : new Map(),
                adjacencyList  : new Map(),
                distances      : new Map(),
                previousVertex : new Map()
            });
            this._init(vertexKeys, edgeList);
        }

        // there's no path, there's a unique shortest path, there's multiple paths with the same lengths
        shortestPath(start, end) {
            // same vertex
            if (end === start) {
                return 0;
            }
            // start or end has no adjacent vertices
            if (params.get(this).adjacencyList.get(start).length === 0 ||
                params.get(this).adjacencyList.get(end).length === 0) {
                return -1;
            }

            this._bfs(params.get(this).vertices.get(start));

            return params.get(this).distances.get(end) !== Number.MAX_SAFE_INTEGER
                ? params.get(this).distances.get(end)
                : -1;

            // // no path to end
            // if (params.get(this).distances.get(end) === Number.MAX_SAFE_INTEGER) {
            //     return -1;
            // }
            // // there is a path
            // const path = [];
            // while (end !== start) {
            //     path.push(params.get(this).vertices.get(end));
            //     end = params.get(this).previousVertex.get(end);
            // }
            // path.push(params.get(this).vertices.get(start));
            // return path.reverse().map(vertex => vertex.id);
        }

        _init(vertexKeys, edgeList) {
            for (let vertexKey = 1; vertexKey <= vertexKeys; vertexKey++) {
                params.get(this).vertices.set(vertexKey, new Vertex(vertexKey));
                params.get(this).adjacencyList.set(vertexKey, new Set());
                params.get(this).distances.set(vertexKey, Number.MAX_SAFE_INTEGER);
                params.get(this).previousVertex.set(vertexKey, null);
            }
            this._buildAdjacencyList(edgeList);
        }

        _buildAdjacencyList(edgeList) {
            edgeList.forEach(edge => {
                let [from, to] = edge.split(' ').map(x => parseInt(x));
                this._addEdge(
                    params.get(this).vertices.get(from),
                    params.get(this).vertices.get(to)
                );
            });
        }

        _addEdge(vertexFrom, vertexTo) {
            const vertexFromAdjList = params.get(this).adjacencyList.get(vertexFrom.id);
            const vertexToAdjList = params.get(this).adjacencyList.get(vertexTo.id);
            if (! vertexFromAdjList.has(vertexTo)) {
                vertexFromAdjList.add(vertexTo);
            }
            if (! vertexToAdjList.has(vertexFrom)) {
                vertexToAdjList.add(vertexFrom);
            }
        }

        _bfs(startVertex) {
            const discoveredVerticesQueue = [];
            params.get(this).distances.set(startVertex.id, 0);
            discoveredVerticesQueue.push(startVertex);
            while (discoveredVerticesQueue.length > 0) {
                const currentVertex = discoveredVerticesQueue.shift();
                params.get(this).adjacencyList.get(currentVertex.id).forEach(adjVertex => {
                    if (params.get(this).distances.get(adjVertex.id) === Number.MAX_SAFE_INTEGER) {
                        discoveredVerticesQueue.push(adjVertex);
                        params.get(this).distances.set(adjVertex.id, params.get(this).distances.get(currentVertex.id) + 1);
                        params.get(this).previousVertex.set(adjVertex.id, currentVertex.id);
                    }
                });
            }
        }
    }

    class Vertex {
        constructor(id) {
            this.id = id;
        }
    }

    return UG;
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
const vertexKeys = parseInt(verticesEdges.split(' ')[0]);

var verticesToConnect = lines.pop();
var start = parseInt(verticesToConnect.split(' ')[0]);
var end = parseInt(verticesToConnect.split(' ')[1]);
// note: lines = edgeList

console.log((new UG(vertexKeys, lines)).shortestPath(start, end));
