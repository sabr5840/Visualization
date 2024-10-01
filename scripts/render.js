// This function renders the entire Red-Black Tree in the DOM.
function renderTree(foundNode = null) {
    const treeContainer = document.getElementById('tree'); // Get the container element where the tree will be rendered.
    treeContainer.innerHTML = ''; // Clear the current tree visualization.

    const width = treeContainer.clientWidth; // Get the container width.
    const height = treeContainer.clientHeight; // Get the container height.

    const nodes = []; // Array to store the nodes for rendering.
    const links = []; // Array to store the links between nodes for rendering.

    // Helper function to traverse the tree and collect nodes and links.
    function traverse(node, x, y, level, xOffset) {
        if (node !== null) {
            nodes.push({ node, x, y }); // Add the current node to the nodes array.

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

    // Start the traversal from the root node, centered horizontally and vertically.
    traverse(tree.root, width / 2, 30, 1, width / 4);

    const minX = Math.min(...nodes.map(d => d.x)); // Calculate the bounding box for rendering.
    const maxX = Math.max(...nodes.map(d => d.x));
    const minY = Math.min(...nodes.map(d => d.y));
    const maxY = Math.max(...nodes.map(d => d.y));

    const treeWidth = maxX - minX;
    const treeHeight = maxY - minY;

    // Create the SVG container for rendering the tree.
    const svgContainer = d3.select('#tree').append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `${minX - 50} ${minY - 50} ${treeWidth + 100} ${treeHeight + 100}`);

    // Render the links (edges) between nodes.
    svgContainer.selectAll('line')
        .data(links)
        .enter()
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

    // Render the nodes (circles) for non-null nodes.
    svgContainer.selectAll('circle')
        .data(nodes.filter(d => d.node.value !== 'NIL'))
        .enter()
        .append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 15)
        .attr('fill', d => d.node.color)
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('id', d => `node-${d.node.value}`)
        .transition()
        .duration(500)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

    // Add labels (values) to the nodes.
    svgContainer.selectAll('text')
        .data(nodes)
        .enter()
        .append('text')
        .attr('x', d => d.x)
        .attr('y', d => d.y + 4)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .text(d => d.node.value);

    // Render the null nodes (rectangles for NIL).
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

    // Add labels (NIL) to the null nodes.
    svgContainer.selectAll('.null-node-text')
        .data(nodes.filter(d => d.node.value === 'NIL'))
        .enter()
        .append('text')
        .attr('x', d => d.x)
        .attr('y', d => d.y + 4)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .text('NIL');

    // If a specific node was found, highlight it.
    if (foundNode) {
        blinkNode(foundNode);
    }
}

// This function visually highlights a node by making it blink for a short duration.
function blinkNode(node) {
    // Select all 'circle' elements within the '#tree' container and filter to find the circle representing the given node.
    const circles = d3.select('#tree').selectAll('circle')
        .filter(d => d.node === node);

    // Add the blink class to trigger animation.
    circles.classed('blink', true);

    // Remove the blink class after 5 seconds.
    setTimeout(() => {
        circles.classed('blink', false);
        // Set fill color back to node's original color if needed.
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
        const line = document.createElement('div');
        line.className = 'line'; // Set the CSS class for styling the line.

        const parentRect = parentNode.getBoundingClientRect();
        const nullNodeRect = nullNode.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Calculate the positions for the line to connect the parent node to the null node.
        const parentCenterX = parentRect.left + parentRect.width / 2 - containerRect.left;
        const parentBottomY = parentRect.bottom - containerRect.top;
        const nullNodeCenterX = nullNodeRect.left + nullNodeRect.width / 2 - containerRect.left;
        const nullNodeTopY = nullNodeRect.top - containerRect.top;

        line.style.left = `${parentCenterX}px`;
        line.style.top = `${parentBottomY}px`;
        line.style.height = `${nullNodeTopY - parentBottomY}px`;
        line.style.transform = `translateX(${isLeft ? -50 : 50}%)`;

        container.appendChild(line); // Append the line to the container.
    }
}
