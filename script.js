//template for creating objects with specific properties and methods.
class Node {
    constructor(value, color = 'red') { //Defines constructor function, will be called when a new instance is created. (the default color 'red'.)
        this.value = value;
        this.color = color; // 'red' or 'black'
        this.left = null;
        this.right = null;
        this.parent = null;
    }
}

//new class which represents the entire tree structure.
class RedBlackTree { 
    constructor() {
        this.root = null; //Initializes root as null, which means the tree is initially empty
    }

    async recolorRed(node) {
        console.log(`Recoloring node ${node.value} to red`);
        
        const nodeElement = document.getElementById(`node-${node.value}`);
        if (nodeElement) {
            nodeElement.classList.add('blink-red'); // Add the blink-red class for smooth transitions
            console.log(`Node ${node.value} should be blinking red now...`);
            await new Promise(resolve => setTimeout(resolve, 1000));  // Wait for the blinking effect (5ms)
            nodeElement.classList.remove('blink-red');  // After blinking, the node stays black due to CSS
            console.log(`Node ${node.value} recolored to red.`);
        }
    
        node.color = 'black'; // Ensure the node's color is updated in logic
        renderTree();  // Re-render the tree after recoloring
    }
    
    
    async recolorBlack(node) {
        console.log(`Recoloring node ${node.value} to black`);
        
        // Skip recoloring if already black
        if (node.color === 'black') {
            console.log(`Node ${node.value} is already black. Skipping...`);
            return;
        }
    
        const nodeElement = document.getElementById(`node-${node.value}`);
        if (nodeElement) {
            nodeElement.classList.add('blink-black');
            console.log(`Node ${node.value} should be blinking black now...`);
            await new Promise(resolve => setTimeout(resolve, 1000));  // Blink for 1 second
            nodeElement.classList.remove('blink-black');
            nodeElement.style.backgroundColor = 'black';  // Change to final black color
            console.log(`Node ${node.value} recolored to black.`);
        }
    
        node.color = 'black';
        renderTree();
    }
     
    //adjusts the tree structure to rotate down to the left, which is part of balancing the tree.
    rotateLeft(node) {
        let rightChild = node.right; //Stores the node's right child in a variable rightChild.
        node.right = rightChild.left; //Moves right Child's left child to be node's right child.
        if (rightChild.left !== null) { //Updates the parent reference, if right Child's left child is not null...
            rightChild.left.parent = node;
        }
        rightChild.parent = node.parent; 
        if (node.parent === null) { //If node was the at t he root, make rightChild the new root...
            this.root = rightChild;
        } else if (node === node.parent.left) { //If node was the left child, node.parent.left updates to rightChild...
            node.parent.left = rightChild;
        } else { //If node was the right child, node.parent.right updates to rightChild...
            node.parent.right = rightChild;
        }
        rightChild.left = node; //Sets node as right Child's left child.
        node.parent = rightChild; //Sets rightChild as node's parent.
    }

    //adjusts the tree structure to rotate the node to the right, which is  part of balancing the tree
    rotateRight(node) {
        let leftChild = node.left;
        node.left = leftChild.right;
        if (leftChild.right !== null) {
            leftChild.right.parent = node;
        }
        leftChild.parent = node.parent;
        if (node.parent === null) {
            this.root = leftChild;
        } else if (node === node.parent.right) {
            node.parent.right = leftChild;
        } else {
            node.parent.left = leftChild;
        }
        leftChild.right = node;
        node.parent = leftChild;
    }

