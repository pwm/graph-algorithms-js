const Stack = (() => {
    class Stack {
        constructor() {
            this.top = null;
            this.size = 0;
        }

        push(key) {
            this.top = (new Node(key)).setNext(this.top);
            this.size++;
        }

        pop() {
            if (this.isEmpty()) {
                return;
            }
            var topNode = this.top;
            this.top = this.top.getNext();
            this.size--;
            return topNode.getKey();
        }

        isEmpty() {
            return this.size === 0;
        }

        [Symbol.iterator]() {
            return (function* (stack) {
                while (! stack.isEmpty()) {
                    yield stack.pop();
                }
            })(this);
        }
    }

    class Node {
        constructor(key) {
            this.key = key;
            this.next = null;
        }

        setNext(node) {
            this.next = node;
            return this;
        }

        getNext() {
            return this.next;
        }

        getKey() {
            return this.key;
        }
    }

    return Stack;
})();

////////////////////////////////

var s = new Stack();
s.push('foo');
s.push('bar');
s.push('baz');

for (let v of s) {
    console.log(v);
}
