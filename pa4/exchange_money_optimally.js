'use strict';

// Directed weighted graph
const DWG = (() => {
    const params = new WeakMap();

    class DWG {
        constructor(vertexIds, edgeList) {
            this._reset();
            this._init(vertexIds, edgeList);
        }

        findDistancesFromVertex(startVertexId) {
            // set the first vertex's distance to 0
            const startVertex = params.get(this).vertices.get(startVertexId);
            startVertex.distance = 0;

            // Run Bellman-Ford from startVertex exactly |V| times
            const numberOfVertices = params.get(this).vertices.size;
            for (let i = 1; i <= numberOfVertices; i++) {
                params.get(this).edges.forEach(edge => {
                    let fromVertex = params.get(this).vertices.get(edge.fromId),
                        toVertex = params.get(this).vertices.get(edge.toId);
                    if (fromVertex.distance < Number.MAX_SAFE_INTEGER &&
                        toVertex.distance > fromVertex.distance + edge.weight) {
                        toVertex.distance = fromVertex.distance + edge.weight;
                        // Save vertices the got relaxed in the |V|th iteration into queue
                        if (i === numberOfVertices) {
                            params.get(this).verticesRelaxedInLastIteration.push(toVertex.id);
                        }
                    }
                });
            }

            // Run BFS on the vertices that got relaxed in the |V|th iteration
            while (params.get(this).verticesRelaxedInLastIteration.length > 0) {
                let currentVertexId = params.get(this).verticesRelaxedInLastIteration.shift();
                let currentVertex = params.get(this).vertices.get(currentVertexId);
                currentVertex.stepsFromNWC = 0;
                params.get(this).adjacencyList.get(currentVertexId).forEach((_, adjVertexId) => {
                    let adjVertex = params.get(this).vertices.get(adjVertexId);
                    if (adjVertex.stepsFromNWC === Number.MAX_SAFE_INTEGER) {
                        params.get(this).verticesRelaxedInLastIteration.push(adjVertexId);
                        adjVertex.stepsFromNWC = currentVertex.stepsFromNWC + 1;
                    }
                });
            }

            // vertices with infinite distances are unreachable from S
            // vertices with finite steps from negative weight cycles have arbitrarily short paths from S
            // all other vertices have exact distances from S
            return params.get(this).vertices;
        }

        _reset() {
            params.set(this, {
                vertices      : new Map(),
                edges         : new Set(),
                adjacencyList : new Map(),
                verticesRelaxedInLastIteration : []
            });
        }

        _init(vertexIds, edgeList) {
            for (let vertexId = 1; vertexId <= vertexIds; vertexId++) {
                params.get(this).vertices.set(vertexId, new Vertex(vertexId));
                params.get(this).adjacencyList.set(vertexId, new Map());
            }

            edgeList.forEach(edge => {
                let [fromId, toId, weight] = edge.split(' ').map(x => parseInt(x));
                params.get(this).edges.add({
                    'fromId' : fromId,
                    'toId'   : toId,
                    'weight' : weight
                });
                let vertexFromAdjList = params.get(this).adjacencyList.get(fromId);
                if (! vertexFromAdjList.has(toId)) {
                    vertexFromAdjList.set(toId, weight);
                }
            });
        }
    }

    class Vertex {
        constructor(id) {
            this.id = id;
            this.distance = Number.MAX_SAFE_INTEGER;
            this.stepsFromNWC = Number.MAX_SAFE_INTEGER;
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
// note: lines = edgeList

const dwg = new DWG(vertexIds, lines);
dwg.findDistancesFromVertex(start).forEach(vertex => {
    if (vertex.distance === Number.MAX_SAFE_INTEGER) {
        console.log('*');
    } else if (vertex.stepsFromNWC < Number.MAX_SAFE_INTEGER) {
        console.log('-');
    } else {
        console.log(vertex.distance);
    }
});