    //handles  various cases that may occur after inserting a new node to ensure that the tree remains a Red-Black Tree with all its properties intact.
    async fixInsertion(node) {
        while (node !== this.root && node.parent.color === 'red') {
            if (node.parent === node.parent.parent.left) {
                let uncle = node.parent.parent.right;
                if (uncle !== null && uncle.color === 'red') {
                    console.log('Uncle is red, performing recoloring...');
                    await this.animateRecoloring(node.parent, uncle, node.parent.parent);
                    node.parent.color = 'black';
                    uncle.color = 'black';
                    node.parent.parent.color = 'red';
                    node = node.parent.parent;
                } else {
                    if (node === node.parent.right) {
                        node = node.parent;
                        this.rotateLeft(node);
                    }
                    node.parent.color = 'black';
                    node.parent.parent.color = 'red';
                    this.rotateRight(node.parent.parent);
                }
            } else {
                let uncle = node.parent.parent.left;
                if (uncle !== null && uncle.color === 'red') {
                    console.log('Uncle is red, performing recoloring...');
                    await this.animateRecoloring(node.parent, uncle, node.parent.parent);
                    node.parent.color = 'black';
                    uncle.color = 'black';
                    node.parent.parent.color = 'red';
                    node = node.parent.parent;
                } else {
                    if (node === node.parent.left) {
                        node = node.parent;
                        this.rotateRight(node);
                    }
                    node.parent.color = 'black';
                    node.parent.parent.color = 'red';
                    this.rotateLeft(node.parent.parent);
                }
            }
        }

        console.log('Ensuring root is black');
        await this.recolorBlack(this.root);  // Ensure root is black
    }

    // Async method to animate recoloring of parent, uncle, and grandparent
    async animateRecoloring(parent, uncle, grandparent) {
        // Start by blinking and recoloring parent node (Node 50)
        console.log(`Starting recoloring for parent node ${parent.value}...`);
        await this.recolorRed(parent);
        await this.blinkNode(parent, 'red');  // Ensure blinking before recoloring
        await new Promise(resolve => setTimeout(resolve, 1000));  // Wait for blinking to finish
        await this.recolorBlack(parent);  // Recolor to black after blink
    
        // Then blink and recolor uncle node (Node 150)
        console.log(`Starting recoloring for uncle node ${uncle.value}...`);
        await this.recolorRed(uncle);
        await this.blinkNode(uncle, 'red');
        await new Promise(resolve => setTimeout(resolve, 1000));  // Wait for blinking to finish
        await this.recolorBlack(uncle);
    
        // Finally, blink and recolor grandparent node (Node 100)
        console.log(`Starting recoloring for grandparent node ${grandparent.value}...`);
        await this.recolorRed(grandparent);
        await this.blinkNode(grandparent, 'red');
        await new Promise(resolve => setTimeout(resolve, 1000));  // Wait for blinking to finish
        await this.recolorBlack(grandparent);
    }
    
    blinkYellow(node) {
        const nodeElement = document.getElementById(`node-${node.value}`); // Get the DOM element for the node
        if (nodeElement) {
            nodeElement.classList.add('blink-yellow'); // Add the blinking class
            setTimeout(() => {
                nodeElement.classList.remove('blink-yellow'); // Remove the blinking class after 2 seconds
            }, 2000); // Blink for 2 seconds
        }
    }
    
    //Creating node
    insert(value) {
        let newNode = new Node(value); //Creates a new node with the incoming value.
        if (this.root === null) { //If the tree is empty, set the new node as...
            this.root = newNode;
            this.root.color = 'black';
            return;
        }
        
        let current = this.root; //Initializes current as the root and parent as null...
        let parent = null;

        while (current !== null) { //Finds the correct place to insert the new node...
            parent = current;
            if (value < current.value) {
                current = current.left;
            } else {
                current = current.right;
            }
        }

        newNode.parent = parent; //Sets the parent reference for the new node.
        if (value < parent.value) { //Sets the new node as the left or right child of the parent...
            parent.left = newNode;
        } else {
            parent.right = newNode;
        }

        this.fixInsertion(newNode); //Calls fixInsertion to ensure that the tree remains a Red-Black Tree after insertion.
    }

