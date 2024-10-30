
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

    async recolorBlack(node) {
        console.log(`Recoloring node ${node.value} to black`);

        // Skip recoloring if already black
        if (node.color === 'black') {
            console.log(`Node ${node.value} is already black. Skipping...`);
            return;
        }

        const nodeElement = document.getElementById(`node-${node.value}`);
        if (nodeElement) {
            node.color = 'black'; 
            await this.blinkNode(node, 'black'); // Blink before setting the color
            nodeElement.style.backgroundColor = 'black'; // Set final color after blinking
            console.log(`Node ${node.value} recolored to black.`);
        }

        node.color = 'black';
        renderTree();
    }

    async recolorRed(node) {
        console.log(`Recoloring node ${node.value} to red`);

        const nodeElement = document.getElementById(`node-${node.value}`);
        if (nodeElement) {
            node.color = 'red'; 
            await this.blinkNode(node, 'red'); // Blink before setting the color
            nodeElement.style.backgroundColor = 'red';  // Set final color after blinking
            console.log(`Node ${node.value} recolored to red.`);
        }

        node.color = 'red';
        renderTree();
    }

    async rotateLeft(node) {
        console.log(`Starting left rotation on node ${node.value}`);

        // Identify source and target nodes for animation
        const sourceNode = document.getElementById(`node-${node.value}`);
        const targetNode = node.right ? document.getElementById(`node-${node.right.value}`) : null;

        if (sourceNode && targetNode) {
            // Call animateLineDrawing and wait for it to finish
            await this.animateLineDrawing(targetNode, sourceNode, true);
        }

        // Proceed with the rotation logic
        let rightChild = node.right;
        node.right = rightChild.left;
        if (rightChild.left !== null) {
            rightChild.left.parent = node;
        }
        rightChild.parent = node.parent;
        if (node.parent === null) {
            this.root = rightChild;
        } else if (node === node.parent.left) {
            node.parent.left = rightChild;
        } else {
            node.parent.right = rightChild;
        }
        rightChild.left = node;
        node.parent = rightChild;

        console.log(`Left rotation complete for node ${node.value}`);

        // Trigger recoloring after rotation and line animation
        if (node.color === 'red') await this.recolorBlack(node);
        renderTree(); // Re-render the tree after rotation
    }

    getColor(node) {
        return node === null ? 'black' : node.color;
    }

    async rotateRight(node) {
        console.log(`Starting right rotation on node ${node.value}`);

        // Identify source and target nodes for animation
        const sourceNode = document.getElementById(`node-${node.value}`);
        const targetNode = node.left ? document.getElementById(`node-${node.left.value}`) : null;

        if (sourceNode && targetNode) {
            // Call animateLineDrawing and wait for it to finish
            await this.animateLineDrawing(targetNode, sourceNode);
        }

        // Perform the right rotation logic
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

        console.log(`Right rotation complete for node ${node.value}`);

        // Trigger recoloring after rotation and line animation
        if (node.color === 'red') await this.recolorBlack(node);
        renderTree(); // Re-render the tree after rotation
    }

    animateLineDrawing(sourceNode, targetNode) {
        return new Promise((resolve) => {
            let svgContainer = document.getElementById('svgCanvas');
            if (!svgContainer) {
                const treeContainer = document.getElementById('tree');
                svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svgContainer.setAttribute('id', 'svgCanvas');
                treeContainer.appendChild(svgContainer);
            }

            const treeContainer = document.getElementById('tree');
            const sourceRect = sourceNode.getBoundingClientRect();
            const targetRect = targetNode.getBoundingClientRect();
            const containerRect = treeContainer.getBoundingClientRect();

            // Node radius (assuming circular nodes, adjust as needed)
            const nodeRadius = sourceRect.width / 2;

            // Calculate node center positions relative to `#tree`
            let sourceXCenter = sourceRect.left + sourceRect.width / 2 - containerRect.left;
            let sourceYCenter = sourceRect.top + sourceRect.height / 2 - containerRect.top;
            let targetXCenter = targetRect.left + targetRect.width / 2 - containerRect.left;
            let targetYCenter = targetRect.top + targetRect.height / 2 - containerRect.top;

            // Calculate direction vector from source to target
            const directionX = targetXCenter - sourceXCenter;
            const directionY = targetYCenter - sourceYCenter;
            const length = Math.sqrt(directionX ** 2 + directionY ** 2);

            // Adjust start and end positions to be on the node's border
            let sourceX = sourceXCenter + (directionX / length) * nodeRadius;
            let sourceY = sourceYCenter + (directionY / length) * nodeRadius;
            let targetX = targetXCenter - (directionX / length) * nodeRadius;
            let targetY = targetYCenter - (directionY / length) * nodeRadius;

            console.log(`Source Node Border Position (X, Y): (${sourceX}, ${sourceY})`);
            console.log(`Target Node Border Position (X, Y): (${targetX}, ${targetY})`);

            // Create and configure the line for animation
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', sourceX);
            line.setAttribute('y1', sourceY);
            line.setAttribute('x2', sourceX); // Start from source position
            line.setAttribute('y2', sourceY); // Start from source position
            line.setAttribute('stroke', 'black');
            line.setAttribute('stroke-width', 2);
            line.setAttribute('marker-end', 'url(#arrow)');

            svgContainer.appendChild(line);

            // Use requestAnimationFrame to animate the line to its target position
            const duration = 1500; // Animation duration in milliseconds
            let start = null;

            function animate(timestamp) {
                if (!start) start = timestamp;
                const elapsed = timestamp - start;
                const progress = Math.min(elapsed / duration, 1); // Ensure progress doesn’t exceed 1

                // Interpolating the line position
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
                        resolve();
                    }, 500);
                }
            }
            requestAnimationFrame(animate); // Start the animation
        });
    }

    async fixInsertion(node) {
        console.log(`Starting fixInsertion for node ${node.value}`);
        
        // Delay to ensure node has been rendered in the DOM before trying to blink
        await new Promise(resolve => setTimeout(resolve, 500));
        
        while (node !== this.root && node.parent.color === 'red') {
            let parent = node.parent;
            let grandparent = parent.parent;
    
            console.log(`Checking node ${node.value} with parent ${parent.value} and grandparent ${grandparent.value}`);
    
            if (parent === grandparent.left) {
                let uncle = grandparent.right;
                console.log(`Uncle of node ${node.value} is ${uncle ? uncle.value : 'null'} (right child of grandparent)`);
    
                if (uncle !== null && uncle.color === 'red') {
                    console.log(`Uncle is red, performing recoloring on parent ${parent.value} and uncle ${uncle.value}`);
                    await this.animateRecoloring(parent, uncle, grandparent);
                    node = grandparent;
                    console.log(`Moved up to grandparent node ${node.value}`);
                } else {
                    console.log(`Uncle is black, proceeding to rotation scenario`);
    
                    // *** Moved blinkLine call here, inside the else block ***
                    const parentNodeElement = document.getElementById(`node-${parent.value}`);
                    this.blinkLine(parentNodeElement, document.getElementById(`node-${node.value}`), 3000, 40);
    
                    // Blink nodes before rotation
                    await this.blinkYellow(node);
                    await this.blinkYellow(parent);
                    await this.blinkYellow(grandparent);
    
                    await new Promise(resolve => setTimeout(resolve, 1000));
    
                    // Rotation logic
                    if (node === parent.right) {
                        console.log(`Performing left rotation on parent node ${parent.value}`);
                        node = parent;
    
                        // Animate and perform the left rotation
                        await this.animateRotation(node, 'left');
                        await this.rotateLeft(node);
                        console.log(`Left rotation complete for node ${node.value}`);
                    }
    
                    console.log(`Performing right rotation on grandparent node ${grandparent.value}`);
                    await this.animateRotation(grandparent, 'right');
                    await this.rotateRight(grandparent);
                    console.log(`Right rotation complete for grandparent node ${grandparent.value}`);
    
                    // Recolor after rotation
                    console.log(`Animating recoloring for parent ${parent.value} and grandparent ${grandparent.value}`);
                    await this.animateRecoloring(parent, null, grandparent);
                    parent.color = 'black';
                    grandparent.color = 'red';
                }
            } else {
                // Symmetric case: Parent is a right child of the grandparent
                let uncle = grandparent.left;
                console.log(`Uncle of node ${node.value} is ${uncle ? uncle.value : 'null'} (left child of grandparent)`);
    
                if (uncle !== null && uncle.color === 'red') {
                    console.log(`Uncle is red, performing recoloring on parent ${parent.value} and uncle ${uncle.value}`);
                    await this.animateRecoloring(parent, uncle, grandparent);
                    node = grandparent;
                    console.log(`Moved up to grandparent node ${node.value}`);
                } else {
                    console.log(`Uncle is black, proceeding to rotation scenario`);
    
                    // *** Moved blinkLine call here, inside the else block ***
                    const parentNodeElement = document.getElementById(`node-${parent.value}`);
                    this.blinkLine(parentNodeElement, document.getElementById(`node-${node.value}`), 3000, 40);
    
                    // Blink nodes before rotation
                    await this.blinkYellow(node);
                    await this.blinkYellow(parent);
                    await this.blinkYellow(grandparent);
    
                    await new Promise(resolve => setTimeout(resolve, 1000));
    
                    // Rotation logic
                    if (node === parent.left) {
                        console.log(`Performing right rotation on parent node ${parent.value}`);
                        node = parent;
    
                        // Animate and perform the right rotation
                        await this.animateRotation(node, 'right');
                        await this.rotateRight(node);
                        console.log(`Right rotation complete for node ${node.value}`);
                    }
    
                    console.log(`Performing left rotation on grandparent node ${grandparent.value}`);
                    await this.animateRotation(grandparent, 'left');
                    await this.rotateLeft(grandparent);
                    console.log(`Left rotation complete for grandparent node ${grandparent.value}`);
    
                    // Recolor after rotation
                    console.log(`Animating recoloring for parent ${parent.value} and grandparent ${grandparent.value}`);
                    await this.animateRecoloring(parent, null, grandparent);
                    parent.color = 'black';
                    grandparent.color = 'red';
                }
            }
        }
    
        console.log('Ensuring root is black');
        await this.recolorBlack(this.root);
        console.log('FixInsertion complete');
    }

    blinkLine(sourceNode, targetNode, duration = 1000, lineLength = 40) {
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
        // Calculate positions within the tree container
        const startX = sourceRect.left + sourceRect.width / 2 - containerRect.left;
        const startY = sourceRect.top + sourceRect.height / 2 - containerRect.top;
        const endX = targetRect.left + targetRect.width / 2 - containerRect.left;
        const endY = targetRect.top + targetRect.height / 2 - containerRect.top;
        // Calculate the direction vector from source to target
        const dx = endX - startX;
        const dy = endY - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        // Normalize the direction vector
        const normalizedDx = dx / distance;
        const normalizedDy = dy / distance;
        // Define the start and end positions based on the node radius (assuming nodes are circular)
        const nodeRadius = sourceRect.width / 2;
        // Adjust the start and end points to be on the border of the source and target nodes
        const adjustedStartX = startX + normalizedDx * nodeRadius;
        const adjustedStartY = startY + normalizedDy * nodeRadius;
        const adjustedEndX = endX - normalizedDx * nodeRadius;
        const adjustedEndY = endY - normalizedDy * nodeRadius;
        // Create the line element
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', adjustedStartX);
        line.setAttribute('y1', adjustedStartY);
        line.setAttribute('x2', adjustedEndX);
        line.setAttribute('y2', adjustedEndY);
        line.setAttribute('stroke', 'red');
        line.setAttribute('stroke-width', 2);
        line.setAttribute('marker-end', 'url(#blink-arrow)');
        // Add line to SVG and apply blink class
        svgContainer.appendChild(line);
        line.classList.add('blink-red-line');
        // Blinking effect using CSS and JavaScript for the arrowhead and line
        const blinkInterval = setInterval(() => {
            line.classList.toggle('blink-red-line'); // Toggle line blinking
        }, duration / 4); // Toggle blink state every quarter of the duration
        // Remove blinking effect and line after duration
        setTimeout(() => {
            clearInterval(blinkInterval);
            line.classList.remove('blink-red-line');
            svgContainer.removeChild(line);
        }, duration);
    }

    moveSuccessor(nodeToDelete, successor) {
        if (!nodeToDelete || !successor) {
            console.error("Invalid nodeToDelete or missing successor.");
            return;
        }
    
        const svgContainer = d3.select('#tree svg');
        const successorCircle = svgContainer.select(`circle#node-${successor.value}`);
        const successorText = svgContainer.select(`text#text-${successor.value}`);
        const nodeToDeleteCircle = svgContainer.select(`circle#node-${nodeToDelete.value}`);
        const nodeToDeleteText = svgContainer.select(`text#text-${nodeToDelete.value}`);
    
        if (!successorCircle.empty() && !nodeToDeleteCircle.empty()) {
            const targetX = parseFloat(nodeToDeleteCircle.attr('cx'));
            const targetY = parseFloat(nodeToDeleteCircle.attr('cy'));
    
            // Animate the successor moving to the deleted node's position
            successorCircle.transition()
                .duration(1000)
                .attr('cx', targetX)
                .attr('cy', targetY);
    
            successorText.transition()
                .duration(1000)
                .attr('x', targetX)
                .attr('y', targetY + 4);
        }
    }
    
    // Method to find the successor of a given node in the tree
    findSuccessor(node) {
        if (node.right !== null) {
            // The successor is the smallest node in the right subtree
            return this.minimum(node.right);
        }
        // No right child, go up to the parent until we've found a node which is a left child of its parent
        let parentNode = node.parent;
        while (parentNode !== null && node === parentNode.right) {
            node = parentNode;
            parentNode = parentNode.parent;
        }
        return parentNode;
    }

    blinkYellow(node) {
        const nodeElement = document.getElementById(`node-${node.value}`); // Get the DOM element for the node
        if (nodeElement) {
            nodeElement.classList.add('blink-yellow'); // Add the blinking class
            setTimeout(() => {
                nodeElement.classList.remove('blink-yellow'); 
            }, 5000); 
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
    async delete(value) {
        const node = this.findNode(value);
        if (!node) return;
    
        let y = node;
        let yOriginalColor = y.color;
        let x;
    
        // Case 1: Node with no children
        if (node.left === null && node.right === null) {
            await this.fadeOutNode(node); // Fade out the node as it has no children
            x = null;
            this.transplant(node, null);
        }
        // Case 2: Node with one child
        else if (node.left === null || node.right === null) {
            x = node.left === null ? node.right : node.left;
    
            // Fade out the node before moving its child up and transplanting
            await this.fadeOutNode(node);
    
            this.moveNodeUp(x, node); // Animate the child moving up
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for animation to complete
    
            this.transplant(node, x);
        }
        // Case 3: Node with two children
        else {
            y = this.minimum(node.right);
            yOriginalColor = y.color;
            x = y.right;
    
            if (y.parent !== node) {
                this.transplant(y, y.right);
                y.right = node.right;
                if (y.right !== null) y.right.parent = y;
            }
    
            // Fade out the node before moving the successor and transplanting
            await this.fadeOutNode(node);
    
            this.moveSuccessor(node, y); // Animate the successor moving up
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for animation to complete
    
            this.transplant(node, y);
            y.left = node.left;
            if (y.left !== null) y.left.parent = y;
            y.color = node.color;
        }
    
        if (yOriginalColor === 'black') {
            await this.fixDeletion(x);
        }
    }
    
      
    
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
    async fixDeletion(x) {
        while (x !== this.root && this.getColor(x) === 'black') {
            let parent = x ? x.parent : null;
    
            if (parent === null) {
                // If parent is null, we've reached the root, break the loop
                break;
            }
    
            if (x === parent.left) {
                let w = parent.right;
    
                if (this.getColor(w) === 'red') {
                    await this.recolorBlack(w);
                    await this.recolorRed(parent);
                    await this.rotateLeft(parent);
                    w = parent.right;
                }
    
                if (this.getColor(w.left) === 'black' && this.getColor(w.right) === 'black') {
                    await this.recolorRed(w);
                    x = parent;
                } else {
                    if (this.getColor(w.right) === 'black') {
                        if (w.left !== null) await this.recolorBlack(w.left);
                        await this.recolorRed(w);
                        await this.rotateRight(w);
                        w = parent.right;
                    }
                    w.color = parent.color;
                    await this.recolorBlack(parent);
                    if (w.right !== null) await this.recolorBlack(w.right);
                    await this.rotateLeft(parent);
                    x = this.root;
                }
            } else {
                // Symmetric case when x is the right child
                let w = parent.left;
    
                if (this.getColor(w) === 'red') {
                    await this.recolorBlack(w);
                    await this.recolorRed(parent);
                    await this.rotateRight(parent);
                    w = parent.left;
                }
    
                if (this.getColor(w.left) === 'black' && this.getColor(w.right) === 'black') {
                    await this.recolorRed(w);
                    x = parent;
                } else {
                    if (this.getColor(w.left) === 'black') {
                        if (w.right !== null) await this.recolorBlack(w.right);
                        await this.recolorRed(w);
                        await this.rotateLeft(w);
                        w = parent.left;
                    }
                    w.color = parent.color;
                    await this.recolorBlack(parent);
                    if (w.left !== null) await this.recolorBlack(w.left);
                    await this.rotateRight(parent);
                    x = this.root;
                }
            }
        }
        if (x !== null) await this.recolorBlack(x);
    }
    
    
    async blinkNode(node, finalColor, duration = 1000) {
        const nodeElement = document.getElementById(`node-${node.value}`);
        if (nodeElement) {
            const currentColor = node.color;
            const blinkClass = (finalColor === 'black' && currentColor !== 'black') ? 'blink-black' : 'blink-red';
            console.log(`Applying ${blinkClass} to node ${node.value}`);    

            // Add blink class
            nodeElement.classList.add(blinkClass);

            // Wait for the blink animation to finish
            await new Promise(resolve => setTimeout(resolve, duration));

            console.log(`Removing ${blinkClass} from node ${node.value}`);
            // Remove blink class after the duration
            nodeElement.classList.remove(blinkClass);

            // Apply the final color
            nodeElement.style.backgroundColor = finalColor;
            console.log(`Node ${node.value} has been recolored to ${finalColor}.`);
        } else {
            console.error(`Could not find DOM element for node ${node.value}`);
        }
    }

    async animateRecoloring(parent, uncle, grandparent) {
        console.log(`Starting recoloring for parent node ${parent.value}...`);

        // Only animate and recolor if the color needs to change
        if (parent.color !== 'black') {
            console.log(`Blinking and recoloring parent: ${parent.value}`);
            await this.blinkNode(parent, 'black');  // Blink before recoloring
            await this.recolorBlack(parent);        // Then recolor
        }

        if (uncle !== null && uncle.color !== 'black') {
            console.log(`Blinking and recoloring uncle: ${uncle.value}`);
            await this.blinkNode(uncle, 'black');  // Blink before recoloring
            await this.recolorBlack(uncle);        // Then recolor
        }

        if (grandparent.color !== 'red') {
            console.log(`Blinking and recoloring grandparent: ${grandparent.value}`);
            await this.blinkNode(grandparent, 'red');  // Blink before recoloring
            await this.recolorRed(grandparent);        // Then recolor
        }

        renderTree();  // Re-render the entire tree after blinking and recoloring are complete
    }

    async animateRotation(node, direction) {
        console.log(`Animating ${direction} rotation on node ${node.value}`);
    
        // Calculate target positions based on the rotation direction
        const offset = 50;
        const targetGrandparentX = grandparentX + (direction === 'left' ? -offset : offset);
        const targetGrandparentY = grandparentY + 80;
        const targetParentX = grandparentX;
        const targetParentY = grandparentY;
        const targetNewNodeX = parentX;
        const targetNewNodeY = parentY;
    
        // Animate the nodes using the updated animateNode function
        if (newNode) {
            await animateNode(newNode.value, targetNewNodeX, targetNewNodeY);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    
        await animateNode(parentNode.value, targetParentX, targetParentY);
        await new Promise(resolve => setTimeout(resolve, 1000));
    
        await animateNode(node.value, targetGrandparentX, targetGrandparentY);
        await new Promise(resolve => setTimeout(resolve, 1000));
    
        console.log(`${direction} rotation animation complete`);
    }
    
    async fadeOutNode(node) {
        const svgContainer = d3.select('#tree svg');
        const nodeElement = svgContainer.select(`circle#node-${node.value}`);
        const textElement = svgContainer.select(`text#text-${node.value}`);
    
        if (!nodeElement.empty() && !textElement.empty()) {
            // Bring node and text to front
            nodeElement.raise();
            textElement.raise();
    
            // Apply fade-out transition to both elements
            nodeElement.transition()
                .duration(1000)
                .style('opacity', 0)
                .remove(); // Remove after transition
    
            textElement.transition()
                .duration(1000)
                .style('opacity', 0)
                .remove(); // Remove after transition
    
            // Wait for the transition to complete
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    

    moveNodeUp(nodeToMove, targetPosition) {
        const svgContainer = d3.select('#tree svg');
        const nodeCircle = svgContainer.select(`circle#node-${nodeToMove.value}`);
        const nodeText = svgContainer.select(`text#text-${nodeToMove.value}`);
        const targetCircle = svgContainer.select(`circle#node-${targetPosition.value}`);

        if (!nodeCircle.empty() && !targetCircle.empty()) {
            const targetX = parseFloat(targetCircle.attr('cx'));
            const targetY = parseFloat(targetCircle.attr('cy'));

            // Animate the node circle moving up
            nodeCircle.transition()
                .duration(1000)
                .attr('cx', targetX)
                .attr('cy', targetY);

            // Animate the node text moving up
            nodeText.transition()
                .duration(1000)
                .attr('x', targetX)
                .attr('y', targetY + 4); // Adjust y position for text centering
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
    newNodeElement.style.left = '5px';  // Positioning at the top-left corner
    newNodeElement.style.top = '5px';
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
    traversalCircle.style.marginLeft = '8px';
    traversalCircle.style.marginTop = '8px';
    traversalCircle.style.borderRadius = '50%';
    traversalCircle.style.transition = 'all 3s ease';  // Smooth movement
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

// Helper function to animate node movement smoothly, including the node value (text)
function animateNode(nodeValue, targetX, targetY) {
        const svgContainer = d3.select('#tree svg');
    
        // Select the circle and text elements using D3.js
        const circle = svgContainer.select(`circle#node-${nodeValue}`);
        const text = svgContainer.select(`text#text-${nodeValue}`);
    
        if (!circle.empty() && !text.empty()) {
            // Use D3 transitions to animate movement of the circle
            circle.transition()
                .duration(1000) // Adjust the duration as needed
                .attr('cx', targetX)
                .attr('cy', targetY);
    
            // Use D3 transitions to animate movement of the text
            text.transition()
                .duration(1000) // Ensure the duration matches the circle's transition
                .attr('x', targetX)
                .attr('y', targetY + 4); // Adjust y position for text centering
    
            // Optionally, after the transition completes, you can update the data attributes
            setTimeout(() => {
                circle.attr('cx', targetX).attr('cy', targetY);
                text.attr('x', targetX).attr('y', targetY + 4);
            }, 1000); // Match this timeout to the duration of the transition
        } else {
            console.error(`Could not find elements for node with value ${nodeValue}`);
        }
}

// This function renders a node of the Red-Black Tree and its connections in the DOM.
function renderNode(node, container, parentNode, isLeft) {
    const element = document.createElement('div');
    element.className = 'node';
    element.id = `node-${node.value}`;  // Ensure node ID is correctly set
    element.innerText = node.value;
    element.style.backgroundColor = node.color === 'red' ? 'red' : 'black';
    container.appendChild(element);

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
async function deleteNode() {
    const value = parseInt(document.getElementById('nodeValue').value);
    if (isNaN(value)) {
        alert('Please enter a valid node value.');
        return;
    }

    // Perform traversal animation to the node to be deleted
    let currentNode = tree.root;

    // Create or select the SVG circle for highlighting
    let svg = document.getElementById('highlightCircle');
    if (!svg) {
        svg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        svg.setAttribute("id", "highlightCircle");
        svg.setAttribute("r", 20); // Circle radius
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "yellow"); // Initial stroke color is yellow for traversal
        svg.setAttribute("stroke-width", 4);
        document.querySelector('svg').appendChild(svg);
    } else {
        svg.setAttribute("stroke", "yellow"); // Reset the stroke color to yellow
    }

    // Create a promise-based traversal function
    const nodeToDelete = await traverseToDelete(currentNode, null, value, svg);

    if (!nodeToDelete) {
        alert('Node not found.');
        return;
    }

    // Highlight relationships before deletion
    await highlightRelationships(nodeToDelete);

    // Proceed to delete the node (fade-out handled inside the delete method)
    await tree.delete(nodeToDelete.value);

    // Render the tree to visualize the current state after deletion
    renderTree();
}


async function traverseToDelete(node, parentElement, value, svg) {
    if (!node) {
        // Node not found
        return null;
    }

    const nodeElement = document.getElementById(`node-${node.value}`);
    if (!nodeElement) {
        console.error(`Node element for node ${node.value} not found!`);
        return null;
    }

    // Animate movement from parent node to current node
    if (parentElement) {
        await moveHighlightTo(svg, parentElement, nodeElement, 1000); // Move the circle over 1000ms
    } else {
        // If we're at the root, place the circle there
        await moveHighlightTo(svg, null, nodeElement, 0); // No movement (circle starts here)
    }

    // Wait for 2 seconds before evaluating the node
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (node.value === value) {
        // Flash green to signal that this is the node to be deleted
        nodeElement.classList.add('blink-green');
        svg.setAttribute("stroke", "green"); // Change the circle to green

        // Wait for blinking to finish
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Remove the circle after blinking is complete
        svg.remove();
        clearBlink(nodeElement, node.color); // Restore the node's original color
        return node; // Node found
    } else {
        // Continue traversal
        const nextNode = value < node.value ? node.left : node.right;
        return await traverseToDelete(nextNode, nodeElement, value, svg);
    }
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

    // Traversing function to search for the target node
    function traverse(node, parentElement) {
        if (!node) return; // Stop if the node is null

        const nodeElement = document.getElementById(`node-${node.value}`);
        if (!nodeElement) {
            console.error(`Node element for node ${node.value} not found!`);
            return;
        }

        const originalColor = node.color === 'red' ? 'red' : 'black'; // Store the original color

        // Animate movement from parent node to current node
        if (parentElement) {
            moveHighlightTo(svg, parentElement, nodeElement, 1000); // Move the circle over 1000ms
        } else {
            // If we're at the root, place the circle there
            moveHighlightTo(svg, null, nodeElement, 0); // No movement (circle starts here)
        }

        // Timer to wait for 2 seconds before stopping at the node
        setTimeout(() => {
            // If it's the correct node, change circle color to green and add blinking effect
            if (node.value === targetValue) {
                nodeElement.classList.add('blink-green');
                svg.setAttribute("stroke", "green"); // Change the circle to green

                // Remove the circle after blinking is complete
                setTimeout(() => {
                    svg.remove(); // Remove the circle after blinking
                    clearBlink(nodeElement, originalColor); // Restore the node's original color
                }, 1500); // Keep the circle green for 1.5 seconds

                return; // Stop traversal when the target node is found
            }

            // If not the correct node, continue the search
            const nextNode = targetValue < node.value ? node.left : node.right;
            traverse(nextNode, nodeElement); // Traverse left or right child
        }, 2000); // Stop at the node for 2 seconds before evaluating the next node
    }

    traverse(currentNode, null); // Start traversal from the root
}

function moveHighlightTo(circle, startNodeElement, endNodeElement, duration = 1000) {
    return new Promise((resolve) => {
        if (!endNodeElement) {
            console.error("End node element is null, cannot highlight.");
            resolve();
            return;
        }

        // If this is the first node (root), move the circle there directly
        if (!startNodeElement) {
            const endX = parseFloat(endNodeElement.getAttribute('cx'));
            const endY = parseFloat(endNodeElement.getAttribute('cy'));
            circle.setAttribute("cx", endX);
            circle.setAttribute("cy", endY);
            resolve();
            return;
        }

        // Otherwise, interpolate movement from start to end
        const startX = parseFloat(startNodeElement.getAttribute('cx'));
        const startY = parseFloat(startNodeElement.getAttribute('cy'));
        const endX = parseFloat(endNodeElement.getAttribute('cx'));
        const endY = parseFloat(endNodeElement.getAttribute('cy'));

        const deltaX = endX - startX;
        const deltaY = endY - startY;

        const frames = 60; // Number of frames for the animation
        const frameDuration = duration / frames;

        let currentFrame = 0;

        function animateStep() {
            if (currentFrame < frames) {
                const progress = currentFrame / frames;

                // Interpolate between start and end positions
                const currentX = startX + deltaX * progress;
                const currentY = startY + deltaY * progress;

                // Update circle position
                circle.setAttribute("cx", currentX);
                circle.setAttribute("cy", currentY);

                currentFrame++;
                setTimeout(animateStep, frameDuration);
            } else {
                // Ensure the circle lands precisely at the end position
                circle.setAttribute("cx", endX);
                circle.setAttribute("cy", endY);
                resolve();
            }
        }

        animateStep(); // Start the animation
    });
}

function clearBlink(nodeElement, originalColor) {
    nodeElement.classList.remove('blink-red', 'blink-green');
    nodeElement.style.backgroundColor = originalColor; // Restore original background color
}

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

    tree.root = predefinedTree.root; 
    renderTree(); 
}

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

function ensureHighlightCircle() {
    let svgContainer = document.getElementById('svgCanvas');
    if (!svgContainer) {
        const treeContainer = document.getElementById('tree');
        svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgContainer.setAttribute('id', 'svgCanvas');
        svgContainer.setAttribute('width', '100%');
        svgContainer.setAttribute('height', '100%');
        treeContainer.appendChild(svgContainer);
    }

    let circle = document.getElementById("highlightCircle");
    if (!circle) {
        circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("id", "highlightCircle");
        circle.setAttribute("r", 20); // Circle radius
        circle.setAttribute("fill", "transparent"); // Fill color
        circle.setAttribute("stroke", "green"); // Stroke color for highlight
        circle.setAttribute("stroke-width", 5);

        svgContainer.appendChild(circle);
    }
    return circle;
}

function moveHighlightToPrint(circle, startNodeElement, endNodeElement, duration = 1000) { 
    // Ensure endNodeElement exists before proceeding
    if (!endNodeElement) {
        console.error("End node element is null, cannot highlight.");
        return;
    }

    // If this is the first node (root), move the circle there directly
    if (!startNodeElement) {
        const endX = parseFloat(endNodeElement.getAttribute('cx'));
        const endY = parseFloat(endNodeElement.getAttribute('cy'));
        circle.setAttribute("cx", endX);
        circle.setAttribute("cy", endY);
        return;
    }

    // Otherwise, interpolate movement from start to end
    const startX = parseFloat(startNodeElement.getAttribute('cx'));
    const startY = parseFloat(startNodeElement.getAttribute('cy'));
    const endX = parseFloat(endNodeElement.getAttribute('cx'));
    const endY = parseFloat(endNodeElement.getAttribute('cy'));

    const deltaX = endX - startX;
    const deltaY = endY - startY;

    const frames = 60; // Number of frames for the animation
    const frameDuration = duration / frames;

    let currentFrame = 0;

    function animateStep() {
        if (currentFrame < frames) {
            const progress = currentFrame / frames;

            // Interpolate between start and end positions
            const currentX = startX + deltaX * progress;
            const currentY = startY + deltaY * progress;

            // Update circle position
            circle.setAttribute("cx", currentX);
            circle.setAttribute("cy", currentY);

            currentFrame++;
            setTimeout(animateStep, frameDuration);
        } else {
            // Ensure the circle lands precisely at the end position
            circle.setAttribute("cx", endX);
            circle.setAttribute("cy", endY);
        }
    }

    animateStep(); // Start the animation
}

// Function to start the animated traversal based on the selected type
function startAnimatedTraversal(type) {
    const circle = ensureHighlightCircle(); // Ensure the highlight circle exists
    document.getElementById("traversalModal").style.display = "none"; // Close the modal

    // Make traversal result visible
    const resultContainer = document.getElementById("traversalResult");
    resultContainer.style.display = "block"; // Show the result container
    resultContainer.innerHTML = ''; // Clear previous results

    let traversalPromise;
    if (type === 'inOrder') {
        traversalPromise = animateInOrder(tree.root, circle);
    } else if (type === 'preOrder') {
        traversalPromise = animatePreOrder(tree.root, circle);
    } else if (type === 'postOrder') {
        traversalPromise = animatePostOrder(tree.root, circle);
    }

    traversalPromise.then(() => {
        setTimeout(() => {
            // Hide the green ring (assuming it's part of the circle or another element)
            circle.style.display = 'none';  // Adjust this line if your green ring is represented differently

            // Set timeout to clear the traversal results after 10 seconds
            setTimeout(() => {
                resultContainer.style.display = 'none'; // Hide the result container
                resultContainer.innerHTML = ''; // Clear results visually
            }, 10000); // 10 seconds delay to hide traversal results

        }, 500); // 500 ms delay to hide green ring
    });
}

// Traverse the tree in in-order and animate the highlight circle
async function animateInOrder(node, circle, previousNodeElement = null) {
    if (node !== null) {
        await animateInOrder(node.left, circle, previousNodeElement);

        const nodeElement = document.getElementById(`node-${node.value}`);
        console.log(`In-order: Moving highlight to ${nodeElement.id}`);
        await moveHighlightToPrint(circle, previousNodeElement, nodeElement, 1000);

        // Print node value after the circle has moved
        printNodeValue(node.value);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Pause for 2 seconds

        previousNodeElement = nodeElement; // Update previous node for the next call
        await animateInOrder(node.right, circle, previousNodeElement);
    }
}

// Similar adjustments for Pre-Order and Post-Order functions
async function animatePreOrder(node, circle, previousNodeElement = null) {
    if (node !== null) {
        const nodeElement = document.getElementById(`node-${node.value}`);
        console.log(`Pre-order: Moving highlight to ${nodeElement.id}`);
        await moveHighlightToPrint(circle, previousNodeElement, nodeElement, 1000);

        printNodeValue(node.value);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Pause for 2 seconds

        previousNodeElement = nodeElement;
        await animatePreOrder(node.left, circle, previousNodeElement);
        await animatePreOrder(node.right, circle, previousNodeElement);
    }
}

async function animatePostOrder(node, circle, previousNodeElement = null) {
    if (node !== null) {
        await animatePostOrder(node.left, circle, previousNodeElement);
        await animatePostOrder(node.right, circle, previousNodeElement);

        const nodeElement = document.getElementById(`node-${node.value}`);
        console.log(`Post-order: Moving highlight to ${nodeElement.id}`);
        await moveHighlightToPrint(circle, previousNodeElement, nodeElement, 1000);

        printNodeValue(node.value);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Pause for 2 seconds

        previousNodeElement = nodeElement;
    }
}

// Function to print the node value at the bottom of the tree container
function printNodeValue(value) {
    const resultContainer = document.getElementById("traversalResult");
    resultContainer.innerHTML += `<span style="margin-right: 10px;">${value}</span>`; // Append the node value with spacing
}

async function highlightRelationships(node) {
    let svgContainer = document.getElementById('svgCanvas');
    if (!svgContainer) {
        const treeContainer = document.getElementById('tree');
        svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgContainer.setAttribute('id', 'svgCanvas');
        treeContainer.appendChild(svgContainer);
    }

    const nodeElement = document.getElementById(`node-${node.value}`);
    const parentElement = node.parent ? document.getElementById(`node-${node.parent.value}`) : null;
    const leftChildElement = node.left ? document.getElementById(`node-${node.left.value}`) : null;
    const rightChildElement = node.right ? document.getElementById(`node-${node.right.value}`) : null;

    // Function to draw and animate a line
    const drawLine = (from, to, color) => {
        if (from && to) {
            let fromCenter = getCenter(from);
            let toCenter = getCenter(to);
            let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute('x1', fromCenter.centerX);
            line.setAttribute('y1', fromCenter.centerY);
            line.setAttribute('x2', toCenter.centerX);
            line.setAttribute('y2', toCenter.centerY);
            line.setAttribute('stroke', color);
            line.setAttribute('stroke-width', 3);
            svgContainer.appendChild(line);

            // Optional: Animate the line
            line.style.transition = 'stroke-dashoffset 1s ease-in-out';
            line.setAttribute('stroke-dasharray', `${Math.sqrt(Math.pow(toCenter.centerX - fromCenter.centerX, 2) + Math.pow(toCenter.centerY - fromCenter.centerY, 2))}`);
            line.setAttribute('stroke-dashoffset', `${Math.sqrt(Math.pow(toCenter.centerX - fromCenter.centerX, 2) + Math.pow(toCenter.centerY - fromCenter.centerY, 2))}`);
            setTimeout(() => {
                line.setAttribute('stroke-dashoffset', '0');
            }, 100);

            return line;
        }
        return null;
    };

    let lines = [];
    if (parentElement) {
        lines.push(drawLine(nodeElement, parentElement, 'yellow'));
    }
    if (leftChildElement) {
        lines.push(drawLine(nodeElement, leftChildElement, 'yellow'));
    }
    if (rightChildElement) {
        lines.push(drawLine(nodeElement, rightChildElement, 'yellow'));
    }

    // Wait a moment before fading or continuing with deletion
    await new Promise(resolve => setTimeout(resolve, 4000));

    // Fade out or remove lines if moving to deletion
    lines.forEach(line => svgContainer.removeChild(line));
}

function getCenter(element) {
    const rect = element.getBoundingClientRect();
    const treeContainerRect = document.getElementById('tree').getBoundingClientRect();
    return {
        centerX: rect.left + rect.width / 2 - treeContainerRect.left,
        centerY: rect.top + rect.height / 2 - treeContainerRect.top
    };
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
            nodes.push({ node, x, y });

            // Calculate new y based on the depth (level) of the node
            const ySpacing = 80; // Adjust this value for more spacing between levels
            const newY = y + ySpacing;

            if (node.left !== null) {
                const newXOffset = xOffset / 1.5; // Adjust this as needed
                links.push({ source: { x, y }, target: { x: x - xOffset, y: newY } });
                traverse(node.left, x - xOffset, newY, level + 1, newXOffset);
            }

            if (node.right !== null) {
                const newXOffset = xOffset / 1.5; // Adjust this as needed
                links.push({ source: { x, y }, target: { x: x + xOffset, y: newY } });
                traverse(node.right, x + xOffset, newY, level + 1, newXOffset);
            }
        }
    }

    // Start the traversal from the root node, centered horizontally, and at a starting vertical position.
    traverse(tree.root, width / 2, 30, 1, width / 12);  // Width divided by 12 for even tighter spacing

    // Create and configure the SVG container for rendering the tree.
    const svgContainer = d3.select('#tree').append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`);

    // Add arrow markers to the SVG for use in the links (edges).
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
        .attr('d', 'M 0 0 L 10 5 L 0 10 z')  // Define the arrow shape
        .attr('fill', 'black');

    // Render the links (edges) between nodes.
    const linkSelection = svgContainer.selectAll('line')
        .data(links);

    linkSelection.enter()
        .append('line')
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => {
            // Shorten the x2 by 15 (node radius) to prevent arrow from overlapping node
            const dx = d.target.x - d.source.x;
            const dy = d.target.y - d.source.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const scale = (distance - 15) / distance;  // Shorten by node radius
            return d.source.x + dx * scale;
        })
        .attr('y2', d => {
            // Shorten the y2 by 15 (node radius) to prevent arrow from overlapping node
            const dx = d.target.x - d.source.x;
            const dy = d.target.y - d.source.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const scale = (distance - 15) / distance;  // Shorten by node radius
            return d.source.y + dy * scale;
        })
        .attr('stroke', 'black')
        .attr('stroke-width', 2)  // Ensure the stroke is wide enough
        .attr('marker-end', 'url(#arrow)')  // Add the arrow marker to the end of the line
        .transition()
        .duration(500)
        .attr('x2', d => {
            // Shorten the x2 by 15 (node radius) to prevent arrow from overlapping node
            const dx = d.target.x - d.source.x;
            const dy = d.target.y - d.source.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const scale = (distance - 15) / distance;  // Shorten by node radius
            return d.source.x + dx * scale;
        })
        .attr('y2', d => {
            // Shorten the y2 by 15 (node radius) to prevent arrow from overlapping node
            const dx = d.target.x - d.source.x;
            const dy = d.target.y - d.source.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const scale = (distance - 15) / distance;  // Shorten by node radius
            return d.source.y + dy * scale;
        });

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

    // Render the node values (text labels) inside the nodes.
    svgContainer.selectAll('text')
        .data(nodes)
        .enter()
        .append('text')
        .attr('id', d => `text-${d.node.value}`) 
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


