class Bst {
    #_root = null;
    size = 0;
    constructor(allowBalance = true) {
        this.allowBalance = allowBalance;
    }

    insert(value) {
        this.#_root = this.#_insert(this.#_root, value);
        this.size++;
    }

    find(value) {
        return this.#_find(this.#_root, value);
    }

    delete(value) {
        this.#_root = this.#_delete(this.#_root, value);
    }

    #_createNode(value) {
        return {
            value: value,
            left: null,
            right: null,
            height: 1,
        }
    }

    #_getHeight(node) {
        if (node === null) return 0;
        return node.height;
    }

    #_updateHeight(node) {
        node.height = 1 + Math.max(this.#_getHeight(node.left), this.#_getHeight(node.right));
    }

    #_insert(node, value) {
        if (node === null) return this.#_createNode(value);
        if (value < node.value) {
            node.left = this.#_insert(node.left, value);
        } else if (value > node.value) {
            node.right = this.#_insert(node.right, value);
        } else {
            return node;
        }
        this.#_updateHeight(node);
        return this.#_balance(node);
    }

    #_find(node, value) {
        if (node === null) {
            return false;
        }
        if (value < node.value) {
            return this.#_find(node.left, value);
        } else if (value > node.value) {
            return this.#_find(node.right, value);
        } else {
            return true;
        }
    }

    #_delete(node, value) {
        if (node === null) {
            return null;
        }
        if (value < node.value) {
            node.left = this.#_delete(node.left, value);
        } else if (value > node.value) {
            node.right = this.#_delete(node.right, value);
        } else {
            if (!node.left || !node.right) {
                const tmp = node.left || node.right;
                return tmp;
            }
            const minValueNode = this.#_findMinValueNode(node.right);
            node.value = minValueNode.value;
            node.right = this.#_delete(node.right, minValueNode.value);
        }
        this.#_updateHeight(node);
        return this.#_balance(node);
    }

    #_findMinValueNode(node) {
        let current = node;
        while (current.left !== null) {
            current = current.left;
        }
        return current;
    }

    #_rotateRight(y) {
        const x = y.left;
        const T2 = x.right;
        x.right = y;
        y.left = T2;
        this.#_updateHeight(y);
        this.#_updateHeight(x);
        return x;
    }

    #_rotateLeft(x) {
        const y = x.right;
        const T2 = y.left;
        y.left = x;
        x.right = T2;
        this.#_updateHeight(x);
        this.#_updateHeight(y);
        return y;
    }

    #_balance(node) {
        if (this.allowBalance === false) return node;
        const factor = this.#_getHeight(node.left) - this.#_getHeight(node.right);
        if (factor > 1) {
            if (node.value > node.left.value) {
                return this.#_rotateRight(node);
            } else {
                node.left = this.#_rotateLeft(node.left);
                return this.#_rotateRight(node);
            }
        }
        if (factor < -1) {
            if (node.value < node.right.value) {
                return this.#_rotateLeft(node);
            } else {
                node.right = this.#_rotateRight(node.right);
                return this.#_rotateLeft(node);
            }
        }
        return node;
    }
}

module.exports = { Bst };