    //This method handles different deletion scenarios and ensures that the tree remains a Red-Black Tree after deletion
    delete(value) {
        const node = this.findNode(value); //Finds the node to delete.
        if (node === null) return; //If the node is not found, do nothing.

        let y = node; //will be used to handle the deletion process and potential replacement.
        let yOriginalColor = y.color; //Saves the original color of the node to be deleted.
        let x; //Initializes x to be used later.

        // Case 1: Node to be deleted has no left child.
        if (node.left === null) { 
            x = node.right; // 'x' is set to the right child of the node.
            this.transplant(node, node.right); // Replace the node with its right child.

        // Case 2: Node to be deleted has no right child.    
        } else if (node.right === null) {
            x = node.left; // 'x' is set to the left child of the node.
            this.transplant(node, node.left); //// Replace the node with its left child.

        // Case 3: Node to be deleted has two children.    
        } else {
            y = this.minimum(node.right); // Find the minimum node in the right subtree.
            yOriginalColor = y.color;// Store the color of the minimum node for later use.
            
            x = y.right;// 'x' is set to the right child of the minimum node.
            if (y.parent === node) { // If 'y' is not a direct child of the node, replace 'y' with its right child.
                if (x !== null) x.parent = y;
                
            } else {
                this.transplant(y, y.right); // Replace 'y' with its right child.
                y.right = node.right; // Reattach the right child of 'y' to the node being deleted...
                if (y.right !== null) y.right.parent = y;
            }
            this.transplant(node, y); // Replace the node to be deleted with 'y'.
            y.left = node.left; //// Attach the left child of the node to be deleted to 'y'.
            if (y.left !== null) y.left.parent = y;
            y.color = node.color; // Copy the color of the node being deleted to 'y'.
        }

        // If the original color of the node being deleted was black, fix any violations.
        if (yOriginalColor === 'black') {
            this.fixDeletion(x);
        }
    }

    // This method searches for a node with the specified value in the Red-Black Tree.
    findNode(value) {
        let current = this.root;// Start the search from the root of the tree.
        while (current !== null && current.value !== value) { // Traverse the tree until the node is found or we reach a null reference.
            //// If the value to be found is less than the current node's value, go to the left child...
            if (value < current.value) {
                current = current.left;
            } else { //If the value to be found is greater than or equal to the current node's value, go to the right child.
                current = current.right;
            }
        }
        return current; //Return the node if found; otherwise, return null.
    }

    // This method replaces one subtree as a child of its parent with another subtree.
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

    // This method finds the node with the minimum value in the subtree rooted at the given node.
    minimum(node) {
        while (node.left !== null) { // Traverse the left children of the node until a node with no left child is found.
            node = node.left;
        }
        return node;// Return the leftmost node, which is the node with the minimum value.
    }

