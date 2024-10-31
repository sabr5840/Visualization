
//Contains the definition of the Node class, which represents individual nodes in the Red-Black Tree.
class Node {
    constructor(value, color = 'red') { //Defines constructor function, will be called when a new instance is created. (the default color 'red'.)
        this.value = value;
        this.color = color; // 'red' or 'black'
        this.left = null;
        this.right = null;
        this.parent = null;
    }
}

//Contains the definition of the RedBlackTree class and the central methods for handling the tree's logic and structural operations.
class RedBlackTree { 

    constructor() {
        this.root = null; //Initializes root as null, which means the tree is initially empty
    }

    // Basic tree operations

    insert(value) {
        // Create a new node with the given value
        let newNode = new Node(value);

        // If the tree is empty, set the new node as the root and color it black  
        if (this.root === null) { 
            this.root = newNode;
            this.root.color = 'black'; // Root nodes are always black in Red-Black Trees
            return;
        }

        // Initialize traversal variables
        let current = this.root; // Start from the root of the tree
        let parent = null; // To keep track of the parent node

        // Traverse the tree to find the appropriate position for the new node
        while (current !== null) { 
            parent = current; // Set the parent to the current node before moving
            if (value < current.value) {
                current = current.left; // Move left if the value is less than the current node's value
            } else {
                current = current.right;  // Move right if the value is greater or equal
            }
        }

        // Set the new node's parent to the found parent node
        newNode.parent = parent; 

        // Attach the new node to the parent's left or right based on its value
        if (value < parent.value) { 
            parent.left = newNode;
        } else {
            parent.right = newNode;
        }

        // Fix any Red-Black Tree property violations caused by the insertion
        this.fixInsertion(newNode); 
    }

    async delete(value) {
        // Find the node with the specified value
        const node = this.findNode(value);
        if (!node) return; // If the node doesn't exist, return immediately
    
        let y = node; // Node to be removed or moved
        let yOriginalColor = y.color; // Store the original color of y for balancing checks
        let x; // Node that will replace y's position in the tree
    
        // Case 1: node has no children
        if (node.left === null && node.right === null) {
            await this.fadeOutNode(node);  // Animate node removal
            x = null;
            this.transplant(node, null); // Replace node with null in the tree
        }

        // Case 2: node has one child
        else if (node.left === null || node.right === null) {
            x = node.left === null ? node.right : node.left; // Set x to the non-null child
    
            await this.fadeOutNode(node); // Animate node removal
    
            this.moveNodeUp(x, node); // Animate child moving up
            await new Promise(resolve => setTimeout(resolve, 1000)); 
    
            this.transplant(node, x); // Replace node with its child
        }

        // Case 3: node has two children
        else {
            y = this.minimum(node.right); // Find the minimum node in the right subtree (in-order successor)
            yOriginalColor = y.color; // Store y's original color for balancing
            x = y.right; // x is y's right child (can be null if y has no right child)
    
            if (y.parent !== node) { // If y is not directly the child of the node to be deleted
                this.transplant(y, y.right); // Replace y with its right child
                y.right = node.right; // Move node's right subtree to y's right
                if (y.right !== null) y.right.parent = y;
            }
    
            await this.fadeOutNode(node); // Animate node removal
    
            this.moveSuccessor(node, y); // Animate successor node moving up
            await new Promise(resolve => setTimeout(resolve, 1000)); 
    
            this.transplant(node, y); // Replace node with y in the tree
            y.left = node.left; // Set y's left child to node's left subtree
            if (y.left !== null) y.left.parent = y;
            y.color = node.color; // Copy node's color to y
        }
    
        // If the removed node was black, restore Red-Black properties
        if (yOriginalColor === 'black') {
            await this.fixDeletion(x);
        }
    }

    search(value) {
        return this.findNode(value); //Utilizes the findNode method to locate the node with the given value.
    }

    // Node finding helpers

    findNode(value) {
        let current = this.root; // Start the search from the root of the tree.
        while (current !== null && current.value !== value) { // Traverse the tree until the node is found or we reach a null reference.
            // If the value to be found is less than the current node's value, go to the left child...
            if (value < current.value) {
                current = current.left;
            } else { //If the value to be found is greater than or equal to the current node's value, go to the right child.
                current = current.right;
            }
        }
        return current; //Return the node if found; otherwise, return null.
    }

    findSuccessor(node) {
        // Case 1: If the node has a right subtree, the successor is the minimum node in that subtree
        if (node.right !== null) {
            return this.minimum(node.right);
        }

        // Case 2: If the node has no right subtree, find the lowest ancestor for which this node is in the left subtree
        let parentNode = node.parent; // Start with the node's parent
        // Move up the tree until finding an ancestor that is a left child of its parent
        while (parentNode !== null && node === parentNode.right) {
            node = parentNode; // Move up to the parent
            parentNode = parentNode.parent;
        }

        // The parentNode found here is the successor (or null if no successor exists)
        return parentNode;
    }

    minimum(node) {
        while (node.left !== null) { // Traverse the left children of the node until a node with no left child is found.
            node = node.left;
        }
        return node;// Return the leftmost node, which is the node with the minimum value.
    }

    // Tree rotations

    async rotateLeft(node) {
        // Identify the source (current node) and target (right child) nodes for animation
        const sourceNode = document.getElementById(`node-${node.value}`);
        const targetNode = node.right ? document.getElementById(`node-${node.right.value}`) : null;

        // If both nodes are found, animate the rotation line drawing
        if (sourceNode && targetNode) {
            await this.animateLineDrawing(targetNode, sourceNode, true);  // true indicates a left rotation
        }

        // Proceed with the rotation logic
        let rightChild = node.right; // The node's right child will be moved up
        node.right = rightChild.left; // Set the node's right child to the left child of its original right child
        if (rightChild.left !== null) {
            rightChild.left.parent = node; // Update parent reference if the left child exists
        }

        // Update parent links to position rightChild in the tree
        rightChild.parent = node.parent;
        if (node.parent === null) {
            this.root = rightChild; // Update root if node is root
        } else if (node === node.parent.left) {
            node.parent.left = rightChild;
        } else {
            node.parent.right = rightChild;
        }

        // Complete the rotation
        rightChild.left = node;
        node.parent = rightChild;

        // Recolor node if needed and re-render the tree after rotation
        if (node.color === 'red') await this.recolorBlack(node);
        renderTree(); // Refresh tree view
    }

    async rotateRight(node) {
        // Identify the source (current node) and target (left child) nodes for animation
        const sourceNode = document.getElementById(`node-${node.value}`);
        const targetNode = node.left ? document.getElementById(`node-${node.left.value}`) : null;

        // If both nodes are found, animate the rotation line drawing
        if (sourceNode && targetNode) {
            await this.animateLineDrawing(targetNode, sourceNode); // No need for true flag, default is right rotation
        }

        // Perform the right rotation logic
        let leftChild = node.left; // The node's left child will be moved up
        node.left = leftChild.right; // Set the node's left child to the right child of its original left child
        if (leftChild.right !== null) {
            leftChild.right.parent = node; // Update parent reference if the right child exists
        }

        // Update parent links to position leftChild in the tree
        leftChild.parent = node.parent;
        if (node.parent === null) {
            this.root = leftChild; // Update root if node is root
        } else if (node === node.parent.right) {
            node.parent.right = leftChild;
        } else {
            node.parent.left = leftChild;
        }

        // Complete the rotation
        leftChild.right = node;
        node.parent = leftChild;

        // Recolor node if needed and re-render the tree after rotation
        if (node.color === 'red') await this.recolorBlack(node);
        renderTree(); // Refresh tree view
    }

    // Recoloring nodes

    async recolorBlack(node) {

        // Check if the node is already black to avoid redundant operations
        if (node.color === 'black') {
            return;
        }

        // Get the HTML element associated with the node for visual updating
        const nodeElement = document.getElementById(`node-${node.value}`);
        if (nodeElement) {
            node.color = 'black'; // Set the node's color property to black
            await this.blinkNode(node, 'black'); // Animate a blink effect for transition
            nodeElement.style.backgroundColor = 'black'; // Apply the final black color
        }

        node.color = 'black'; // Ensure node's color property is updated
        renderTree(); // Refresh the tree to reflect color change
    }

