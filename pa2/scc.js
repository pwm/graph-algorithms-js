(() => { 'use strict';

    const DG = (() => {
        function DG(vertexKeys, edgeList) {
            this.vertices = [];
            this.adjacencyList = [];
            this.reverseAdjacencyList = [];
            this.clock = 0;
            this._init(vertexKeys, edgeList);
        }

        const Vertex = (() => {
            function Vertex(id) {
                this.id = id;
                this.visited = false;
                this.reverseVisited = false;
                this.postOrder = 0;
                this.componentId = 0;
            }
            return Vertex;
        })();

        DG.prototype = {
            constructor: DG,

            scc: function () {
                this._dfsReverse();
                let sortedVertices = this.vertices.slice(1).sort((a, b) => b.postOrder - a.postOrder);
                sortedVertices.unshift(undefined); // add back 0 index
                this.vertices = sortedVertices;
                return this._dfsSCC();
            },

            _init: function (vertexKeys, edgeList) {
                for (let vertexKey = 1; vertexKey <= vertexKeys; vertexKey++) {
                    this.vertices[vertexKey] = new Vertex(vertexKey);
                    this.adjacencyList[vertexKey] = [];
                    this.reverseAdjacencyList[vertexKey] = [];
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
                if (this.reverseAdjacencyList[vertexTo.id].indexOf(vertexFrom.id) === -1) {
                    this.reverseAdjacencyList[vertexTo.id].push(vertexFrom);
                }
            },

            _dfsReverse: function () {
                for (let v = 1; v < this.vertices.length; v++) {
                    let vertex = this.vertices[v];
                    if (vertex.reverseVisited === false) {
                        this._exploreReverse(vertex, 0);
                    }
                }
            },

            _exploreReverse: function (vertex) {
                vertex.reverseVisited = true;
                for (let i = 0; i < this.reverseAdjacencyList[vertex.id].length; i++) {
                    let nextAdjacentVertex = this.reverseAdjacencyList[vertex.id][i];
                    if (nextAdjacentVertex.reverseVisited === false) {
                        this._exploreReverse(nextAdjacentVertex);
                    }
                }
                vertex.postOrder = ++this.clock;
            },

            _dfsSCC: function () {
                let numberOfComponents = 0;
                for (let v = 1; v < this.vertices.length; v++) {
                    let vertex = this.vertices[v];
                    if (vertex.visited === false) {
                        this._exploreSCC(vertex, ++numberOfComponents);
                    }
                }
                return numberOfComponents;
            },

            _exploreSCC: function (vertex, componentId) {
                vertex.visited = true;
                vertex.componentId = componentId;
                for (let i = 0; i < this.adjacencyList[vertex.id].length; i++) {
                    let nextAdjacentVertex = this.adjacencyList[vertex.id][i];
                    if (nextAdjacentVertex.visited === false) {
                        this._exploreSCC(nextAdjacentVertex, componentId);
                    }
                }
            }
        };

        return DG;
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
    // note: lines = edgeList
    console.log((new DG(vertexKeys, lines)).scc());

})();