    // This method restores the Red-Black Tree properties after a deletion.
    fixDeletion(x) {
        while (x !== this.root && (x === null || x.color === 'black')) { // Continue fixing until 'x' is the root or 'x' is not black.
            if (x === x.parent.left) { // If 'x' is the left child of its parent.
                let w = x.parent.right; // 'w' is the sibling of 'x'.
                
                // Case 1: 'w' is red.
                if (w.color === 'red') { 
                    w.color = 'black'; //Recolor 'w' to black.
                    x.parent.color = 'red'; // Recolor parent of 'x' to red.
                    this.rotateLeft(x.parent); // Left rotate on the parent of 'x'.
                    w = x.parent.right; // Update 'w' to the new sibling.
                }

                 // Case 2: Both children of 'w' are black.
                if ((w.left === null || w.left.color === 'black') &&
                    (w.right === null || w.right.color === 'black')) {
                    w.color = 'red'; // Recolor 'w' to red.
                    x = x.parent; // Move 'x' up the tree.

                // Case 3: 'w's right child is black and left child is red.
                } else { if (w.right === null || w.right.color === 'black') {
                        if (w.left !== null) w.left.color = 'black'; // Recolor 'w's left child to black.
                        w.color = 'red'; // Recolor 'w' to red.
                        this.rotateRight(w); // Right rotate on 'w'.
                        w = x.parent.right; // Update 'w' to the new sibling.
                    }

                    // Case 4: 'w's right child is red.    
                    w.color = x.parent.color;  // Recolor 'w' to the parent's color.
                    x.parent.color = 'black'; // Recolor parent of 'x' to black.
                    if (w.right !== null) w.right.color = 'black'; // Recolor 'w's right child to black.
                    this.rotateLeft(x.parent); // Left rotate on the parent of 'x'.
                    x = this.root; // Set 'x' to root to exit loop.
                }

             // Mirror cases when 'x' is the right child of its parent.
            } else {
                let w = x.parent.left; // 'w' is the sibling of 'x', which is the left child of 'x's parent.

                // Case 1: 'w' is red.
                if (w.color === 'red') {
                    w.color = 'black'; // Recolor 'w' to black.
                    x.parent.color = 'red'; // Recolor parent of 'x' to red.
                    this.rotateRight(x.parent); // Right rotate on the parent of 'x'.
                    w = x.parent.left; // Update 'w' to the new sibling.
                }
                
                // Case 2: Both children of 'w' are black.
                if ((w.right === null || w.right.color === 'black') && 
                    (w.left === null || w.left.color === 'black')) { 
                    w.color = 'red';  // Recolor 'w' to red.
                    x = x.parent; // Move 'x' up the tree.

                // Case 3: 'w's left child is black and right child is red.
                } else {
                    if (w.left === null || w.left.color === 'black') {
                        if (w.right !== null) w.right.color = 'black'; // Recolor 'w's right child to black.
                        w.color = 'red'; // Recolor 'w' to red.
                        this.rotateLeft(w); // Left rotate on 'w'.
                        w = x.parent.left; // Update 'w' to the new sibling.
                    }

                    // Case 4: 'w's left child is red.
                    w.color = x.parent.color; // Recolor 'w' to the parent's color.
                    x.parent.color = 'black'; // Recolor parent of 'x' to black.
                    if (w.left !== null) w.left.color = 'black'; // Recolor 'w's left child to black.
                    this.rotateRight(x.parent); // Right rotate on the parent of 'x'.
                    x = this.root;  // Set 'x' to root to exit loop.
                }
            }
        }
        if (x !== null) x.color = 'black';  // Ensure 'x' is black.
    }
    

    // Blink effect for a given node
    async blinkNode(node, color) {
    const nodeElement = document.getElementById(`node-${node.value}`);
    if (nodeElement) {
        const blinkClass = color === 'red' ? 'blink-red' : 'blink-black'; // Adjust blink class based on color
        nodeElement.classList.add(blinkClass);
        console.log(`Node ${node.value} should be blinking ${color} now...`);
        await new Promise(resolve => setTimeout(resolve, 1000));  // Wait for blink effect to finish
        nodeElement.classList.remove(blinkClass);
        console.log(`Node ${node.value} stopped blinking.`);
    }
    }

    // This method searches for a node with the specified value in the Red-Black Tree.
    search(value) {
        return this.findNode(value); //Utilizes the findNode method to locate the node with the given value.
    }
}

// creates a new instance of the RedBlackTree class. The tree variable holds the reference to this tree, which will be used to perform operations like insertion, deletion, and search.
const tree = new RedBlackTree();