    async recolorRed(node) {

        // Get the HTML element associated with the node for visual updating
        const nodeElement = document.getElementById(`node-${node.value}`);
        if (nodeElement) {
            node.color = 'red'; // Set the node's color property to red
            await this.blinkNode(node, 'red'); // Animate a blink effect for transition
            nodeElement.style.backgroundColor = 'red';  // Apply the final red color
        }

        node.color = 'red'; // Ensure node's color property is updated
        renderTree(); // Refresh the tree to reflect color change
    }

    async animateRecoloring(parent, uncle, grandparent) {

        // Recolor parent node to black if it isn't already black
        if (parent.color !== 'black') {
            console.log(`Blinking and recoloring parent: ${parent.value}`);
            await this.blinkNode(parent, 'black');  // Blink effect for transition
            await this.recolorBlack(parent); // Set parent color to black
        }

        // If uncle exists and is not black, recolor it to black
        if (uncle !== null && uncle.color !== 'black') {
            console.log(`Blinking and recoloring uncle: ${uncle.value}`);
            await this.blinkNode(uncle, 'black'); // Blink effect for transition
            await this.recolorBlack(uncle); // Set uncle color to black
        }

        // Recolor grandparent node to red if it isn't already red
        if (grandparent.color !== 'red') {
            console.log(`Blinking and recoloring grandparent: ${grandparent.value}`);
            await this.blinkNode(grandparent, 'red'); // Blink effect for transition
            await this.recolorRed(grandparent); // Set grandparent color to red
        }

        renderTree(); // Re-render the tree to reflect updated colors
    }

    // Node manipulation and adjustments

    transplant(u, v) {
        if (u.parent === null) { // If 'u' is the root node, replace the root with 'v'.
            this.root = v;

        } else if (u === u.parent.left) { //// If 'u' is the left child of its parent, replace 'u' with 'v' as the left child.
            u.parent.left = v;
        } else { //If 'u' is the right child of its parent, replace 'u' with 'v' as the right child.
            u.parent.right = v;
        }
        if (v !== null) { //If 'v' is not null, set 'v's parent to 'u's parent.
            v.parent = u.parent;
        }
    }

   async fixInsertion(node) {
        
        // Delay to ensure the node is rendered in the DOM before initiating any animation
        await new Promise(resolve => setTimeout(resolve, 500));
        

        // Loop until the node reaches the root or until its parent is black (no violation of Red-Black properties)
        while (node !== this.root && node.parent.color === 'red') {
            let parent = node.parent;
            let grandparent = parent.parent;
        
            if (parent === grandparent.left) { // Case when parent is the left child of the grandparent
                let uncle = grandparent.right; // Uncle is the right child of the grandparent

                
                if (uncle !== null && uncle.color === 'red') {
                    // If uncle is red, recolor parent, uncle, and grandparent to maintain Red-Black properties
                    await this.animateRecoloring(parent, uncle, grandparent);
                    node = grandparent; // Move up to grandparent to continue checking
                } else {

                    // Visual line animation for parent and node
                    const parentNodeElement = document.getElementById(`node-${parent.value}`);
                    this.blinkLine(parentNodeElement, document.getElementById(`node-${node.value}`), 3000, 40);
    
                    // Blink nodes before rotation
                    await this.blinkYellow(node);
                    await this.blinkYellow(parent);
                    await this.blinkYellow(grandparent);
                    await new Promise(resolve => setTimeout(resolve, 1000));
    
                    // Rotation logic to balance the tree
                    if (node === parent.right) {  // Left rotation if node is a right child
                        node = parent;
    
                        // Animate and perform the left rotation
                        await this.animateRotation(node, 'left');
                        await this.rotateLeft(node);
                    }
    
                    await this.animateRotation(grandparent, 'right');
                    await this.rotateRight(grandparent);
    
                    // Recolor parent and grandparent after rotations
                    await this.animateRecoloring(parent, null, grandparent);
                    parent.color = 'black';
                    grandparent.color = 'red';
                }
            } else {

                // Symmetric case: Parent is a right child of the grandparent
                let uncle = grandparent.left;
    
                if (uncle !== null && uncle.color === 'red') {
                    // If uncle is red, recolor parent, uncle, and grandparent to maintain Red-Black properties
                    await this.animateRecoloring(parent, uncle, grandparent);
                    node = grandparent; // Move up to grandparent to continue checking
                    
                } else {

                    // Visual line animation for parent and node
                    const parentNodeElement = document.getElementById(`node-${parent.value}`);
                    this.blinkLine(parentNodeElement, document.getElementById(`node-${node.value}`), 3000, 40);
    
                    // Blink nodes before rotation
                    await this.blinkYellow(node);
                    await this.blinkYellow(parent);
                    await this.blinkYellow(grandparent);
    
                    await new Promise(resolve => setTimeout(resolve, 1000));
    
                    // Rotation logic to balance the tree
                    if (node === parent.left) { // Right rotation if node is a left child
                        node = parent;
    
                        // Animate and perform the right rotation
                        await this.animateRotation(node, 'right');
                        await this.rotateRight(node);
                    }
    
                    await this.animateRotation(grandparent, 'left');
                    await this.rotateLeft(grandparent);
    
                    // Recolor parent and grandparent after rotations
                    await this.animateRecoloring(parent, null, grandparent);
                    parent.color = 'black';
                    grandparent.color = 'red';
                }
            }
        }
    
        console.log('Ensuring root is black');
        await this.recolorBlack(this.root); // Ensure the root node is always black
        console.log('FixInsertion complete');
    }

    async fixDeletion(x) {
        
        // Loop until x is the root or until x is no longer black (to restore Red-Black properties)
        while (x !== this.root && this.getColor(x) === 'black') {
            let parent = x ? x.parent : null;
    
            if (parent === null) {
                // If parent is null, we've reached the root, so exit the loop
                break;
            }
    
            if (x === parent.left) { // Case when x is the left child
                let w = parent.right; // Sibling node
    
                if (this.getColor(w) === 'red') {
                    // Case 1: Sibling is red
                    await this.recolorBlack(w); // Recolor sibling black
                    await this.recolorRed(parent); // Recolor parent red
                    await this.rotateLeft(parent); // Rotate left around parent
                    w = parent.right; // Update sibling after rotation
                }
    
                // Case 2: Sibling's children are both black
                if (this.getColor(w.left) === 'black' && this.getColor(w.right) === 'black') {
                    await this.recolorRed(w); // Recolor sibling red
                    x = parent; // Move up to parent for next iteration
                } else {
                    
                    // Case 3: Sibling’s right child is black and left child is red
                    if (this.getColor(w.right) === 'black') {
                        if (w.left !== null) await this.recolorBlack(w.left);  // Recolor left child black if it exists
                        await this.recolorRed(w); // Recolor sibling red
                        await this.rotateRight(w); // Rotate right around sibling
                        w = parent.right; // Update sibling after rotation
                    }

                    // Case 4: Sibling’s right child is red
                    w.color = parent.color; // Set sibling's color to parent's color
                    await this.recolorBlack(parent); // Recolor parent black
                    if (w.right !== null) await this.recolorBlack(w.right); // Recolor sibling's right child black if it exists
                    await this.rotateLeft(parent); // Rotate left around parent
                    x = this.root; // Set x to root to exit the loop
                }
            } else {
                // Symmetric case when x is the right child
                let w = parent.left; // Sibling node
    
                if (this.getColor(w) === 'red') {

                    // Case 1: Sibling is red
                    await this.recolorBlack(w); // Recolor sibling black
                    await this.recolorRed(parent); // Recolor parent red
                    await this.rotateRight(parent); // Rotate right around parent
                    w = parent.left; // Update sibling after rotation
                }
    
                // Case 2: Sibling's children are both black
                if (this.getColor(w.left) === 'black' && this.getColor(w.right) === 'black') {
                    await this.recolorRed(w); // Recolor sibling red
                    x = parent; // Move up to parent for next iteration
                } else {

                    // Case 3: Sibling’s left child is black and right child is red
                    if (this.getColor(w.left) === 'black') {
                        if (w.right !== null) await this.recolorBlack(w.right); // Recolor right child black if it exists
                        await this.recolorRed(w); // Recolor sibling red
                        await this.rotateLeft(w); // Rotate left around sibling
                        w = parent.left; // Update sibling after rotation
                    }

                    // Case 4: Sibling’s left child is red
                    w.color = parent.color; // Set sibling's color to parent's color
                    await this.recolorBlack(parent);  // Recolor parent black
                    if (w.left !== null) await this.recolorBlack(w.left);  // Recolor sibling's left child black if it exists
                    await this.rotateRight(parent); // Rotate right around parent
                    x = this.root;  // Set x to root to exit the loop
                }
            }
        }
         // Final check: Recolor x to black to ensure the Red-Black properties
        if (x !== null) await this.recolorBlack(x);
    }

