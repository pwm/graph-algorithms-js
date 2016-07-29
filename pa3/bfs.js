(() => { 'use strict';

    const UG = (() => {
        function UG(vertexKeys, edgeList) {
            this.vertices = new Map();
            this.adjacencyList = new Map();
            this.distances = new Map();
            this.previousVertex = new Map();
            this.infDistance = vertexKeys > edgeList.length
                ? vertexKeys
                : edgeList.length;
            this._init(vertexKeys, edgeList);
        }

        const Vertex = (() => {
            function Vertex(id) {
                this.id = id;
            }
            return Vertex;
        })();

        UG.prototype = {
            constructor: UG,

            // there's no path, there's a unique shortest path, there's multiple paths with the same lengths
            shortestPath: function (start, end) {
                // same vertex
                if (end === start) {
                    return 0;
                }
                // start or end has no adjacent vertices
                if (this.adjacencyList.get(start).length === 0 || this.adjacencyList.get(end).length === 0) {
                    return -1;
                }
                
                this._bfs(this.vertices.get(start));
                
                return this.distances.get(end) !== this.infDistance
                    ? this.distances.get(end)
                    : -1;

                // // no path to end
                // if (this.distances.get(end) === this.infDistance) {
                //     return -1;
                // }
                // // there is a path
                // const path = [];
                // while (end !== start) {
                //     path.push(this.vertices.get(end));
                //     end = this.previousVertex.get(end);
                // }
                // path.push(this.vertices.get(start));
                // return path.reverse().map(vertex => vertex.id);
            },

            _init: function (vertexKeys, edgeList) {
                for (let vertexKey = 1; vertexKey <= vertexKeys; vertexKey++) {
                    this.vertices.set(vertexKey, new Vertex(vertexKey));
                    this.adjacencyList.set(vertexKey, []);
                    this.distances.set(vertexKey, this.infDistance);
                    this.previousVertex.set(vertexKey, null);
                }
                this._buildAdjacencyList(edgeList);
            },

            _buildAdjacencyList: function (edgeList) {
                edgeList.forEach((edge) => {
                    const from = parseInt(edge.split(' ')[0]),
                        to = parseInt(edge.split(' ')[1]);
                    this._addEdge(this.vertices.get(from), this.vertices.get(to));
                });
            },

            _addEdge: function (vertexFrom, vertexTo) {
                const vertexFromAdjList = this.adjacencyList.get(vertexFrom.id);
                const vertexToAdjList = this.adjacencyList.get(vertexTo.id);
                if (! vertexFromAdjList.includes(vertexTo.id)) {
                    vertexFromAdjList.push(vertexTo);
                }
                if (! vertexToAdjList.includes(vertexFrom.id)) {
                    vertexToAdjList.push(vertexFrom);
                }
            },

            _bfs: function (startVertex) {
                const discoveredVerticesQueue = [];
                this.distances.set(startVertex.id, 0);
                discoveredVerticesQueue.push(startVertex);
                while (discoveredVerticesQueue.length > 0) {
                    const currentVertex = discoveredVerticesQueue.shift();
                    this.adjacencyList.get(currentVertex.id).forEach(adjVertex => {
                        if (this.distances.get(adjVertex.id) === this.infDistance) {
                            discoveredVerticesQueue.push(adjVertex);
                            this.distances.set(adjVertex.id, this.distances.get(currentVertex.id) + 1);
                            this.previousVertex.set(adjVertex.id, currentVertex.id);
                        }
                    });
                }
            }
        };

        return UG;
    })();

    ////////////////////////////////

    const fs = require('fs');
    const input = (process.argv.length === 3) ? process.argv[2] : '/dev/stdin';

    let data = [];
    try {
        data = fs.readFileSync(input,'utf8');
    } catch (e) {
        if (e.code === 'ENOENT') {
            console.log('File not found!');
            process.exit();
        }
        throw e;
    }

    const lines = data.match(/[^\r\n]+/g);

    const verticesEdges = lines.shift();
    const vertexKeys = parseInt(verticesEdges.split(' ')[0]);

    var verticesToConnect = lines.pop();
    var start = parseInt(verticesToConnect.split(' ')[0]);
    var end = parseInt(verticesToConnect.split(' ')[1]);
    // note: lines = edgeList

    const ug = new UG(vertexKeys, lines);
    console.log(ug.shortestPath(start, end));

})();
