(function () { 'use strict';

    const DAG = (() => {
        function DAG(vertexKeys, edgeList) {
            this.vertices = [];
            this.adjacencyList = [];
            this.clock = 0;
            this._init(vertexKeys, edgeList);
        }

        const Vertex = (() => {
            function Vertex(id) {
                this.id = id;
                this.visited = false;
                this.postOrder = 0;
            }
            return Vertex;
        })();

        DAG.prototype = {
            constructor: DAG,

            topoSort: function () {
                this._dfs();
                return this.vertices
                    .slice(1) // remove index 0 (undefined)
                    .sort((a, b) => b.postOrder - a.postOrder) // reverse post order
                    .map((vertex) => vertex.id); // only interested in keys
            },

            displayAdjacencyList: function () {
                for (let v = 1; v < this.vertices.length; v++) {
                    console.log(v, this.adjacencyList[v].map((vertex) => vertex.id));
                }
            },

            _dfs: function () {
                for (let v = 1; v < this.vertices.length; v++) {
                    let currentVertex = this.vertices[v];
                    if (currentVertex.visited === false) {
                        this._explore(currentVertex);
                    }
                }
            },

            _init: function (vertexKeys, edgeList) {
                for (let vertexKey = 1; vertexKey <= vertexKeys; vertexKey++) {
                    this.vertices[vertexKey] = new Vertex(vertexKey);
                    this.adjacencyList[vertexKey] = [];
                }
                this._buildAdjacencyList(edgeList);
            },

            _buildAdjacencyList: function (edgeList) {
                for (let i = 0; i < edgeList.length; i++) {
                    let from = parseInt(edgeList[i].split(' ')[0]);
                    let to = parseInt(edgeList[i].split(' ')[1]);
                    this._addEdge(from, to);
                }
            },

            _addEdge: function (from, to) {
                let vertexFrom = this.vertices[from];
                let vertexTo = this.vertices[to];
                if (this.adjacencyList[vertexFrom.id].indexOf(vertexTo.id) === -1) {
                    this.adjacencyList[vertexFrom.id].push(vertexTo);
                }
            },

            _explore: function (vertex) {
                vertex.visited = true;
                for (let i = 0; i < this.adjacencyList[vertex.id].length; i++) {
                    let currentVertex = this.adjacencyList[vertex.id][i];
                    if (currentVertex instanceof Vertex && currentVertex.visited === false) {
                        this._explore(currentVertex);
                    }
                }
                vertex.postOrder = ++this.clock;
            }
        };

        return DAG;
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
    // note: lines = edgeList here

    console.log((new DAG(vertexKeys, lines)).topoSort().join(' '));

})();