    moveSuccessor(nodeToDelete, successor) {
        // Validate that both nodeToDelete and successor exist
        if (!nodeToDelete || !successor) {
            console.error("Invalid nodeToDelete or missing successor.");
            return;
        }
    
        // Select the SVG container and retrieve elements for the successor and the node to delete
        const svgContainer = d3.select('#tree svg');
        const successorCircle = svgContainer.select(`circle#node-${successor.value}`);
        const successorText = svgContainer.select(`text#text-${successor.value}`);
        const nodeToDeleteCircle = svgContainer.select(`circle#node-${nodeToDelete.value}`);
        const nodeToDeleteText = svgContainer.select(`text#text-${nodeToDelete.value}`);
    
        // Ensure both successor and node-to-delete elements exist in the DOM
        if (!successorCircle.empty() && !nodeToDeleteCircle.empty()) {
            // Get the position of the node to delete as the target position
            const targetX = parseFloat(nodeToDeleteCircle.attr('cx'));
            const targetY = parseFloat(nodeToDeleteCircle.attr('cy'));
    
            // Animate the successor circle moving to the node-to-delete's position
            successorCircle.transition()
                .duration(1000)            // Duration of the transition in milliseconds
                .attr('cx', targetX)       // Move to the target X position
                .attr('cy', targetY);      // Move to the target Y position
    
            // Animate the successor text moving to the node-to-delete's position
            successorText.transition()
                .duration(1000)            // Duration of the transition in milliseconds
                .attr('x', targetX)        // Move to the target X position
                .attr('y', targetY + 4);   // Adjust Y for text centering
        }
    } 

    // Animation and visual adjustments

    async blinkNode(node, finalColor, duration = 1000) {
        // Get the HTML element corresponding to the node
        const nodeElement = document.getElementById(`node-${node.value}`);
        if (nodeElement) {
            // Determine the current color and appropriate blink class based on the final color
            const currentColor = node.color;
            const blinkClass = (finalColor === 'black' && currentColor !== 'black') ? 'blink-black' : 'blink-red';
    
            // Add the blink class to the node element to initiate blink animation
            nodeElement.classList.add(blinkClass);
    
            // Wait for the blink animation to complete
            await new Promise(resolve => setTimeout(resolve, duration));
    
            // Remove the blink class after the animation duration
            nodeElement.classList.remove(blinkClass);
    
            // Set the final color as the background color of the node element
            nodeElement.style.backgroundColor = finalColor;
        } else {
            console.error(`Could not find DOM element for node ${node.value}`); // Error handling if node element is not found
        }
    }    

    animateLineDrawing(sourceNode, targetNode) {
        // Return a Promise that resolves when the line animation is complete
        return new Promise((resolve) => {
            // Get or create the SVG container for the line animation
            let svgContainer = document.getElementById('svgCanvas');
            if (!svgContainer) {
                const treeContainer = document.getElementById('tree');
                svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svgContainer.setAttribute('id', 'svgCanvas');
                treeContainer.appendChild(svgContainer);
            }
    
            // Retrieve the positions of the source and target nodes
            const treeContainer = document.getElementById('tree');
            const sourceRect = sourceNode.getBoundingClientRect();
            const targetRect = targetNode.getBoundingClientRect();
            const containerRect = treeContainer.getBoundingClientRect();
    
            // Assume circular nodes and set the node radius
            const nodeRadius = sourceRect.width / 2;
    
            // Calculate the center positions of the source and target nodes relative to `#tree`
            let sourceXCenter = sourceRect.left + sourceRect.width / 2 - containerRect.left;
            let sourceYCenter = sourceRect.top + sourceRect.height / 2 - containerRect.top;
            let targetXCenter = targetRect.left + targetRect.width / 2 - containerRect.left;
            let targetYCenter = targetRect.top + targetRect.height / 2 - containerRect.top;
    
            // Calculate direction vector from source to target and find the distance
            const directionX = targetXCenter - sourceXCenter;
            const directionY = targetYCenter - sourceYCenter;
            const length = Math.sqrt(directionX ** 2 + directionY ** 2);
    
            // Adjust the start and end positions to align with the border of each node
            let sourceX = sourceXCenter + (directionX / length) * nodeRadius;
            let sourceY = sourceYCenter + (directionY / length) * nodeRadius;
            let targetX = targetXCenter - (directionX / length) * nodeRadius;
            let targetY = targetYCenter - (directionY / length) * nodeRadius;
    
            // Create the line element to animate between source and target
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', sourceX);
            line.setAttribute('y1', sourceY);
            line.setAttribute('x2', sourceX); // Start at source position
            line.setAttribute('y2', sourceY); // Start at source position
            line.setAttribute('stroke', 'black');
            line.setAttribute('stroke-width', 2);
            line.setAttribute('marker-end', 'url(#arrow)');
    
            svgContainer.appendChild(line); // Add the line to the SVG container
    
            // Define the animation duration
            const duration = 1500; // milliseconds
            let start = null;
    
            // Define the animation function
            function animate(timestamp) {
                if (!start) start = timestamp;
                const elapsed = timestamp - start;
                const progress = Math.min(elapsed / duration, 1); // Ensure progress doesn’t exceed 1
    
                // Calculate current position based on progress
                const currentX = sourceX + progress * (targetX - sourceX);
                const currentY = sourceY + progress * (targetY - sourceY);
    
                line.setAttribute('x2', currentX);
                line.setAttribute('y2', currentY);
    
                if (progress < 1) {
                    requestAnimationFrame(animate); // Continue animation
                } else {
                    console.log(`Line animation complete from (${sourceX}, ${sourceY}) to (${targetX}, ${targetY})`);
                    setTimeout(() => {
                        svgContainer.removeChild(line); // Remove the line after a short delay
                        resolve(); // Resolve the Promise to signal completion
                    }, 500);
                }
            }
            requestAnimationFrame(animate); // Start the animation
        });
    }
    
