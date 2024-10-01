

// Create a class for the Node, this might belong in a separate file if reused across other operations.
class Node {
    constructor(value, color = 'red') {
        this.value = value;
        this.color = color; // 'red' or 'black'
        this.left = null;
        this.right = null;
        this.parent = null;
    }
}

// This function inserts a new node with the specified value into the Red-Black Tree.
function insertNode() {
    const value = document.getElementById('nodeValue').value; // Get the value from the input field with the id 'nodeValue'.

    // Check if the value is not provided or is not a number.
    if (!value || isNaN(value)) {
        // Alert the user to enter a valid number.
        alert('Please enter a valid number.');
        return;
    }
    // Insert the value (converted to a number) into the Red-Black Tree.
    tree.insert(Number(value));
    renderTree(); // Render the tree to visualize the current state after insertion.
}
