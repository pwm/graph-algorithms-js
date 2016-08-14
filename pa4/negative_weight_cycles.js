'use strict';

// Directed weighted graph
const DWG = (() => {
    const params = new WeakMap();

    class DWG {
        constructor(vertexIds, edgeList) {
            this._reset();
            this._init(vertexIds, edgeList);
        }

        hasNegativeWeightCycles() {
            // set the first vertex's distance to 0
            params.get(this).vertices.values().next().value.distance = 0;
            // iterate |V| times and save vertices that got relaxed in the last iteration
            const numberOfVertices = params.get(this).vertices.size;
            for (let i = 1; i <= numberOfVertices; i++) {
                params.get(this).edges.forEach(edge => {
                    let fromVertex = params.get(this).vertices.get(edge.fromId);
                    let toVertex = params.get(this).vertices.get(edge.toId);
                    if (toVertex.distance > fromVertex.distance + edge.weight) {
                        toVertex.distance = fromVertex.distance + edge.weight;
                        if (i === numberOfVertices) {
                            params.get(this).relaxedVerticesInLastIteration.add(toVertex);
                        }
                    }
                });
            }
            return params.get(this).relaxedVerticesInLastIteration.size > 0 ? 1 : 0;
        }

        _reset() {
            params.set(this, {
                vertices : new Map(),
                edges    : new Set(),
                relaxedVerticesInLastIteration : new Set()
            });
        }

        _init(vertexIds, edgeList) {
            for (let vertexId = 1; vertexId <= vertexIds; vertexId++) {
                params.get(this).vertices.set(vertexId, new Vertex(vertexId));
            }

            edgeList.forEach(edge => {
                let [fromId, toId, weight] = edge.split(' ').map(x => parseInt(x));
                params.get(this).edges.add({
                    'fromId' : fromId,
                    'toId'   : toId,
                    'weight' : weight
                });
            });
        }
    }

    class Vertex {
        constructor(id) {
            this.id = id;
            this.distance = Number.MAX_SAFE_INTEGER;
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
// note: lines = edgeList

console.log((new DWG(vertexIds, lines)).hasNegativeWeightCycles());