    async fadeOutNode(node) {
        // Select the SVG container and retrieve the node and text elements
        const svgContainer = d3.select('#tree svg');
        const nodeElement = svgContainer.select(`circle#node-${node.value}`);
        const textElement = svgContainer.select(`text#text-${node.value}`);
        
        // Check if the node and text elements exist
        if (!nodeElement.empty() && !textElement.empty()) {
            // Bring the node and text to the front to ensure they are visible during the transition
            nodeElement.raise();
            textElement.raise();
        
            // Apply a fade-out transition to both the node and text elements
            nodeElement.transition()
                .duration(1000)           // Duration of the transition in milliseconds
                .style('opacity', 0)      // Fade to transparent
                .remove();                // Remove the element from the DOM after transition
        
            textElement.transition()
                .duration(1000)           // Duration of the transition in milliseconds
                .style('opacity', 0)      // Fade to transparent
                .remove();                // Remove the element from the DOM after transition
        
            // Wait for the transition to complete before resolving
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    
    moveNodeUp(nodeToMove, targetPosition) {
        // Select the SVG container and retrieve the elements for the node to move and the target position
        const svgContainer = d3.select('#tree svg');
        const nodeCircle = svgContainer.select(`circle#node-${nodeToMove.value}`);
        const nodeText = svgContainer.select(`text#text-${nodeToMove.value}`);
        const targetCircle = svgContainer.select(`circle#node-${targetPosition.value}`);
    
        // Check if both the node to move and the target position elements exist
        if (!nodeCircle.empty() && !targetCircle.empty()) {
            // Get the target position coordinates
            const targetX = parseFloat(targetCircle.attr('cx'));
            const targetY = parseFloat(targetCircle.attr('cy'));
    
            // Animate the circle representing the node moving up to the target position
            nodeCircle.transition()
                .duration(1000)           // Duration of the movement animation in milliseconds
                .attr('cx', targetX)      // Update the x-coordinate
                .attr('cy', targetY);     // Update the y-coordinate
    
            // Animate the text label of the node moving up to the target position
            nodeText.transition()
                .duration(1000)           // Duration of the movement animation in milliseconds
                .attr('x', targetX)       // Update the x-coordinate
                .attr('y', targetY + 4);  // Update the y-coordinate, adjusted for text centering
        }
    }

    async animateRotation(node, direction) {
        
        // Define offsets for calculating target positions based on the rotation direction
        const offset = 50; // Offset distance for the X-axis movement
        const targetGrandparentX = grandparentX + (direction === 'left' ? -offset : offset); // Grandparent's new X position
        const targetGrandparentY = grandparentY + 80; // Grandparent's new Y position
        const targetParentX = grandparentX; // Parent's new X position (moves to grandparent's original X position)
        const targetParentY = grandparentY; // Parent's new Y position
        const targetNewNodeX = parentX; // New node's new X position (moves to parent's original X position)
        const targetNewNodeY = parentY; // New node's new Y position
    
        // Animate the nodes involved in the rotation using the `animateNode` function
    
        // Animate the new node, if it exists, to its target position
        if (newNode) {
            await animateNode(newNode.value, targetNewNodeX, targetNewNodeY); // Move new node to target position
            await new Promise(resolve => setTimeout(resolve, 1000)); // Pause briefly after moving the new node
        }
    
        // Animate the parent node to its target position
        await animateNode(parentNode.value, targetParentX, targetParentY);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Pause briefly after moving the parent node
    
        // Animate the original node to the grandparent's target position
        await animateNode(node.value, targetGrandparentX, targetGrandparentY);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Pause briefly after moving the original node
    
    }
      
    // Utility methods for node adjustments

    blinkYellow(node) {
        // Get the DOM element for the node based on its value
        const nodeElement = document.getElementById(`node-${node.value}`);
        
        // Check if the node element exists
        if (nodeElement) {
            // Add the CSS class that applies a yellow blinking effect
            nodeElement.classList.add('blink-yellow');
            
            // Remove the blinking effect after a specified duration (5000 ms)
            setTimeout(() => {
                nodeElement.classList.remove('blink-yellow');
            }, 5000); // Duration in milliseconds
        }
    }
    
    blinkLine(sourceNode, targetNode, duration = 1000, lineLength = 40) {
        // Retrieve or create the SVG container for the blinking line
        let svgContainer = document.getElementById('svgCanvas');
        if (!svgContainer) {
            // Create the SVG container if it doesn't exist
            const treeContainer = document.getElementById('tree');
            svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svgContainer.setAttribute('id', 'svgCanvas');
            treeContainer.appendChild(svgContainer);
        }
    
        // Define the blinking arrow marker if it doesn't exist
        let blinkArrowMarker = document.getElementById('blink-arrow');
        if (!blinkArrowMarker) {
            const defs = svgContainer.querySelector('defs') || svgContainer.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs"));
            blinkArrowMarker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
            blinkArrowMarker.setAttribute('id', 'blink-arrow');
            blinkArrowMarker.setAttribute('viewBox', '0 0 10 10');
            blinkArrowMarker.setAttribute('refX', 10);
            blinkArrowMarker.setAttribute('refY', 5);
            blinkArrowMarker.setAttribute('markerWidth', 6);
            blinkArrowMarker.setAttribute('markerHeight', 6);
            blinkArrowMarker.setAttribute('orient', 'auto-start-reverse');
    
            // Define the red arrowhead path for the marker
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
            path.setAttribute('fill', 'red');
            blinkArrowMarker.appendChild(path);
            defs.appendChild(blinkArrowMarker);
        }
    
        // Get the positions of the source and target nodes
        const sourceRect = sourceNode.getBoundingClientRect();
        const targetRect = targetNode.getBoundingClientRect();
        const containerRect = document.getElementById('tree').getBoundingClientRect();
    
        // Calculate center positions relative to `#tree`
        const startX = sourceRect.left + sourceRect.width / 2 - containerRect.left;
        const startY = sourceRect.top + sourceRect.height / 2 - containerRect.top;
        const endX = targetRect.left + targetRect.width / 2 - containerRect.left;
        const endY = targetRect.top + targetRect.height / 2 - containerRect.top;
    
        // Calculate direction vector and distance between nodes
        const dx = endX - startX;
        const dy = endY - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
    
        // Normalize the direction vector
        const normalizedDx = dx / distance;
        const normalizedDy = dy / distance;
    
        // Adjust the start and end points to be on the borders of the nodes
        const nodeRadius = sourceRect.width / 2;
        const adjustedStartX = startX + normalizedDx * nodeRadius;
        const adjustedStartY = startY + normalizedDy * nodeRadius;
        const adjustedEndX = endX - normalizedDx * nodeRadius;
        const adjustedEndY = endY - normalizedDy * nodeRadius;
    
        // Create and configure the line element
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', adjustedStartX);
        line.setAttribute('y1', adjustedStartY);
        line.setAttribute('x2', adjustedEndX);
        line.setAttribute('y2', adjustedEndY);
        line.setAttribute('stroke', 'red');
        line.setAttribute('stroke-width', 2);
        line.setAttribute('marker-end', 'url(#blink-arrow)');
    
        // Append the line to the SVG container and add the blinking class
        svgContainer.appendChild(line);
        line.classList.add('blink-red-line');
    
        // Blinking effect: Toggle blink class periodically for the line
        const blinkInterval = setInterval(() => {
            line.classList.toggle('blink-red-line'); // Toggle blinking on and off
        }, duration / 4); // Blink toggle frequency
    
        // Remove the blinking effect and line after the specified duration
        setTimeout(() => {
            clearInterval(blinkInterval);
            line.classList.remove('blink-red-line');
            svgContainer.removeChild(line);
        }, duration);
    }    

    // Utility for getting node color

    getColor(node) {
        return node === null ? 'black' : node.color;
    }

}


//Setup and Initialization

//Initialize the Red-Black Tree instance
const tree = new RedBlackTree();


// UI Event Handlers Setup

document.addEventListener("DOMContentLoaded", function() {
    // Function to open the modal for predefined tree or traversal selection
    document.getElementById("openModalBtn").onclick = function() {
        document.getElementById("treeModal").style.display = "block"; // Show modal
    };

    // Function to close modal when clicking the close button
    document.getElementById("closeModalBtn").onclick = function() {
        document.getElementById("treeModal").style.display = "none"; // Hide modal
    };

    // Function to close modal if user clicks outside the modal content
    window.onclick = function(event) {
        const modal = document.getElementById("treeModal");
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    // Event listeners for buttons to render predefined trees
    document.getElementById("renderTree1Btn").onclick = renderPredefinedTree1;
    document.getElementById("renderTree2Btn").onclick = renderPredefinedTree2;
    document.getElementById("renderTree3Btn").onclick = renderPredefinedTree3;

    // Event listener to open the traversal selection modal
    document.getElementById("printBtn").onclick = function() {
        document.getElementById("traversalModal").style.display = "block"; // Show traversal selection modal
    };

    // Event listener to close traversal modal
    document.querySelector('.close').onclick = function() {
        document.getElementById("traversalModal").style.display = "none"; // Hide traversal selection modal
    };

    // Start the animated traversal based on user selection
    document.getElementById("inOrderTraversalBtn").onclick = function() {
        startAnimatedTraversal('inOrder');
    };
    document.getElementById("preOrderTraversalBtn").onclick = function() {
        startAnimatedTraversal('preOrder');
    };
    document.getElementById("postOrderTraversalBtn").onclick = function() {
        startAnimatedTraversal('postOrder');
    };
});

document.getElementById('nodeValue').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        insertNode();
    }
});

document.getElementById('showNullLeavesCheckbox').addEventListener('change', function() {
    renderTree(); // Re-render the tree whenever the checkbox state changes
});


// Node Manipulation Functions

