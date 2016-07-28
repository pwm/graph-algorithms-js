(() => { 'use strict';

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
    console.log(vertexKeys);

})();
