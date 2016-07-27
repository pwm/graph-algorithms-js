(function () { 'use strict';

    var DG = (function () {
        function DG(vertexKeys, edgeList) {
            this.vertices = [];
            this.adjacencyList = [];
            this._init(vertexKeys, edgeList);
        }

        var Vertex = (function () {
            function Vertex(id) {
                this.id = id;
                this.visited = false;
            }
            return Vertex;
        })();

        DG.prototype = {
            constructor: DG,

            isDAG: function () {
                for (var v = 1; v < this.vertices.length; v++) {
                    var currentVertex = this.vertices[v];
                    if (currentVertex.visited === false) {
                        if (this._hasCycle(currentVertex)) {
                            return false;
                        }
                    }
                }
                return true;
            },

            displayAdjacencyList: function () {
                for (var v = 1; v < this.vertices.length; v++) {
                    console.log(v, this.adjacencyList[v].map(function (vertex) { return vertex.id; }));
                }
            },

            _init: function (vertexKeys, edgeList) {
                for (var vertexKey = 1; vertexKey <= vertexKeys; vertexKey++) {
                    this.vertices[vertexKey] = new Vertex(vertexKey);
                    this.adjacencyList[vertexKey] = [];
                }
                this._buildAdjacencyList(edgeList);
            },

            _buildAdjacencyList: function (edgeList) {
                for (var i = 0; i < edgeList.length; i++) {
                    var from = parseInt(edgeList[i].split(' ')[0]);
                    var to = parseInt(edgeList[i].split(' ')[1]);
                    this._addEdge(from, to);
                }
            },

            _addEdge: function (from, to) {
                var vertexFrom = this.vertices[from];
                var vertexTo = this.vertices[to];
                if (this.adjacencyList[vertexFrom.id].indexOf(vertexTo.id) === -1) {
                    this.adjacencyList[vertexFrom.id].push(vertexTo);
                }
            },

            _hasCycle: function (vertex) {
                var stack = [],
                    visitedNeighbours = 0;
                vertex.visited = true;
                stack.push(vertex);
                do {
                    // check all adjacent vertices
                    while (visitedNeighbours < this.adjacencyList[vertex.id].length) {
                        var adjacentVertex = this.adjacencyList[vertex.id][visitedNeighbours];
                        // cycle detected => abort
                        if (stack.indexOf(adjacentVertex) !== -1) {
                            return true;
                        }
                        if (adjacentVertex.visited === false) { // go one vertex deeper
                            vertex = adjacentVertex;
                            vertex.visited = true;
                            stack.push(vertex);
                            visitedNeighbours = 0;
                        } else { // next unvisited adjacent vertex
                            visitedNeighbours++;
                        }
                    }
                    vertex = stack.pop(); // backtrack one vertex
                } while (stack.length > 0);
                return false;
            }
        };

        return DG;
    })();

    ////////////////////////////////

    var fs = require('fs');
    var input = (process.argv.length === 3) ? process.argv[2] : '/dev/stdin';
    var data = fs.readFileSync(input, 'utf8');

    var lines = data.match(/[^\r\n]+/g);

    var verticesEdges = lines.shift();
    var vertexKeys = parseInt(verticesEdges.split(' ')[0]);
    // note: lines = edgeList here

    var dg = new DG(vertexKeys, lines);
    console.log(dg.isDAG() ? 0 : 1);

})();