// Inserts a new node into the Red-Black Tree and animates the insertion process.
function insertNode() {
    const value = document.getElementById('nodeValue').value; // Get the value from the input field with the id 'nodeValue'.

    // Check if the value is not provided or is not a number.
    if (!value || isNaN(value)) {
        alert('Please enter a valid number.');
        return;
    }

    // Start the animation by adding a red node at the top-left corner
    let newNodeElement = document.createElement('div');
    newNodeElement.className = 'node new-node';  // Apply blinking effect with the new-node class
    newNodeElement.style.position = 'absolute';
    newNodeElement.style.left = '5px';  // Initial top-left corner position
    newNodeElement.style.top = '5px';
    newNodeElement.style.backgroundColor = 'red';
    newNodeElement.style.color = 'white';  // Text color to white
    newNodeElement.style.border = '2px solid black';  // Black border around the node
    newNodeElement.style.borderRadius = '50%';  // Make the node circular
    newNodeElement.style.transition = 'all 2s ease';  // Smooth transition effect
    newNodeElement.innerText = value; // Display the node value

    // Append the new node to the tree container for initial display
    const container = document.getElementById('tree');
    container.appendChild(newNodeElement);

    // If this is the first node, insert it directly without traversal
    if (tree.root === null) {
        setTimeout(() => {
            container.removeChild(newNodeElement); // Remove the temporary new node element
            tree.insert(Number(value));  // Insert the new node into the tree data structure
            renderTree();  // Render the tree to display the new state
        }, 3000);  // Delay for 3 seconds to allow blinking effect
        return;
    }

    // Step 1: Start the traversal animation
    const traversalCircle = document.createElement('div');
    traversalCircle.className = 'node traversal-node';  // Class for the yellow traversal circle
    traversalCircle.style.marginLeft = '8px';
    traversalCircle.style.marginTop = '8px';
    traversalCircle.style.borderRadius = '50%';
    traversalCircle.style.transition = 'all 3s ease';  // Smooth movement for traversal
    traversalCircle.style.width = '20px';
    traversalCircle.style.height = '20px';

    // Start traversal from the root node
    let current = tree.root;
    const traverseTree = async () => {
        while (current !== null) {
            const currentNodeElement = document.getElementById(`node-${current.value}`);
            const rect = currentNodeElement.getBoundingClientRect();

            // Move the traversal circle to the current node's position
            traversalCircle.style.left = `${rect.left + rect.width / 2 - 54}px`;  // Center the circle horizontally
            traversalCircle.style.top = `${rect.top + rect.height / 2 - 115}px`; // Center the circle vertically

            await new Promise(resolve => setTimeout(resolve, 5000));  // Wait for 5 seconds before moving to the next node

            // Move left or right based on the comparison
            if (value < current.value) {
                current = current.left;
            } else {
                current = current.right;
            }
        }

        // Once the correct position is found, remove the traversal circle
        container.removeChild(traversalCircle);

        // Step 2: After traversal, remove the new node blinking at the top-left
        container.removeChild(newNodeElement);

        // Insert the new node into the tree
        tree.insert(Number(value));
        renderTree();  // Render the updated tree with the new node inserted
    };

    // Append the traversal circle to the DOM and start the traversal animation
    container.appendChild(traversalCircle);
    traverseTree(); // Start the asynchronous traversal
}

// Deletes a node from the Red-Black Tree and manages animations related to node deletion.
async function deleteNode() {
    // Get the node value from the input field and validate it
    const value = parseInt(document.getElementById('nodeValue').value);
    if (isNaN(value)) {
        alert('Please enter a valid node value.');
        return;
    }

    // Start traversal from the root to find the node to be deleted
    let currentNode = tree.root;

    // Create or select an SVG circle for highlighting during traversal
    let svg = document.getElementById('highlightCircle');
    if (!svg) {
        // Create the highlight circle if it doesn't exist
        svg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        svg.setAttribute("id", "highlightCircle");
        svg.setAttribute("r", 20); // Set circle radius
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "yellow"); // Yellow for traversal
        svg.setAttribute("stroke-width", 4);
        document.querySelector('svg').appendChild(svg);
    } else {
        svg.setAttribute("stroke", "yellow"); // Reset the color if reusing an existing circle
    }

    // Use the traverseToDelete function to animate traversal and find the node to delete
    const nodeToDelete = await traverseToDelete(currentNode, null, value, svg);

    // Check if the node was found
    if (!nodeToDelete) {
        alert('Node not found.');
        return;
    }

    // Highlight relationships (e.g., parent-child connections) before deletion
    await highlightRelationships(nodeToDelete);

    // Delete the node (fade-out handled within the delete method)
    await tree.delete(nodeToDelete.value);

    // Render the tree to reflect the current state after deletion
    renderTree();
}

// Searches for a node in the Red-Black Tree and highlights the search path.
function searchNode() {
    // Get the target node value from the input field and validate it
    const targetValue = parseInt(document.getElementById('nodeValue').value);
    if (isNaN(targetValue)) {
        alert('Please enter a valid node value.');
        return;
    }

    let currentNode = tree.root;

    // Ensure the SVG container for the highlight circle exists
    let svgContainer = document.getElementById('svgCanvas');
    if (!svgContainer) {
        const treeContainer = document.getElementById('tree');
        svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgContainer.setAttribute('id', 'svgCanvas');
        svgContainer.setAttribute('width', '100%');
        svgContainer.setAttribute('height', '100%');
        treeContainer.appendChild(svgContainer);
    }

    // Ensure the highlight circle exists
    let circle = document.getElementById('highlightCircle');
    if (!circle) {
        // Create the circle if it doesn't exist
        circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("id", "highlightCircle");
        circle.setAttribute("r", 20); // Circle radius
        circle.setAttribute("fill", "none");
        circle.setAttribute("stroke", "yellow"); // Yellow for traversal
        circle.setAttribute("stroke-width", 4);
        svgContainer.appendChild(circle);
    } else {
        circle.setAttribute("stroke", "yellow"); // Reset stroke color to yellow
    }

    // Traversing function to search for the target node
    function traverse(node, parentElement) {
        if (!node || node.value === 'NIL') return; // Skip null nodes and null leaves

        // Select the DOM element representing the node
        const nodeElement = document.getElementById(`node-${node.value}`);
        if (!nodeElement || node.isNull) {
            return;
        }

        const originalColor = node.color === 'red' ? 'red' : 'black'; // Store the node's original color

        // Animate movement from the parent node to the current node
        if (parentElement) {
            moveHighlightTo(circle, parentElement, nodeElement, 1000); // Move circle over 1000ms
        } else {
            // If starting at the root, place the circle there initially
            moveHighlightTo(circle, null, nodeElement, 0); // Place circle with no movement
        }

        // Timer to pause at the current node before evaluating
        setTimeout(() => {
            // If the current node matches the target value
            if (node.value === targetValue) {
                nodeElement.classList.add('blink-green'); // Add blinking effect in green
                circle.setAttribute("stroke", "green"); // Change circle stroke to green

                // Remove the circle after a brief delay and clear blink effect
                setTimeout(() => {
                    circle.remove(); // Remove the circle after blinking
                    clearBlink(nodeElement, originalColor); // Restore node's original color
                }, 1500); // Keep circle green for 1.5 seconds

                return; // Stop traversal once target node is found
            }

            // Continue traversal if the current node is not the target
            const nextNode = targetValue < node.value ? node.left : node.right;
            traverse(nextNode, nodeElement); // Traverse to the left or right child
        }, 2000); // Pause at the current node for 2 seconds before continuing
    }

    traverse(currentNode, null); // Start traversal from the root node
}


//Animation and Utility Functions

