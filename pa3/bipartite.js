'use strict';

const UG = (() => {
    const params = new WeakMap();

    class UG {
        constructor(vertexKeys, edgeList) {
            params.set(this, {
                vertices: new Map(),
                adjacencyList: new Map(),
                distances: new Map(),
                previousVertex: new Map(),
                infDistance: vertexKeys > edgeList.length
                    ? vertexKeys
                    : edgeList.length
            });
            this._init(vertexKeys, edgeList);
        }

        isBipartite() {
            return this._bfs(params.get(this).vertices.values().next().value);
        }

        _init(vertexKeys, edgeList) {
            for (let vertexKey = 1; vertexKey <= vertexKeys; vertexKey++) {
                params.get(this).vertices.set(vertexKey, new Vertex(vertexKey));
                params.get(this).adjacencyList.set(vertexKey, []);
                params.get(this).distances.set(vertexKey, params.get(this).infDistance);
                params.get(this).previousVertex.set(vertexKey, null);
            }
            this._buildAdjacencyList(edgeList);
        }

        _buildAdjacencyList(edgeList) {
            edgeList.forEach((edge) => {
                const from = parseInt(edge.split(' ')[0]),
                    to = parseInt(edge.split(' ')[1]);
                this._addEdge(
                    params.get(this).vertices.get(from),
                    params.get(this).vertices.get(to)
                );
            });
        }

        _addEdge(vertexFrom, vertexTo) {
            const vertexFromAdjList = params.get(this).adjacencyList.get(vertexFrom.id);
            const vertexToAdjList = params.get(this).adjacencyList.get(vertexTo.id);
            if (!vertexFromAdjList.includes(vertexTo.id)) {
                vertexFromAdjList.push(vertexTo);
            }
            if (!vertexToAdjList.includes(vertexFrom.id)) {
                vertexToAdjList.push(vertexFrom);
            }
        }

        _bfs(startVertex) {
            const discoveredVerticesQueue = [];
            params.get(this).distances.set(startVertex.id, 0);
            discoveredVerticesQueue.push(startVertex);
            while (discoveredVerticesQueue.length > 0) {
                const currentVertex = discoveredVerticesQueue.shift();
                const currentVertexAdjList = params.get(this).adjacencyList.get(currentVertex.id);
                for (let adjVertex of currentVertexAdjList) {
                    if (params.get(this).distances.get(adjVertex.id) !== params.get(this).infDistance &&
                        params.get(this).distances.get(adjVertex.id) === params.get(this).distances.get(currentVertex.id)) {
                        return 0;
                    } else if (params.get(this).distances.get(adjVertex.id) === params.get(this).infDistance) {
                        discoveredVerticesQueue.push(adjVertex);
                        params.get(this).distances.set(adjVertex.id, params.get(this).distances.get(currentVertex.id) + 1);
                        params.get(this).previousVertex.set(adjVertex.id, currentVertex.id);
                    }
                }
            }
            return 1;
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
        return require('fs').readFileSync(argv.length === 3 ? argv[2] : '/dev/stdin', 'utf8');
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
const verticesEdges = lines.shift(); // note: lines = edgeList after this
const vertexKeys = parseInt(verticesEdges.split(' ')[0]);

// output if input graph is bipartite
console.log((new UG(vertexKeys, lines)).isBipartite());
