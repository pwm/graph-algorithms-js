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

            isConnected: function (start, end) {
                var vertexStart = this.vertices[start];
                var vertexEnd = this.vertices[end];
                if (! (vertexStart instanceof Vertex) || ! (vertexEnd instanceof Vertex)) {
                    return false;
                }
                this.explore(vertexStart);
                return vertexEnd.visited === true;
            },

            explore: function (vertex) {
                vertex.visited = true;
                for (var i = 0; i < this.adjacencyList[vertex.id].length; i++) {
                    var currentVertex = this.adjacencyList[vertex.id][i];
                    if (currentVertex instanceof Vertex && currentVertex.visited === false) {
                        this.explore(currentVertex);
                    }
                }
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
    console.log(g.isConnected(start, end) ? 1 : 0);

})();