// This function inserts a new node with the specified value into the Red-Black Tree.
function insertNode() {
    const value = document.getElementById('nodeValue').value; // Get the value from the input field with the id 'nodeValue'.

    // Check if the value is not provided or is not a number.
    if (!value || isNaN(value)) {
        alert('Please enter a valid number.');
        return;
    }

    // Start the animation by adding a red node on the top-left side
    let newNodeElement = document.createElement('div');
    newNodeElement.className = 'node new-node';  // Apply blinking effect with the new-node class
    newNodeElement.style.position = 'absolute';
    newNodeElement.style.left = '10px';  // Positioning at the top-left corner
    newNodeElement.style.top = '10px';
    newNodeElement.style.backgroundColor = 'red';
    newNodeElement.style.color = 'white';  // Set text color to white
    newNodeElement.style.border = '2px solid black';  // Add a black border around the node
    newNodeElement.style.borderRadius = '50%';  // Make the node circular
    newNodeElement.style.transition = 'all 2s ease';  // Smooth transition
    newNodeElement.innerText = value;

    const container = document.getElementById('tree');
    container.appendChild(newNodeElement);

    // If this is the first node, just insert it directly without traversal
    if (tree.root === null) {
        setTimeout(() => {
            container.removeChild(newNodeElement); // Remove the temporary node
            tree.insert(Number(value));  // Insert the node into the tree
            renderTree();  // Render the tree to visualize the new state
        }, 3000);  // Insert the node after 3 seconds (for the visual blinking effect)
        return;
    }

    // Step 1: Start the traversal animation
    const traversalCircle = document.createElement('div');
    traversalCircle.className = 'node traversal-node';  // A new class for the yellow traversal circle
    traversalCircle.style.position = 'absolute';
    traversalCircle.style.backgroundColor = 'yellow';
    traversalCircle.style.borderRadius = '50%';
    traversalCircle.style.transition = 'all 1s ease';  // Smooth movement
    traversalCircle.style.width = '20px';
    traversalCircle.style.height = '20px';


    // Start traversal from the root
    let current = tree.root;
    const traverseTree = async () => {
        while (current !== null) {
            const currentNodeElement = document.getElementById(`node-${current.value}`);
            const rect = currentNodeElement.getBoundingClientRect();

            // Move the traversal circle to the current node position
            traversalCircle.style.left = `${rect.left + rect.width / 2 - 54}px`;  // Center the circle
            traversalCircle.style.top = `${rect.top + rect.height / 2 - 115}px`;

            await new Promise(resolve => setTimeout(resolve, 5000));  // Wait for 1 second before continuing

            if (value < current.value) {
                current = current.left;
            } else {
                current = current.right;
            }
        }

        // Once the correct position is found (current is null), remove traversal circle
        container.removeChild(traversalCircle);

        // Step 2: After traversal, remove the new node blinking at the top-left
        container.removeChild(newNodeElement);

        // Insert the new node into the tree
        tree.insert(Number(value));
        renderTree();  // Render the updated tree with the new node inserted
    };

    // Append the traversal circle to the DOM and start the animation
    container.appendChild(traversalCircle);
    traverseTree();
}

// This function renders a node of the Red-Black Tree and its connections in the DOM.
function renderNode(node, container, parentNode, isLeft) {
    console.log("Rendering node: ", node.value); // Add this to check node rendering
    
    const element = document.createElement('div');
    element.className = 'node';
    element.id = `node-${node.value}`;
    element.innerText = node.value;
    element.style.backgroundColor = node.color === 'red' ? 'red' : 'black';
    element.style.color = node.color === 'red' ? 'black' : 'white';
    
    container.appendChild(element);
    
    if (parentNode) {
        const line = document.createElement('div');
        line.className = 'line';
        const parentRect = parentNode.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        console.log('Parent Rect:', parentRect);

        // Initial positioning for the new node
        element.style.position = 'absolute';
        element.style.left = `${parentRect.right + 50}px`;  // Offset to the right
        element.style.top = `${parentRect.top}px`;  // Same vertical position as the parent

        // Move the new node to its final position
        setTimeout(() => {
            const elementRect = element.getBoundingClientRect();
            console.log('New Node Initial Position:', elementRect);

            const parentCenterX = parentRect.left + parentRect.width / 2 - containerRect.left;
            const parentBottomY = parentRect.bottom - containerRect.top;
            const elementTopY = elementRect.top - containerRect.top;

            element.style.transition = 'left 1s, top 1s';
            element.style.left = `${parentCenterX - (isLeft ? 50 : -50)}px`;
            element.style.top = `${parentBottomY + 50}px`;

            console.log('New Node Final Position:', {
                left: element.style.left,
                top: element.style.top
            });
        }, 500);
    }
}

// This function deletes a node with the specified value from the Red-Black Tree.
function deleteNode() {
    const value = document.getElementById('nodeValue').value; // Get the value from the input field with the id 'nodeValue'.

    // Check if the value is not provided or is not a number.
    if (!value || isNaN(value)) {
        // Alert the user to enter a valid number.
        alert('Please enter a valid number.');
        return;
    }
    tree.delete(Number(value)); // Delete the node with the given value from the Red-Black Tree.
    renderTree(); // Render the tree to visualize the current state after deletion.
}

