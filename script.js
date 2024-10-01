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
    fixInsertion(node) {
        while (node !== this.root && node.parent.color === 'red') { //Continues fixing the tree as long as it is not the root and the parent is red.
            if (node.parent === node.parent.parent.left) { //If the node's parent is the left child.
                let uncle = node.parent.parent.right; //Finds the node's "uncle" (parent's sibling).
                if (uncle !== null && uncle.color === 'red') { //if the uncle is red...
                    node.parent.color = 'black'; //Sets the parent to black.
                    uncle.color = 'black'; //Sets the uncle to black.
                    node.parent.parent.color = 'red'; //Sets the grandparents to red.
                    node = node.parent.parent; //Moves the node up the tree.
                } else { // hvis uncle is not red...
                    if (node === node.parent.right) { //If the node is the right child, we rotate the parent to the left.
                        node = node.parent;
                        this.rotateLeft(node);
                    }
                    node.parent.color = 'black';
                    node.parent.parent.color = 'red';
                    this.rotateRight(node.parent.parent); //Rotates the grandparents to the right.
                }
            } else { //If the node's parent is the right child.
                let uncle = node.parent.parent.left; //Finds the node's "uncle" (parent's sibling).
                if (uncle !== null && uncle.color === 'red') { //if uncle is red
                    node.parent.color = 'black';
                    uncle.color = 'black';
                    node.parent.parent.color = 'red';
                    node = node.parent.parent;
                } else { //if the uncle is not red
                    if (node === node.parent.left) { //If the node is the left child, we rotate the parent to the right...
                        node = node.parent;
                        this.rotateRight(node);
                    }
                    node.parent.color = 'black';
                    node.parent.parent.color = 'red';
                    this.rotateLeft(node.parent.parent); //Rotates the grandparent to the left.
                }
            }
        }
        this.root.color = 'black'; //Sets the root to black to ensure that the tree starts with a black root.
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
        // Alert the user to enter a valid number.
        alert('Please enter a valid number.');
        return;
    }
    // Insert the value (converted to a number) into the Red-Black Tree.
    tree.insert(Number(value));
    renderTree(); // Render the tree to visualize the current state after insertion.
}

