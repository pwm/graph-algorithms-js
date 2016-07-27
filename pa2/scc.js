(function () { 'use strict';

    ////////////////////////////////

    var fs = require('fs');
    var input = (process.argv.length === 3) ? process.argv[2] : '/dev/stdin';
    var data = fs.readFileSync(input, 'utf8');

    var lines = data.match(/[^\r\n]+/g);

    var verticesEdges = lines.shift();
    var vertexKeys = parseInt(verticesEdges.split(' ')[0]);
    // note: lines = edgeList here

    var dg = new DG(vertexKeys, lines);
    
})();