// Moves a visual highlight from one node to another.
function moveHighlightTo(circle, startNodeElement, endNodeElement, duration = 1000) {
    // Return a Promise that resolves when the circle has reached the end position
    return new Promise((resolve) => {
        if (!endNodeElement) {
            // Log error if endNodeElement is missing and resolve immediately
            resolve();
            return;
        }

        // If starting at the root, move the circle directly to the end position
        if (!startNodeElement) {
            const endX = parseFloat(endNodeElement.getAttribute('cx'));
            const endY = parseFloat(endNodeElement.getAttribute('cy'));
            circle.setAttribute("cx", endX);
            circle.setAttribute("cy", endY);
            resolve();
            return;
        }

        // If moving between two points, interpolate movement from start to end
        const startX = parseFloat(startNodeElement.getAttribute('cx'));
        const startY = parseFloat(startNodeElement.getAttribute('cy'));
        const endX = parseFloat(endNodeElement.getAttribute('cx'));
        const endY = parseFloat(endNodeElement.getAttribute('cy'));

        const deltaX = endX - startX; // X-axis distance to cover
        const deltaY = endY - startY; // Y-axis distance to cover

        const frames = 60; // Number of frames for smooth animation
        const frameDuration = duration / frames; // Duration of each frame in milliseconds

        let currentFrame = 0; // Initialize frame counter

        // Define the animation step function
        function animateStep() {
            if (currentFrame < frames) {
                const progress = currentFrame / frames; // Progress as a fraction

                // Calculate the current position of the circle based on progress
                const currentX = startX + deltaX * progress;
                const currentY = startY + deltaY * progress;

                // Update the circle position on each frame
                circle.setAttribute("cx", currentX);
                circle.setAttribute("cy", currentY);

                currentFrame++; // Increment frame count
                setTimeout(animateStep, frameDuration); // Schedule the next frame
            } else {
                // Ensure the circle lands precisely at the end position
                circle.setAttribute("cx", endX);
                circle.setAttribute("cy", endY);
                resolve(); // Resolve the Promise to indicate animation completion
            }
        }

        animateStep(); // Start the animation
    });
}

// Animates a node moving from one position to another in the SVG canvas.
function animateNode(nodeValue, targetX, targetY) {
    // Select the SVG container and retrieve the circle and text elements for the node
    const svgContainer = d3.select('#tree svg');
    
    // Use D3.js to select the circle and text elements associated with the node value
    const circle = svgContainer.select(`circle#node-${nodeValue}`);
    const text = svgContainer.select(`text#text-${nodeValue}`);
    
    // Ensure both the circle and text elements exist
    if (!circle.empty() && !text.empty()) {
        // Animate the movement of the circle to the target position
        circle.transition()
            .duration(1000) // Duration of the transition in milliseconds
            .attr('cx', targetX) // Target x-coordinate for the circle
            .attr('cy', targetY); // Target y-coordinate for the circle
    
        // Animate the movement of the text to the target position
        text.transition()
            .duration(1000) // Match the duration to the circle's transition
            .attr('x', targetX) // Target x-coordinate for the text
            .attr('y', targetY + 4); // Target y-coordinate for text, adjusted for centering
    
        // Optionally, update attributes after transition to ensure final position accuracy
        setTimeout(() => {
            circle.attr('cx', targetX).attr('cy', targetY);
            text.attr('x', targetX).attr('y', targetY + 4);
        }, 1000); // Timeout matches the duration of the transition
    } else {
        console.error(`Could not find elements for node with value ${nodeValue}`);
    }
}

// Visualizes a node and its connections in the DOM.
function renderNode(node, container, parentNode, isLeft) {
    // Create a new div element to represent the node
    const element = document.createElement('div');
    element.className = 'node'; // Apply CSS styling for the node
    element.id = `node-${node.value}`; // Set a unique ID based on node value
    element.innerText = node.value; // Display the node value as text
    element.style.backgroundColor = node.color === 'red' ? 'red' : 'black'; // Set background color based on node color
    container.appendChild(element); // Append the new node to the container

    if (parentNode) { // Only draw a connecting line if there's a parent node
        const line = document.createElement('div'); // Create a line element to connect to the parent
        line.className = 'line'; // Apply CSS styling for the line

        // Get the bounding rectangles for the parent and container
        const parentRect = parentNode.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        console.log('Parent Rect:', parentRect); // Log parent rectangle for debugging

        // Initial positioning for the new node (placed beside the parent)
        element.style.position = 'absolute';
        element.style.left = `${parentRect.right + 50}px`; // Offset to the right of the parent
        element.style.top = `${parentRect.top}px`; // Same vertical position as the parent

        // Animate the new node to its final position after a short delay
        setTimeout(() => {
            const elementRect = element.getBoundingClientRect();
            console.log('New Node Initial Position:', elementRect); // Log initial position for debugging

            // Calculate the center X of the parent node and adjust the vertical positioning
            const parentCenterX = parentRect.left + parentRect.width / 2 - containerRect.left;
            const parentBottomY = parentRect.bottom - containerRect.top;
            const elementTopY = elementRect.top - containerRect.top;

            // Apply smooth transitions to the left and top positions
            element.style.transition = 'left 1s, top 1s';
            element.style.left = `${parentCenterX - (isLeft ? 50 : -50)}px`; // Offset left or right based on `isLeft`
            element.style.top = `${parentBottomY + 50}px`; // Position 50px below the parent node

            console.log('New Node Final Position:', {
                left: element.style.left,
                top: element.style.top
            }); // Log final position for debugging
        }, 500); // Delay to show animation effect
    }
}

// Removes blinking effects from a node.
function clearBlink(nodeElement, originalColor) {
    // Remove any blinking classes from the node (both 'blink-red' and 'blink-green')
    nodeElement.classList.remove('blink-red', 'blink-green');

    // Restore the node's background color to its original color
    nodeElement.style.backgroundColor = originalColor;
}

// Ensures the presence of a highlight circle in the SVG for animations.
function ensureHighlightCircle() {
    // Check if the SVG container for highlights exists
    let svgContainer = document.getElementById('svgCanvas');
    if (!svgContainer) {
        // If not, create a new SVG container and append it to the tree container
        const treeContainer = document.getElementById('tree');
        svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgContainer.setAttribute('id', 'svgCanvas');
        svgContainer.setAttribute('width', '100%');
        svgContainer.setAttribute('height', '100%');
        treeContainer.appendChild(svgContainer);
    }

    // Check if the highlight circle already exists
    let circle = document.getElementById("highlightCircle");
    if (!circle) {
        // If not, create a new circle with highlight properties
        circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("id", "highlightCircle");
        circle.setAttribute("r", 20); // Radius of the circle
        circle.setAttribute("fill", "transparent"); // Transparent fill color
        circle.setAttribute("stroke", "green"); // Green stroke for highlight effect
        circle.setAttribute("stroke-width", 5); // Stroke width for visibility

        // Append the highlight circle to the SVG container
        svgContainer.appendChild(circle);
    }
    return circle; // Return the circle element for further manipulation
}

// Moves a highlight circle to a node and ensures it completes visually.
function moveHighlightToPrint(circleElement, endNodeElement, duration = 1000) {
    // Return a Promise that resolves when the highlight circle reaches the end position
    return new Promise((resolve) => {
        // Check if the end node element exists
        if (!endNodeElement) {
            resolve(); // Resolve the Promise immediately to avoid errors
            return;
        }

        // Get the target X and Y coordinates from the end node element
        const endX = parseFloat(endNodeElement.getAttribute('cx'));
        const endY = parseFloat(endNodeElement.getAttribute('cy'));

        // Use D3.js to smoothly transition the circle element to the target coordinates
        d3.select(circleElement)
            .transition()
            .duration(duration) // Set the duration of the transition
            .attr('cx', endX)   // Update the x-coordinate of the circle
            .attr('cy', endY)   // Update the y-coordinate of the circle
            .on('end', resolve); // Resolve the Promise once the transition ends
    });
}

// Traverses the tree visually to locate the node to delete, animating the movement from parent to child nodes and highlighting the node once found.
async function traverseToDelete(node, parentElement, value, svg) {
    // Base case: if node is null, return null (node not found)
    if (!node) {
        return null;
    }

    // Get the DOM element associated with the current node
    const nodeElement = document.getElementById(`node-${node.value}`);
    if (!nodeElement) {
        console.error(`Node element for node ${node.value} not found!`);
        return null;
    }

    // Animate movement from the parent node to the current node
    if (parentElement) {
        await moveHighlightTo(svg, parentElement, nodeElement, 1000); // Move circle over 1000 ms
    } else {
        // If starting at the root, position the circle directly over the root node
        await moveHighlightTo(svg, null, nodeElement, 0); // No movement required
    }

    // Wait for 2 seconds before evaluating if the current node matches the target value
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (node.value === value) {
        // If the current node matches the value to delete, flash green to indicate selection
        nodeElement.classList.add('blink-green');
        svg.setAttribute("stroke", "green"); // Change circle stroke to green

        // Wait for the green blink to complete
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Remove the highlight circle and reset the node's original color
        svg.remove();
        clearBlink(nodeElement, node.color); // Restore original color
        return node; // Return the found node for deletion
    } else {
        // Recursively traverse the tree in the appropriate direction based on the value
        const nextNode = value < node.value ? node.left : node.right;
        return await traverseToDelete(nextNode, nodeElement, value, svg);
    }
}

