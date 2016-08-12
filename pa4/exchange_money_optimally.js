'use strict';

// Directed weighted graph
const DWG = (() => {
    const params = new WeakMap();

    class DWG {
        constructor(vertexKeys, edgeList) {
            params.set(this, {
                vertices                       : new Map(),
                edges                          : new Set(),
                adjacencyList                  : new Map(),
                relaxedVerticesInLastIteration : new Set(),
                prevVertexMap                  : new Map()
            });
            this._init(vertexKeys, edgeList);
        }

        findDistancesFromVertex(startVertexId) {
            // set the first vertex's distance to 0
            const startVertex = params.get(this).vertices.get(startVertexId);
            startVertex.distance = 0;

            // iterate |V| times and save vertices the got relaxed in the last iteration
            const numberOfVertices = params.get(this).vertices.size;
            for (let i = 1; i <= numberOfVertices; i++) {
                params.get(this).edges.forEach(edge => {
                    let fromVertex = params.get(this).vertices.get(parseInt(edge.from));
                    let toVertex = params.get(this).vertices.get(edge.to);
                    if (toVertex.distance > fromVertex.distance + edge.weight) {
                        toVertex.distance = fromVertex.distance + edge.weight;
                        params.get(this).prevVertexMap.set(toVertex.id, fromVertex);
                        if (i === numberOfVertices) {
                            params.get(this).relaxedVerticesInLastIteration.add(toVertex);
                        }
                    }
                });
            }
            return params.get(this).relaxedVerticesInLastIteration.size > 0 ? 1 : 0;
        }

        _init(vertexKeys, edgeList) {
            for (let vertexKey = 1; vertexKey <= vertexKeys; vertexKey++) {
                params.get(this).vertices.set(vertexKey, new Vertex(vertexKey, Number.MAX_SAFE_INTEGER));
                params.get(this).adjacencyList.set(vertexKey, new Map());
                params.get(this).prevVertexMap.set(vertexKey, null);
            }

            edgeList.forEach(edge => {
                let [from, to, weight] = edge.split(' ').map(x => parseInt(x));
                params.get(this).edges.add({
                    'from'   : from,
                    'to'     : to,
                    'weight' : weight
                });
            });

            this._buildAdjacencyList(edgeList);
        }

        _buildAdjacencyList(edgeList) {
            edgeList.forEach(edge => {
                let [from, to, weight] = edge.split(' ').map(x => parseInt(x));
                this._addEdge(
                    params.get(this).vertices.get(from),
                    params.get(this).vertices.get(to),
                    weight
                );
            });
        }

        _addEdge(vertexFrom, vertexTo, weight) {
            const vertexFromAdjList = params.get(this).adjacencyList.get(vertexFrom.id);
            if (! vertexFromAdjList.has(vertexTo)) {
                vertexFromAdjList.set(vertexTo, weight);
            }
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
const vertexKeys = parseInt(verticesEdges.split(' ')[0]);

var verticesToConnect = lines.pop();
var start = parseInt(verticesToConnect.split(' ')[0]);
// note: lines = edgeList

const dwg = new DWG(vertexKeys, lines);
dwg.findDistancesFromVertex(start);
