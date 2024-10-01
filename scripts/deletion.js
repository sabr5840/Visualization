// This function deletes a node with the specified value from the Red-Black Tree.
function deleteNode() {
    const value = document.getElementById('nodeValue').value; // Get the value from the input field with the id 'nodeValue'.

    // Check if the value is not provided or is not a number.
    if (!value || isNaN(value)) {
        // Alert the user to enter a valid number.
        alert('Please enter a valid number.');
        return;
    }

    // Delete the node with the given value from the Red-Black Tree.
    tree.delete(Number(value));

    // Render the tree to visualize the current state after deletion.
    renderTree();
}

// Method for handling the deletion in Red-Black Tree
class RedBlackTree {
    // Other methods like rotateLeft, rotateRight, etc., should also be in this class if not already defined elsewhere.

    delete(value) {
        const node = this.findNode(value); // Find the node to delete.
        if (node === null) return; // If the node is not found, do nothing.

        let y = node; // Used to handle the deletion process and potential replacement.
        let yOriginalColor = y.color; // Save the original color of the node to be deleted.
        let x; // Placeholder for node replacement.

        // Case 1: Node to be deleted has no left child.
        if (node.left === null) {
            x = node.right; // Set x to the right child of the node.
            this.transplant(node, node.right); // Replace the node with its right child.

        // Case 2: Node to be deleted has no right child.
        } else if (node.right === null) {
            x = node.left; // Set x to the left child of the node.
            this.transplant(node, node.left); // Replace the node with its left child.

        // Case 3: Node to be deleted has two children.
        } else {
            y = this.minimum(node.right); // Find the minimum node in the right subtree.
            yOriginalColor = y.color; // Store the color of the minimum node for later use.
            x = y.right; // Set x to the right child of the minimum node.

            if (y.parent === node) {
                if (x !== null) x.parent = y;
            } else {
                this.transplant(y, y.right); // Replace 'y' with its right child.
                y.right = node.right; // Attach the right child of 'y' to the node being deleted.
                if (y.right !== null) y.right.parent = y;
            }

            this.transplant(node, y); // Replace the node to be deleted with 'y'.
            y.left = node.left; // Attach the left child of the node to be deleted to 'y'.
            if (y.left !== null) y.left.parent = y;
            y.color = node.color; // Copy the color of the node being deleted to 'y'.
        }

        // If the original color of the node being deleted was black, fix any violations.
        if (yOriginalColor === 'black') {
            this.fixDeletion(x);
        }
    }

    // Helper methods for deletion like transplant, minimum, and fixDeletion
    transplant(u, v) {
        if (u.parent === null) {
            this.root = v; // If 'u' is the root node, replace the root with 'v'.
        } else if (u === u.parent.left) {
            u.parent.left = v; // Replace 'u' with 'v' as the left child.
        } else {
            u.parent.right = v; // Replace 'u' with 'v' as the right child.
        }

        if (v !== null) {
            v.parent = u.parent; // Set 'v's parent to 'u's parent.
        }
    }

    minimum(node) {
        while (node.left !== null) {
            node = node.left; // Traverse to the leftmost node (smallest value).
        }
        return node; // Return the minimum node.
    }

    fixDeletion(x) {
        while (x !== this.root && (x === null || x.color === 'black')) {
            if (x === x.parent.left) {
                let w = x.parent.right;

                // Case 1: w is red.
                if (w.color === 'red') {
                    w.color = 'black';
                    x.parent.color = 'red';
                    this.rotateLeft(x.parent);
                    w = x.parent.right;
                }

                // Case 2: Both of w's children are black.
                if ((w.left === null || w.left.color === 'black') && (w.right === null || w.right.color === 'black')) {
                    w.color = 'red';
                    x = x.parent;
                } else {
                    // Case 3: w's right child is black and w's left child is red.
                    if (w.right === null || w.right.color === 'black') {
                        if (w.left !== null) w.left.color = 'black';
                        w.color = 'red';
                        this.rotateRight(w);
                        w = x.parent.right;
                    }

                    // Case 4: w's right child is red.
                    w.color = x.parent.color;
                    x.parent.color = 'black';
                    if (w.right !== null) w.right.color = 'black';
                    this.rotateLeft(x.parent);
                    x = this.root;
                }
            } else {
                // Symmetric cases for when 'x' is the right child.
                let w = x.parent.left;

                if (w.color === 'red') {
                    w.color = 'black';
                    x.parent.color = 'red';
                    this.rotateRight(x.parent);
                    w = x.parent.left;
                }

                if ((w.right === null || w.right.color === 'black') && (w.left === null || w.left.color === 'black')) {
                    w.color = 'red';
                    x = x.parent;
                } else {
                    if (w.left === null || w.left.color === 'black') {
                        if (w.right !== null) w.right.color = 'black';
                        w.color = 'red';
                        this.rotateLeft(w);
                        w = x.parent.left;
                    }

                    w.color = x.parent.color;
                    x.parent.color = 'black';
                    if (w.left !== null) w.left.color = 'black';
                    this.rotateRight(x.parent);
                    x = this.root;
                }
            }
        }
        if (x !== null) x.color = 'black';
    }
}
