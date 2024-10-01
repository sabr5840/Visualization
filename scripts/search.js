// This function searches for a node with the specified value in the Red-Black Tree and highlights the path to it.
function searchNode() {
    const targetValue = parseInt(document.getElementById('nodeValue').value); // Get the target value from the input field.
    
    // Validate input to ensure it's a number.
    if (isNaN(targetValue)) {
        alert('Please enter a valid node value.');
        return;
    }

    let currentNode = tree.root; // Start the search from the root node.

    // Create or select the SVG circle for highlighting.
    let svg = document.getElementById('highlightCircle');
    if (!svg) {
        svg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        svg.setAttribute("id", "highlightCircle");
        svg.setAttribute("r", 20); // Circle radius.
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "red"); // Initial stroke color is red for search.
        svg.setAttribute("stroke-width", 4);
        document.querySelector('svg').appendChild(svg);
    }

    // Recursive function to traverse the tree and highlight the nodes during the search.
    function traverse(node, parentElement) {
        if (!node) return; // Stop if the node is null.

        const nodeElement = document.getElementById(`node-${node.value}`);
        if (!nodeElement) {
            console.error(`Node element for node ${node.value} not found!`);
            return;
        }

        const originalColor = node.color === 'red' ? 'red' : 'black'; // Store the original color of the node.

        // Move the highlight circle from the parent node to the current node.
        if (parentElement) {
            moveHighlightTo(svg, parentElement, nodeElement, 1000); // Move the circle over 1 second.
        } else {
            // If this is the root, place the circle directly on it.
            moveHighlightTo(svg, null, nodeElement, 0);
        }

        // Wait 2 seconds before evaluating the node to simulate search traversal.
        setTimeout(() => {
            if (node.value === targetValue) {
                // If the target node is found, blink green and stop the traversal.
                nodeElement.classList.add('blink-green');
                svg.setAttribute("stroke", "green"); // Change the circle's color to green.

                // Remove the highlight circle after a brief blink.
                setTimeout(() => {
                    svg.remove(); // Remove the circle after the node is found.
                    clearBlink(nodeElement, originalColor); // Restore the node's original color.
                }, 1500); // Hold the green circle for 1.5 seconds.

                return; // Stop traversal since the node is found.
            }

            // If not the correct node, continue searching left or right.
            const nextNode = targetValue < node.value ? node.left : node.right;
            traverse(nextNode, nodeElement); // Recursively traverse to the next node.
        }, 2000); // Pause at each node for 2 seconds before moving to the next.
    }

    traverse(currentNode, null); // Start traversal from the root node.
}

// This function moves the highlight circle from one node to another.
function moveHighlightTo(circle, startNodeElement, endNodeElement, duration = 1000) {
    if (!startNodeElement) {
        // If no start node is provided (e.g., root), directly place the circle on the end node.
        const endX = parseFloat(endNodeElement.getAttribute('cx'));
        const endY = parseFloat(endNodeElement.getAttribute('cy'));
        circle.setAttribute("cx", endX);
        circle.setAttribute("cy", endY);
        return;
    }

    // Interpolate the movement from start to end.
    const startX = parseFloat(startNodeElement.getAttribute('cx'));
    const startY = parseFloat(startNodeElement.getAttribute('cy'));
    const endX = parseFloat(endNodeElement.getAttribute('cx'));
    const endY = parseFloat(endNodeElement.getAttribute('cy'));

    const deltaX = endX - startX;
    const deltaY = endY - startY;

    const frames = 60; // Number of frames for the animation.
    const frameDuration = duration / frames;

    let currentFrame = 0;

    function animateStep() {
        if (currentFrame < frames) {
            const progress = currentFrame / frames;

            // Interpolate between start and end positions.
            const currentX = startX + deltaX * progress;
            const currentY = startY + deltaY * progress;

            // Update the circle's position.
            circle.setAttribute("cx", currentX);
            circle.setAttribute("cy", currentY);

            currentFrame++;
            setTimeout(animateStep, frameDuration); // Continue animating.
        } else {
            // Ensure the circle lands precisely on the end position.
            circle.setAttribute("cx", endX);
            circle.setAttribute("cy", endY);
        }
    }

    animateStep(); // Start the animation.
}

// This function removes the blinking effect and restores the original color of the node.
function clearBlink(nodeElement, originalColor) {
    nodeElement.classList.remove('blink-red', 'blink-green');
    nodeElement.style.backgroundColor = originalColor; // Restore the node's original background color.
}