function searchNode() {
    const targetValue = parseInt(document.getElementById('nodeValue').value);
    if (isNaN(targetValue)) {
        alert('Please enter a valid node value.');
        return;
    }

    let currentNode = tree.root;

    // Create or select the SVG circle for highlighting
    let svg = document.getElementById('highlightCircle');
    if (!svg) {
        svg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        svg.setAttribute("id", "highlightCircle");
        svg.setAttribute("r", 20); // Circle radius
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "red"); // Initial stroke color is red
        svg.setAttribute("stroke-width", 4);
        document.querySelector('svg').appendChild(svg);
    }

    // Funktionsdefinering for at traversere træet
    function traverse(node, parentElement) {
        if (!node) return; // Stop, hvis noden er null

        const nodeElement = document.getElementById(`node-${node.value}`);
        if (!nodeElement) {
            console.error(`Node element for node ${node.value} not found!`);
            return;
        }

        const originalColor = node.color === 'red' ? 'red' : 'black'; // Gem den oprindelige farve

        // Animerer bevægelsen fra parent node til current node
        if (parentElement) {
            moveHighlightTo(svg, parentElement, nodeElement, 1000); // Bevæger cirklen over 1000ms
        } else {
            // Hvis vi er ved roden, så placér cirklen der
            moveHighlightTo(svg, null, nodeElement, 0); // Ingen bevægelse (cirkel starter her)
        }

        // Timer, som venter 2 sekunder på, at cirklen stopper ved noden
        setTimeout(() => {
            // Hvis det er den rigtige node, skift cirklens farve til grøn og lav blinkende effekt
            if (node.value === targetValue) {
                nodeElement.classList.add('blink-green');
                svg.setAttribute("stroke", "green"); // Skift cirklen til grøn

                // Fjern cirklen efter blink er færdig
                setTimeout(() => {
                    svg.remove(); // Fjern cirklen, når blinket er færdigt
                    clearBlink(nodeElement, originalColor); // Gendan nodens originale farve
                }, 1500); // Hold cirklen grøn i 1,5 sekunder

                return; // Stop traversal, når den rette node er fundet
            }

            // Hvis ikke den rigtige node, fortsæt søgningen
            const nextNode = targetValue < node.value ? node.left : node.right;
            traverse(nextNode, nodeElement); // Traversér videre til venstre eller højre child
        }, 2000); // Stop ved noden i 2 sekunder før næste node evalueres
    }

    traverse(currentNode, null); // Start traversal fra roden
}

function moveHighlightTo(circle, startNodeElement, endNodeElement, duration = 1000) {
    // Hvis det er første node (roden), flyt cirklen der direkte
    if (!startNodeElement) {
        const endX = parseFloat(endNodeElement.getAttribute('cx'));
        const endY = parseFloat(endNodeElement.getAttribute('cy'));
        circle.setAttribute("cx", endX);
        circle.setAttribute("cy", endY);
        return;
    }

    // Ellers interpolér bevægelsen fra start til slut
    const startX = parseFloat(startNodeElement.getAttribute('cx'));
    const startY = parseFloat(startNodeElement.getAttribute('cy'));
    const endX = parseFloat(endNodeElement.getAttribute('cx'));
    const endY = parseFloat(endNodeElement.getAttribute('cy'));

    const deltaX = endX - startX;
    const deltaY = endY - startY;

    const frames = 60; // Antal frames for animationen
    const frameDuration = duration / frames;

    let currentFrame = 0;

    function animateStep() {
        if (currentFrame < frames) {
            const progress = currentFrame / frames;

            // Interpolerer mellem start- og slutpositioner
            const currentX = startX + deltaX * progress;
            const currentY = startY + deltaY * progress;

            // Opdaterer cirklens position
            circle.setAttribute("cx", currentX);
            circle.setAttribute("cy", currentY);

            currentFrame++;
            setTimeout(animateStep, frameDuration);
        } else {
            // Sørger for, at cirklen lander præcis på slutpositionen
            circle.setAttribute("cx", endX);
            circle.setAttribute("cy", endY);
        }
    }

    animateStep(); // Start animationen
}

