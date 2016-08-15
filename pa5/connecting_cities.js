'use strict';

class DisjointSet {
    constructor() {
        this._reset();
    }

    makeSet(key) {
        key = parseInt(key);
        this.parent[key] = key;
        this.rank[key]   = 0;
    }

    find(key) {
        key = parseInt(key);
        let parentKey = this.parent[key];
        if (parentKey === undefined) {
            return null;
        }
        if (key !== parentKey) {
            parentKey = this.find(parentKey);
        }
        return parentKey;
    }

    union(keyX, keyY) {
        keyX = parseInt(keyX);
        keyY = parseInt(keyY);
        var parentKeyX = this.find(keyX);
        var parentKeyY = this.find(keyY);
        if (parentKeyX === null || parentKeyY === null) {
            throw new Error('Unknown set.');
        }
        if (parentKeyX === parentKeyY) {
            return true;
        }
        if (this.rank[parentKeyX] > this.rank[parentKeyY]) {
            this.parent[parentKeyY] = parentKeyX;
        } else {
            this.parent[parentKeyX] = parentKeyY;
            if (this.rank[parentKeyX] === this.rank[parentKeyY]) {
                this.rank[parentKeyY]++;
            }
        }
    }

    _reset() {
        this.parent = [];
        this.rank = [];
    }
}

////////////////////////////////

function readInputFile() {
    const argv = process.argv;
    try {
        const input = argv.length === 3 ? argv[2] : '/dev/stdin';
        return require('fs').readFileSync(input, 'utf8');
    } catch (e) {
        if (e.code === 'ENOENT') {
            console.log('File not found!');
            process.exit();
        }
        throw e;
    }
}

////////////////////////////////

const lines = readInputFile().match(/[^\r\n]+/g);
lines.shift(); // remove 1st line (number of vertices)

// vertices are [coordinateX, coordinateY] arrays, vertex ids starts from 0
const vertices = lines.map(x => x.split(' ').map(y => parseInt(y)));
// edges are: [vertexFromId, vertexToId, weight] arrays
// note: this graph is complete
const edges = [];
for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
        let weight = Math.sqrt(
            Math.pow((vertices[i][0] - vertices[j][0]), 2) +
            Math.pow((vertices[i][1] - vertices[j][1]), 2)
        );
        edges.push([i, j, weight]);
    }
}

let totalDistance = 0;
const ds = new DisjointSet();
// create |V| disjoint sets from vertex ids
vertices.forEach((_, i) => ds.makeSet(i));
// sort edges by weight ascending
edges.sort((a, b) => a[2] - b[2]);
// connect disconnected components (sets) and record total distance
edges.forEach(e => {
    if (ds.find(e[0]) !== ds.find(e[1])) {
        ds.union(e[0], e[1]);
        totalDistance += e[2];
    }
});

console.log(totalDistance);
