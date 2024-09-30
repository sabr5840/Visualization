# Red-Black Tree Visualization

## Introduction

Welcome to the Red-Black Tree Visualization project. This web application provides a visual representation of Red-Black Trees, a type of self-balancing binary search tree. Red-Black Trees are used in various computer algorithms and systems to ensure efficient data operations. This project leverages D3.js for dynamic visualization and JavaScript to manage the tree operations.

## Definition

A Red-Black Tree is a self-balancing binary search tree where each node has a color, either red or black. Balance is maintained through rotations and color changes after each insertion and deletion, ensuring that the tree remains balanced with a maximum height of 2 log(n+1), where 
n is the number of nodes. This ensures efficient search operations with a complexity of O(logn).

## Purpose

The main purpose of this project is to offer an interactive tool for understanding Red-Black Trees. It allows users to:
- Insert nodes into the tree
- Delete nodes from the tree
- Search for specific nodes within the tree

The visualization helps in understanding how these operations affect the tree structure and how the Red-Black Tree properties are maintained.

## Live Demo

You can view a live demo of the project [here](https://sabr5840.github.io/Red-Black-Tree-Visualization/).


## Project Structure

The project consists of three main components:

1. **HTML (`index.html`)**:
   - Defines the structure and content of the web application.
   - Contains a container for the tree visualization and a sidebar for explaining Red-Black Tree properties and rotations.
   - Includes input fields and buttons for interacting with the tree.

2. **CSS (`styles.css`)**:
   - Styles the web application, ensuring a clean and user-friendly interface.
   - Manages the layout of the tree visualization and informational sections.
   - Applies styles to buttons, input fields, and overall page alignment.

3. **JavaScript (`script.js`)**:
   - Implements the Red-Black Tree algorithm and its operations.
   - Uses D3.js to dynamically render the tree and update the visualization based on user interactions.
   - Handles the insertion, deletion, and searching of nodes.

### Key Classes and Functions

**`Node` Class**:
- Represents a node in the Red-Black Tree.
- Contains properties for value, color (`red` or `black`), and pointers to left, right, and parent nodes.

**`RedBlackTree` Class**:
- Manages the Red-Black Tree operations including insertion, deletion, and rotations.
- Ensures the Red-Black Tree properties are maintained after each operation.

**Operations**:
- **Insertion**:
  - Adds a new node to the tree while maintaining Red-Black Tree properties.
  - Involves fixing potential violations through rotations and color changes.

- **Deletion**:
  - Removes a node from the tree and adjusts the structure to preserve Red-Black Tree properties.
  - Includes handling special cases such as node replacement and fixing tree balance.

- **Search**:
  - Finds and highlights a node in the tree.
  - Provides feedback if the node is not found.

**Visualization**:
- The `renderTree()` function uses D3.js to draw the tree structure, including nodes and connections.
- Updates dynamically based on user actions such as insertions and deletions.

## Usage

Insert Node:
- Enter a value in the input field and click the "Insert Node" button to add a new node to the tree.

Delete Node:
- Enter a value in the input field and click the "Delete Node" button to remove the specified node from the tree.

Search Node:
- Enter a value in the input field and click the "Search Node" button to find and highlight the node if it exists.
