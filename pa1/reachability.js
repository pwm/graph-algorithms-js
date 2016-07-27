(function () { 'use strict';

    var G = (function () {
        function G(numberOfVertices) {
            this.vertices = [];
            this.adjacencyList = [];
            for (var v = 1; v <= numberOfVertices; v++) {
                this.vertices[v] = new Vertex(v);
                this.adjacencyList[v] = [];
            }
        }

        var Vertex = (function () {
            function Vertex(id) {
                this.id = id;
                this.visited = false;
            }
            return Vertex;
        })();

        G.prototype = {
            constructor: G,

            buildAdjacencyList: function (edges) {
                for (var i = 0; i < edges.length; i++) {
                    var from = parseInt(edges[i].split(' ')[0]);
                    var to = parseInt(edges[i].split(' ')[1]);
                    this.addEdge(from, to);
                }
            },

            displayAdjacencyList: function () {
                for (var i = 0; i < this.adjacencyList.length; i++) {
                    if (this.adjacencyList[i] !== undefined) {
                        console.log(i, this.adjacencyList[i].map(function (v) { return v.id; }));
                    }
                }
            },

            addEdge: function (from, to) {
                var vertexFrom = this.vertices[from];
                var vertexTo = this.vertices[to];
                if (this.adjacencyList[vertexFrom.id].indexOf(vertexTo.id) === -1) {
                    this.adjacencyList[vertexFrom.id].push(vertexTo);
                }
                if (this.adjacencyList[vertexTo.id].indexOf(vertexFrom.id) === -1) {
                    this.adjacencyList[vertexTo.id].push(vertexFrom);
                }
            },

            isConnected: function (start, end, exploreType) {
                var vertexStart = this.vertices[start];
                var vertexEnd = this.vertices[end];
                if (! (vertexStart instanceof Vertex) || ! (vertexEnd instanceof Vertex)) {
                    return false;
                }
                exploreType === 'r' ? this.exploreR(vertexStart) : this.exploreI(vertexStart);
                return vertexEnd.visited === true;
            },

            exploreR: function (vertex) {
                vertex.visited = true;
                for (var i = 0; i < this.adjacencyList[vertex.id].length; i++) {
                    var currentVertex = this.adjacencyList[vertex.id][i];
                    if (currentVertex instanceof Vertex && currentVertex.visited === false) {
                        this.exploreR(currentVertex);
                    }
                }
            },

            exploreI: function (vertex) {
                var stack = [];
                vertex.visited = true;
                stack.push(vertex);
                do {
                    for (var i = 0; i < this.adjacencyList[vertex.id].length; i++) {
                        var adjacentVertex = this.adjacencyList[vertex.id][i];
                        if (adjacentVertex.visited === false) {
                            vertex = adjacentVertex;
                            vertex.visited = true;
                            stack.push(vertex);
                            i = 0;
                        }
                    }
                    vertex = stack.pop();
                } while (stack.length !== 0);
            }
        };

        return G;
    })();

    ////////////////////////////////

    var fs = require('fs');
    var input = (process.argv.length === 3) ? process.argv[2] : '/dev/stdin';
    var data = fs.readFileSync(input, 'utf8');

    var lines = data.match(/[^\r\n]+/g);

    var verticesEdges = lines.shift();
    var numberOfVertices = parseInt(verticesEdges.split(' ')[0]);

    var verticesToConnect = lines.pop();
    var start = parseInt(verticesToConnect.split(' ')[0]);
    var end = parseInt(verticesToConnect.split(' ')[1]);

    var g = new G(numberOfVertices);
    g.buildAdjacencyList(lines);
    console.log(g.isConnected(start, end, 'r') ? 1 : 0);
    var g2 = new G(numberOfVertices);
    g2.buildAdjacencyList(lines);
    console.log(g2.isConnected(start, end, 'i') ? 1 : 0);

})();
