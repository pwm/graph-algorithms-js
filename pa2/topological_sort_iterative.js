(function () { 'use strict';

    var DAG = (function () {
        function DAG(vertexKeys, edgeList) {
            this.vertices = [];
            this.adjacencyList = [];
            this.clock = 0;
            this._init(vertexKeys, edgeList);
        }

        var Vertex = (function () {
            function Vertex(id) {
                this.id = id;
                this.visited = false;
                this.preOrder = 0;
                this.postOrder = 0;
            }
            Vertex.prototype = {
                constructor: Vertex,
                preVisit: function (preOrder) {
                    this.preOrder = preOrder;
                },
                visit: function () {
                    this.visited = true;
                },
                beenVisited: function () {
                    return this.visited === true;
                },
                postVisit: function (postOrder) {
                    this.postOrder = postOrder;
                },
            };
            return Vertex;
        })();

        DAG.prototype = {
            constructor: DAG,

            topoSort: function (type) {
                this._dfs(type);
                return this.vertices
                    .slice(1) // remove index 0 (undefined)
                    .sort((a, b) => b.postOrder - a.postOrder) // reverse post order
                    .map((vertex) => vertex.id); // only interested in keys
            },

            displayAdjacencyList: function () {
                for (var v = 1; v < this.vertices.length; v++) {
                    console.log(v, this.adjacencyList[v].map(function (vertex) { return vertex.id; }));
                }
            },

            _dfs: function (type) {
                for (var v = 1; v < this.vertices.length; v++) {
                    var currentVertex = this.vertices[v];
                    if (currentVertex.visited === false) {
                        type === 'r'
                            ? this._exploreR(currentVertex)
                            : this._exploreI(currentVertex);
                    }
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

            _exploreR: function (vertex) {
                vertex.preVisit(++this.clock);
                vertex.visit();
                for (var i = 0; i < this.adjacencyList[vertex.id].length; i++) {
                    var currentVertex = this.adjacencyList[vertex.id][i];
                    if (currentVertex instanceof Vertex && currentVertex.visited === false) {
                        this._exploreR(currentVertex);
                    }
                }
                vertex.postVisit(++this.clock);
            },

            _exploreI: function (vertex) {
                var vertexStack = [],
                    visitedNeighbours = [],
                    counter = 0;
                vertex.preVisit(++this.clock);
                vertex.visit();
                vertexStack.push(vertex);
                visitedNeighbours.push(counter);
                do {
                    // check all adjacent vertices of vertex
                    while (counter < this.adjacencyList[vertex.id].length) {
                        var adjacentVertex = this.adjacencyList[vertex.id][counter];
                        if (! adjacentVertex.beenVisited()) { // go one vertex deeper
                            vertex = adjacentVertex;
                            vertex.preVisit(++this.clock);
                            vertex.visit();
                            vertexStack.push(vertex);
                            counter = 0;
                            visitedNeighbours.push(counter);
                        } else { // next unvisited adjacent vertex
                            counter++;
                        }
                    }
                    // backtrack to vertex
                    vertex = vertexStack.pop();
                    counter = visitedNeighbours.pop();
                    // there are more neighbours to explore
                    if (counter < this.adjacencyList[vertex.id].length) {
                        vertexStack.push(vertex);
                        visitedNeighbours.push(++counter); // step over already explored neighbour
                    // all neighbours are explored
                    } else {
                        vertex.postVisit(++this.clock);
                    }
                } while (vertexStack.length > 0);
                return false;
            }
        };

        return DAG;
    })();

    ////////////////////////////////

    var fs = require('fs');
    var input = (process.argv.length === 3) ? process.argv[2] : '/dev/stdin';

    try {
        var data = fs.readFileSync(input,'utf8');
    } catch (e) {
        if (e.code === 'ENOENT') {
            console.log('File not found!');
            process.exit();
        }
        throw e;
    }

    var lines = data.match(/[^\r\n]+/g);
    var verticesEdges = lines.shift();
    var vertexKeys = parseInt(verticesEdges.split(' ')[0]);
    // note: lines = edgeList here

    console.log((new DAG(vertexKeys, lines)).topoSort('r').join(' '));
    console.log((new DAG(vertexKeys, lines)).topoSort('i').join(' '));

})();
