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

            isBipartite: function () {
                return this._bfs(this.vertices.values().next().value);
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
                    const currentVertexAdjList = this.adjacencyList.get(currentVertex.id);
                    for (let adjVertex of currentVertexAdjList) {
                        if (this.distances.get(adjVertex.id) !== this.infDistance &&
                            this.distances.get(adjVertex.id) === this.distances.get(currentVertex.id)) {
                            return 0;
                        } else if (this.distances.get(adjVertex.id) === this.infDistance) {
                            discoveredVerticesQueue.push(adjVertex);
                            this.distances.set(adjVertex.id, this.distances.get(currentVertex.id) + 1);
                            this.previousVertex.set(adjVertex.id, currentVertex.id);
                        }
                    }
                }
                return 1;
            }
        };

        return UG;
    })();

    UG.prototype.displayInfDistance = function () {
        console.log('infDistance:');
        console.log(this.infDistance);
        console.log();
    };

    UG.prototype.displayVertices = function () {
        console.log('vertices:');
        this.vertices.forEach((v, k) => console.log(k, v));
        console.log();
    };

    UG.prototype.displayAdjacencyList = function () {
        console.log('adjacencyList:');
        this.adjacencyList.forEach((v, k) => console.log(k, v.map(vertex => vertex.id)));
        console.log();
    };

    UG.prototype.displayDistances = function () {
        console.log('distances:');
        this.distances.forEach((v, k) => console.log(k, v));
        console.log();
    };

    UG.prototype.displayPreviousVertices = function () {
        console.log('previousVertex:');
        this.previousVertex.forEach((v, k) => console.log(k, v));
        console.log();
    };

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
    // note: lines = edgeList

    const ug = new UG(vertexKeys, lines);
    console.log(ug.isBipartite());

})();