// This function renders a node of the Red-Black Tree and its connections in the DOM.
function renderNode(node, container, parentNode, isLeft) {
     // Create a new div element to represent the current node.
    const element = document.createElement('div');
    element.className = 'node'; // Set the CSS class for styling.
    element.id = `node-${node.value}`; // Set a unique ID for the node.
    element.innerText = node.value; // Set the text to display the node's value.
   
    // Set the background and text color based on the node's color.
    element.style.backgroundColor = node.color === 'red' ? 'red' : 'black';
    element.style.color = node.color === 'red' ? 'black' : 'white';
    
    // Append the node element to the container.
    container.appendChild(element);
    
     // If there's a parent node, draw a line connecting this node to its parent.
    if (parentNode) {
        // Create a div for the connecting line.
        const line = document.createElement('div');
        line.className = 'line'; // Set the CSS class for styling.

        // Get bounding rectangles of the parent and the current node.
        const parentRect = parentNode.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Calculate the positions for the line to connect the parent and the current node.
        const parentCenterX = parentRect.left + parentRect.width / 2 - containerRect.left;
        const parentBottomY = parentRect.bottom - containerRect.top;
        const elementCenterX = elementRect.left + elementRect.width / 2 - containerRect.left;
        const elementTopY = elementRect.top - containerRect.top;

        // Set the line's position and size.
        line.style.left = `${parentCenterX}px`;
        line.style.top = `${parentBottomY}px`;
        line.style.height = `${elementTopY - parentBottomY}px`;

        // Adjust line's horizontal position based on whether the node is a left or right child.
        line.style.transform = `translateX(${isLeft ? -50 : 50}%)`;

        // Append the line to the container.
        container.appendChild(line);
    }

    // Create containers for the left and right children of the current node.
    const leftContainer = document.createElement('div');
    leftContainer.className = 'left-container';// Set the CSS class for styling.
    const rightContainer = document.createElement('div');
    rightContainer.className = 'right-container';// Set the CSS class for styling.

    // Append the left and right containers to the current container.
    container.appendChild(leftContainer);
    container.appendChild(rightContainer);

     // Recursively render the left child if it exists; otherwise, render a null node placeholder.
    if (node.left) {
        renderNode(node.left, leftContainer, element, true);
    } else {
        renderNullNode(leftContainer, element, true);
    }
    
    // Recursively render the right child if it exists; otherwise, render a null node placeholder.
    if (node.right) {
        renderNode(node.right, rightContainer, element, false);
    } else {
        renderNullNode(rightContainer, element, false);
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

// This function renders a placeholder for a null node (often represented as 'NIL') in the tree.
function renderNullNode(container, parentNode, isLeft) {
    const nullNode = document.createElement('div'); // Create a new div element to represent the null node.
    nullNode.className = 'node null-node'; // Set the CSS class for styling the null node.
    nullNode.innerText = 'NIL'; // Set the text to 'NIL' to indicate a null node.
    
    nullNode.style.backgroundColor = 'black'; // Set the background color to black.
    nullNode.style.color = 'white'; // Set the text color to white for contrast.
    nullNode.style.width = '30px';
    nullNode.style.height = '30px';

    // Append the null node element to the specified container.
    container.appendChild(nullNode);

    // If there's a parent node, draw a line connecting this null node to its parent.
    if (parentNode) {
        // Create a div element to represent the connecting line.
        const line = document.createElement('div');
        line.className = 'line'; // Set the CSS class for styling the line.

        // Get bounding rectangles of the parent node and the null node.
        const parentRect = parentNode.getBoundingClientRect();
        const nullNodeRect = nullNode.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Calculate the positions for the line to connect the parent node to the null node.
        const parentCenterX = parentRect.left + parentRect.width / 2 - containerRect.left;
        const parentBottomY = parentRect.bottom - containerRect.top;
        const nullNodeCenterX = nullNodeRect.left + nullNodeRect.width / 2 - containerRect.left;
        const nullNodeTopY = nullNodeRect.top - containerRect.top;

        // Set the line's position and size.
        line.style.left = `${parentCenterX}px`;
        line.style.top = `${parentBottomY}px`;
        line.style.height = `${nullNodeTopY - parentBottomY}px`;

        // Adjust the line's horizontal position based on whether the null node is a left or right child.
        line.style.transform = `translateX(${isLeft ? -50 : 50}%)`;
        container.appendChild(line); // Append the line to the container.
    }
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
            } else {
                // Handle the case where the left child is null.
                nodes.push({ node: { value: 'NIL', color: 'black' }, x: x - xOffset, y: y + 50 });
                links.push({ source: { x, y }, target: { x: x - xOffset, y: y + 50 } });
            }
            
            // If the right child exists, add a link and recursively traverse it.
            if (node.right !== null) {
                links.push({ source: { x, y }, target: { x: x + xOffset, y: y + 50 } });
                traverse(node.right, x + xOffset, y + 50, level + 1, xOffset / 1.5);
            } else {
                // Handle the case where the right child is null.
                nodes.push({ node: { value: 'NIL', color: 'black' }, x: x + xOffset, y: y + 50 });
                links.push({ source: { x, y }, target: { x: x + xOffset, y: y + 50 } });
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
        .attr('viewBox', `${minX - 50} ${minY - 50} ${treeWidth + 100} ${treeHeight + 100}`);

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

    // Render the null nodes as rectangles.
    svgContainer.selectAll('.null-node')
        .data(nodes.filter(d => d.node.value === 'NIL'))
        .enter()
        .append('rect')
        .attr('x', d => d.x - 15)
        .attr('y', d => d.y - 15)
        .attr('width', 30)
        .attr('height', 30)
        .attr('fill', 'black')
        .attr('stroke', 'black')
        .attr('stroke-width', 2);

    // Add text labels to the null nodes.
    svgContainer.selectAll('.null-node-text')
        .data(nodes.filter(d => d.node.value === 'NIL'))
        .enter()
        .append('text')
        .attr('x', d => d.x)
        .attr('y', d => d.y + 4)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .text('NIL');

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