// Highlights the connections (lines) from a node to its parent and children to visually depict relationships before deletion.
async function highlightRelationships(node) {
    // Ensure the SVG container for drawing lines exists
    let svgContainer = document.getElementById('svgCanvas');
    if (!svgContainer) {
        const treeContainer = document.getElementById('tree');
        svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgContainer.setAttribute('id', 'svgCanvas');
        treeContainer.appendChild(svgContainer);
    }

    // Select the current node element and its related elements (parent and children)
    const nodeElement = document.getElementById(`node-${node.value}`);
    const parentElement = node.parent ? document.getElementById(`node-${node.parent.value}`) : null;
    const leftChildElement = node.left ? document.getElementById(`node-${node.left.value}`) : null;
    const rightChildElement = node.right ? document.getElementById(`node-${node.right.value}`) : null;

    // Helper function to draw and animate a line between two elements
    const drawLine = (from, to, color) => {
        if (from && to) {
            // Calculate the center points for starting and ending positions
            let fromCenter = getCenter(from);
            let toCenter = getCenter(to);
            
            // Create an SVG line element and set its attributes
            let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute('x1', fromCenter.centerX);
            line.setAttribute('y1', fromCenter.centerY);
            line.setAttribute('x2', toCenter.centerX);
            line.setAttribute('y2', toCenter.centerY);
            line.setAttribute('stroke', color); // Line color
            line.setAttribute('stroke-width', 3);
            svgContainer.appendChild(line);

            // Optional: Animate the line drawing
            line.style.transition = 'stroke-dashoffset 1s ease-in-out';
            const lineLength = Math.sqrt(Math.pow(toCenter.centerX - fromCenter.centerX, 2) + Math.pow(toCenter.centerY - fromCenter.centerY, 2));
            line.setAttribute('stroke-dasharray', `${lineLength}`);
            line.setAttribute('stroke-dashoffset', `${lineLength}`);
            setTimeout(() => {
                line.setAttribute('stroke-dashoffset', '0'); // Animate to full length
            }, 100);

            return line;
        }
        return null; // Return null if either from or to elements are missing
    };

    // Draw lines to the parent, left child, and right child
    let lines = [];
    if (parentElement) {
        lines.push(drawLine(nodeElement, parentElement, 'yellow')); // Line to parent
    }
    if (leftChildElement) {
        lines.push(drawLine(nodeElement, leftChildElement, 'yellow')); // Line to left child
    }
    if (rightChildElement) {
        lines.push(drawLine(nodeElement, rightChildElement, 'yellow')); // Line to right child
    }

    // Wait briefly to highlight the relationships
    await new Promise(resolve => setTimeout(resolve, 4000));

    // Remove lines after the wait period if proceeding to deletion
    lines.forEach(line => svgContainer.removeChild(line));
}

// Calculates the center coordinates of a given element, allowing accurate positioning for lines and highlights relative to the tree container.
function getCenter(element) {
    // Get the bounding rectangle of the element to determine its position and size
    const rect = element.getBoundingClientRect();

    // Get the bounding rectangle of the tree container to calculate the element's position relative to it
    const treeContainerRect = document.getElementById('tree').getBoundingClientRect();

    // Calculate the center coordinates of the element relative to the tree container
    return {
        centerX: rect.left + rect.width / 2 - treeContainerRect.left, // Center X position
        centerY: rect.top + rect.height / 2 - treeContainerRect.top  // Center Y position
    };
}


//Traversal Animation Functions

// Initiates the animated traversal of the tree based on selected traversal type.
function startAnimatedTraversal(type) {
    // Ensure the highlight circle exists for the traversal animation
    const circle = ensureHighlightCircle();
    document.getElementById("traversalModal").style.display = "none"; // Close the modal for traversal type selection

    // Make the traversal result container visible and clear any previous results
    const resultContainer = document.getElementById("traversalResult");
    resultContainer.style.display = "block"; // Show the result container
    resultContainer.innerHTML = ''; // Clear any previous results

    // Object to keep track of the previous node element during traversal
    let traversalState = {
        previousNodeElement: null
    };

    // Initialize the traversal promise based on the selected traversal type
    let traversalPromise;
    if (type === 'inOrder') {
        traversalPromise = animateInOrder(tree.root, circle, traversalState); // Start in-order traversal animation
    } else if (type === 'preOrder') {
        traversalPromise = animatePreOrder(tree.root, circle, traversalState); // Start pre-order traversal animation
    } else if (type === 'postOrder') {
        traversalPromise = animatePostOrder(tree.root, circle, traversalState); // Start post-order traversal animation
    }

    // Once the traversal completes, perform cleanup actions
    traversalPromise.then(() => {
        setTimeout(() => {
            // Hide the highlight circle after traversal completion
            circle.style.display = 'none';

            // Clear the traversal results after a 10-second delay
            setTimeout(() => {
                resultContainer.style.display = 'none'; // Hide the result container
                resultContainer.innerHTML = ''; // Clear the visual contents of results
            }, 10000); // Delay to allow viewing of results before clearing

        }, 500); // Short delay before hiding the highlight circle
    });
}

// Animates the in-order traversal of the tree.
async function animateInOrder(node, circleElement, traversalState) {
    // Check if the node is not null and not a 'NIL' placeholder
    if (node !== null && node.value !== 'NIL') {
        // Recursively animate in-order traversal for the left subtree
        await animateInOrder(node.left, circleElement, traversalState);

        // Get the DOM element for the current node
        const nodeElement = document.getElementById(`node-${node.value}`);
        
        // Move the highlight circle to the current node's position
        await moveHighlightToPrint(circleElement, nodeElement, 1000);

        // Display the current node's value in the result container after highlighting
        printNodeValue(node.value);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Pause for 2 seconds to view the highlight

        // Update traversal state to track the last visited node
        traversalState.previousNodeElement = nodeElement;

        // Recursively animate in-order traversal for the right subtree
        await animateInOrder(node.right, circleElement, traversalState);
    }
}

// Animates the pre-order traversal of the tree.
async function animatePreOrder(node, circleElement, traversalState) {
    // Check if the node is not null and not a 'NIL' placeholder
    if (node !== null && node.value !== 'NIL') {
        // Get the DOM element for the current node
        const nodeElement = document.getElementById(`node-${node.value}`);

        // Move the highlight circle to the current node's position
        await moveHighlightToPrint(circleElement, nodeElement, 1000);

        // Display the current node's value in the result container after highlighting
        printNodeValue(node.value);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Pause for 2 seconds to view the highlight

        // Update traversal state to track the last visited node
        traversalState.previousNodeElement = nodeElement;

        // Recursively animate pre-order traversal for the left and right subtrees
        await animatePreOrder(node.left, circleElement, traversalState);
        await animatePreOrder(node.right, circleElement, traversalState);
    }
}

// Animates the post-order traversal of the tree.
async function animatePostOrder(node, circleElement, traversalState) {
    // Check if the node is not null and not a 'NIL' placeholder
    if (node !== null && node.value !== 'NIL') {
        // Recursively animate post-order traversal for the left subtree
        await animatePostOrder(node.left, circleElement, traversalState);

        // Recursively animate post-order traversal for the right subtree
        await animatePostOrder(node.right, circleElement, traversalState);

        // Get the DOM element for the current node
        const nodeElement = document.getElementById(`node-${node.value}`);

        // Move the highlight circle to the current node's position
        await moveHighlightToPrint(circleElement, nodeElement, 1000);

        // Display the current node's value in the result container after highlighting
        printNodeValue(node.value);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Pause for 2 seconds to view the highlight

        // Update traversal state to track the last visited node
        traversalState.previousNodeElement = nodeElement;
    }
}

