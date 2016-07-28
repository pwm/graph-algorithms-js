(() => { 'use strict';

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

})();