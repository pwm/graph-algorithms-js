(function () { 'use strict';

    var UG = (function () {
        function UG(numberOfVertices) {
            this.numberOfVertices = numberOfVertices;
            this.vertices = [];
            this.adjacencyList = [];
            this.init();
        }

        var Vertex = (function () {
            function Vertex(id) {
                this.id = id;
                this.visited = false;
                this.componentId = 0;
            }
            return Vertex;
        })();

        UG.prototype = {
            constructor: UG,

            init: function () {
                for (var v = 1; v <= this.numberOfVertices; v++) {
                    this.vertices[v] = new Vertex(v);
                    this.adjacencyList[v] = [];
                }
            },

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

            dfs: function () {
                var numberOfComponents = 0;
                for (var v = 1; v <= this.numberOfVertices; v++) {
                    var currentVertex = this.vertices[v];
                    if (currentVertex.visited === false) {
                        this.explore(currentVertex, ++numberOfComponents);
                    }
                }
                return numberOfComponents;
            },

            explore: function (vertex, componentId) {
                vertex.visited = true;
                vertex.componentId = componentId;
                for (var i = 0; i < this.adjacencyList[vertex.id].length; i++) {
                    var currentVertex = this.adjacencyList[vertex.id][i];
                    if (currentVertex instanceof Vertex && currentVertex.visited === false) {
                        this.explore(currentVertex, componentId);
                    }
                }
            }
        };

        return UG;
    })();

    ////////////////////////////////

    var fs = require('fs');
    var input = (process.argv.length === 3) ? process.argv[2] : '/dev/stdin';
    var data = fs.readFileSync(input, 'utf8');

    var lines = data.match(/[^\r\n]+/g);

    var verticesEdges = lines.shift();
    var numberOfVertices = parseInt(verticesEdges.split(' ')[0]);

    var ug = new UG(numberOfVertices);
    ug.buildAdjacencyList(lines);
    console.log(ug.dfs());

})();