// Displays the value of a node during traversal animations.
function printNodeValue(value) {
    // Select the container where traversal results are displayed
    const resultContainer = document.getElementById("traversalResult");

    // Append the current node value to the container with a margin for spacing
    resultContainer.innerHTML += `<span style="margin-right: 10px;">${value}</span>`;
}


// Tree Rendering and Visualization

// Renders the entire Red-Black Tree visually on the SVG canvas.
function renderTree(foundNode = null) {
    const treeContainer = document.getElementById('tree');
    treeContainer.innerHTML = ''; // Clear the tree container before re-rendering

    const width = treeContainer.clientWidth;
    const height = treeContainer.clientHeight;

    const nodes = []; // Array to hold all nodes for rendering
    const links = []; // Array to hold links (edges) between nodes

    const showNullLeaves = document.getElementById('showNullLeavesCheckbox').checked; // Check if null leaves should be shown

    // Recursive traversal function to gather nodes and links
    function traverse(node, x, y, level, xOffset) {
        if (node !== null) {
            nodes.push({ node, x, y, isNull: node.value === 'NIL' }); // Add the current node to nodes array

            const ySpacing = 80; // Vertical spacing between levels
            const newY = y + ySpacing;

            if (node.left !== null) {
                const newXOffset = xOffset / 1.5;
                links.push({ source: { x, y }, target: { x: x - xOffset, y: newY } }); // Add a link to the left child
                traverse(node.left, x - xOffset, newY, level + 1, newXOffset);
            } else if (showNullLeaves) { // Render a null node if enabled in settings
                const newXOffset = xOffset / 1.5;
                const nullNode = new Node('NIL', 'black'); // Create a 'NIL' node
                nodes.push({ node: nullNode, x: x - xOffset, y: newY, isNull: true });
                links.push({ source: { x, y }, target: { x: x - xOffset, y: newY } });
            }

            if (node.right !== null) {
                const newXOffset = xOffset / 1.5;
                links.push({ source: { x, y }, target: { x: x + xOffset, y: newY } }); // Add a link to the right child
                traverse(node.right, x + xOffset, newY, level + 1, newXOffset);
            } else if (showNullLeaves) { // Render a null node if enabled in settings
                const newXOffset = xOffset / 1.5;
                const nullNode = new Node('NIL', 'black');
                nodes.push({ node: nullNode, x: x + xOffset, y: newY, isNull: true });
                links.push({ source: { x, y }, target: { x: x + xOffset, y: newY } });
            }
        }
    }

    traverse(tree.root, width / 2, 30, 1, width / 12); // Start the traversal from the root

    // Create the SVG container
    const svgContainer = d3.select('#tree').append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`);

    // Define an arrow marker for links
    svgContainer.append('defs')
        .append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', '0 0 10 10')
        .attr('refX', 10)
        .attr('refY', 5)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto-start-reverse')
        .append('path')
        .attr('d', 'M 0 0 L 10 5 L 0 10 z')
        .attr('fill', 'black');

    // Render links between nodes
    const linkSelection = svgContainer.selectAll('line')
        .data(links);

    linkSelection.enter()
        .append('line')
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrow)'); // Use arrow markers at the ends of links

    // Separate non-null and null nodes
    const nonNullNodes = nodes.filter(d => !d.isNull);
    const nullNodes = nodes.filter(d => d.isNull);

    // Render non-null nodes (circles)
    svgContainer.selectAll('circle')
        .data(nonNullNodes)
        .enter()
        .append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 15)
        .attr('fill', d => d.node.color)
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('id', d => `node-${d.node.value}`)
        .on('mouseover', function(d) {
            d3.select(this).attr('stroke', 'blue'); // Change stroke color on hover
        })
        .on('mouseout', function(d) {
            d3.select(this).attr('stroke', 'black'); // Revert stroke color when mouse leaves
        });

    // Render null nodes (squares)
    svgContainer.selectAll('.null-node')
        .data(nullNodes)
        .enter()
        .append('rect')
        .attr('x', d => d.x - 15)
        .attr('y', d => d.y - 15)
        .attr('width', 30)
        .attr('height', 30)
        .attr('fill', 'black')
        .attr('stroke', 'darkgray')
        .attr('stroke-width', 2)
        .attr('id', d => `node-${d.node.value}`)
        .attr('class', 'null-node');

    // Render text labels for all nodes
    svgContainer.selectAll('text')
        .data(nodes)
        .enter()
        .append('text')
        .attr('id', d => `text-${d.node.value}`)
        .attr('x', d => d.x)
        .attr('y', d => d.y + 4)
        .attr('text-anchor', 'middle')
        .attr('fill', d => d.isNull ? 'white' : 'white') // Text color for nodes
        .style('font-weight', d => d.isNull ? 'bold' : 'normal') // Bold text for null nodes
        .text(d => d.node.value);

    // If a specific node was found, apply a blink effect to highlight it
    if (foundNode) {
        blinkNode(foundNode);
    }
}

// Render specific predefined tree structures for demonstration.

// Function to render Predefined Tree 1 (Depth: 2)
function renderPredefinedTree1() {
    const treeContainer = document.getElementById('tree');
    treeContainer.innerHTML = ''; // Clear any previous tree

    const predefinedTree = new RedBlackTree();

    // Structure: Depth 2
    predefinedTree.root = new Node(10, 'black');
    predefinedTree.root.left = new Node(5, 'red');
    predefinedTree.root.right = new Node(15, 'red');

    // Link parent-child relationships
    predefinedTree.root.left.parent = predefinedTree.root;
    predefinedTree.root.right.parent = predefinedTree.root;

    // Set the predefined tree's root as the main tree's root and render
    tree.root = predefinedTree.root; 
    renderTree(); 
}

// Function to render Predefined Tree 2 (Depth: 3)
function renderPredefinedTree2() {
    const treeContainer = document.getElementById('tree');
    treeContainer.innerHTML = ''; // Clear any previous tree

    const predefinedTree = new RedBlackTree();

    // Structure: Depth 3
    predefinedTree.root = new Node(20, 'black');
    predefinedTree.root.left = new Node(10, 'black');
    predefinedTree.root.right = new Node(30, 'black');
    predefinedTree.root.left.left = new Node(5, 'red');
    predefinedTree.root.left.right = new Node(15, 'red');

    // Link parent-child relationships
    predefinedTree.root.left.parent = predefinedTree.root;
    predefinedTree.root.right.parent = predefinedTree.root;
    predefinedTree.root.left.left.parent = predefinedTree.root.left;
    predefinedTree.root.left.right.parent = predefinedTree.root.left;

    // Set the predefined tree's root as the main tree's root and render
    tree.root = predefinedTree.root; 
    renderTree(); 
}

// Function to render Predefined Tree 3 (Depth: 4)
function renderPredefinedTree3() {
    const treeContainer = document.getElementById('tree');
    treeContainer.innerHTML = ''; // Clear any previous tree

    const predefinedTree = new RedBlackTree();

    // Structure: Depth 4
    predefinedTree.root = new Node(50, 'black');
    predefinedTree.root.left = new Node(30, 'red');
    predefinedTree.root.right = new Node(70, 'black');
    predefinedTree.root.left.left = new Node(20, 'black');
    predefinedTree.root.left.right = new Node(40, 'black');
    predefinedTree.root.right.left = new Node(60, 'red');
    predefinedTree.root.right.right = new Node(80, 'red');
    predefinedTree.root.left.left.left = new Node(10, 'red');

    // Link parent-child relationships
    predefinedTree.root.left.parent = predefinedTree.root;
    predefinedTree.root.right.parent = predefinedTree.root;
    predefinedTree.root.left.left.parent = predefinedTree.root.left;
    predefinedTree.root.left.right.parent = predefinedTree.root.left;
    predefinedTree.root.right.left.parent = predefinedTree.root.right;
    predefinedTree.root.right.right.parent = predefinedTree.root.right;
    predefinedTree.root.left.left.left.parent = predefinedTree.root.left.left;

    // Set the predefined tree's root as the main tree's root and render
    tree.root = predefinedTree.root; 
    renderTree(); 
}
















