(function () { 'use strict';

    const DAG = (() => {
        function DAG(vertexKeys, edgeList) {
            const tmpArray = init(vertexKeys);
            this.vertices = tmpArray[0];
            this.adjacencyList = tmpArray[1];
            buildAdjacencyList(edgeList, this.vertices, this.adjacencyList);
        }

        DAG.prototype = {
            constructor: DAG,

            topoSort: function () {
                dfs(this.vertices, this.adjacencyList);
                return this.vertices
                    .slice(1) // remove index 0 (undefined)
                    .sort((a, b) => b.postOrder - a.postOrder) // reverse post order
                    .map((vertex) => vertex.id); // only interested in keys
            }
        };

        const Vertex = (() => {
            function Vertex(id) {
                this.id = id;
                this.visited = false;
                this.postOrder = 0;
            }
            return Vertex;
        })();

        function init(vertexKeys) {
            let vertices = [],
                adjacencyList = [];
            for (let vertexKey = 1; vertexKey <= vertexKeys; vertexKey++) {
                vertices[vertexKey] = new Vertex(vertexKey);
                adjacencyList[vertexKey] = [];
            }
            return [vertices, adjacencyList];
        }

        function buildAdjacencyList(edgeList, vertices, adjacencyList) {
            for (let i = 0; i < edgeList.length; i++) {
                let keyFrom = parseInt(edgeList[i].split(' ')[0]);
                let keyTo = parseInt(edgeList[i].split(' ')[1]);
                let vertexFrom = vertices[keyFrom];
                let vertexTo = vertices[keyTo];
                if (adjacencyList[vertexFrom.id].indexOf(vertexTo.id) === -1) {
                    adjacencyList[vertexFrom.id].push(vertexTo);
                }
            }
        }

        function dfs(vertices, adjacencyList) {
            let clock = 0;
            for (let v = 1; v < vertices.length; v++) {
                if (vertices[v].visited === false) {
                    clock = explore(vertices[v], adjacencyList, clock);
                }
            }
        }

        function explore(vertex, adjacencyList, clock) {
            vertex.visited = true;
            for (let i = 0; i < adjacencyList[vertex.id].length; i++) {
                const nextAdjacentVertex = adjacencyList[vertex.id][i];
                if (nextAdjacentVertex.visited === false) {
                    clock = explore(nextAdjacentVertex, adjacencyList, clock);
                }
            }
            vertex.postOrder = ++clock;
            return clock;
        }

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
    // note: lines = edgeList
    console.log((new DAG(vertexKeys, lines)).topoSort().join(' '));

})();