function clearBlink(nodeElement, originalColor) {
    nodeElement.classList.remove('blink-red', 'blink-green');
    nodeElement.style.backgroundColor = originalColor; // Restore original background color
}

// This function visually highlights a node by making it blink for a short duration.
function blinkNode(node) {
    // Select all 'circle' elements within the '#tree' container and filter to find the circles representing the given node.
    const circles = d3.select('#tree').selectAll('circle') 
        .filter(d => d.node === node);

    // Add the blink class to trigger animation
    circles.classed('blink', true);

    // Remove the blink class after 5 seconds
    setTimeout(() => {
        circles.classed('blink', false);
        // Set fill color back to node's original color if needed
        circles.attr('fill', d => d.node.color);
    }, 5000); // 5 seconds
}

// This function visualizes the Red-Black Tree and optionally highlights a specific node.
function renderTree(foundNode = null) {

    // Get the container element where the tree will be rendered and clear its contents.
    const treeContainer = document.getElementById('tree');
    treeContainer.innerHTML = '';
    
    // Get the dimensions of the container for setting up the SVG.
    const width = treeContainer.clientWidth;
    const height = treeContainer.clientHeight;

    // Arrays to store nodes and links for rendering.
    const nodes = [];
    const links = [];
    
    // Helper function to traverse the tree and collect nodes and links.
    function traverse(node, x, y, level, xOffset) {
        if (node !== null) {
            // Add the current node to the nodes array.
            nodes.push({ node, x, y });
            
            // If the left child exists, add a link and recursively traverse it.
            if (node.left !== null) {
                links.push({ source: { x, y }, target: { x: x - xOffset, y: y + 50 } });
                traverse(node.left, x - xOffset, y + 50, level + 1, xOffset / 1.5);
            }
            
            // If the right child exists, add a link and recursively traverse it.
            if (node.right !== null) {
                links.push({ source: { x, y }, target: { x: x + xOffset, y: y + 50 } });
                traverse(node.right, x + xOffset, y + 50, level + 1, xOffset / 1.5);
            }
        }
    }

    // Start the traversal from the root node, centered horizontally, and at a starting vertical position.
    traverse(tree.root, width / 2, 30, 1, width / 4);

    // Determine the bounding box of the tree for proper SVG scaling.
    const minX = Math.min(...nodes.map(d => d.x));
    const maxX = Math.max(...nodes.map(d => d.x));
    const minY = Math.min(...nodes.map(d => d.y));
    const maxY = Math.max(...nodes.map(d => d.y));

    const treeWidth = maxX - minX;
    const treeHeight = maxY - minY;

    // Create and configure the SVG container for rendering the tree.
    const svgContainer = d3.select('#tree').append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`);


    // Render the links (edges) between nodes.
    const linkSelection = svgContainer.selectAll('line')
        .data(links);

    linkSelection.enter()
        .append('line')
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.source.x)
        .attr('y2', d => d.source.y)
        .attr('stroke', 'black')
        .transition()
        .duration(500)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

    linkSelection.exit()
        .transition()
        .duration(500)
        .attr('x2', d => d.source.x)
        .attr('y2', d => d.source.y)
        .remove();

    // Render the nodes (circles) for non-null nodes.
    const nodeSelection = svgContainer.selectAll('circle')
        .data(nodes.filter(d => d.node.value !== 'NIL'));

    nodeSelection.enter()
        .append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 15)
        .attr('fill', d => d.node.color) // Set the fill based on the original color of the node (red or black)
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('id', d => `node-${d.node.value}`) // Assign an ID to each circle
        .transition()
        .duration(500)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
    

    nodeSelection.exit()
        .transition()
        .duration(500)
        .attr('r', 0)
        .remove();

    svgContainer.selectAll('text')
        .data(nodes)
        .enter()
        .append('text')
        .attr('x', d => d.x)
        .attr('y', d => d.y + 4)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .text(d => d.node.value);

    // If a specific node is provided, make it blink.
    if (foundNode) {
        blinkNode(foundNode);
    }
}

document.getElementById('nodeValue').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        insertNode();
    }
});
