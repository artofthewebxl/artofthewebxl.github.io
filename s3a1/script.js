// Maze dimensions will change based on difficulty.
let cols = 10;
let rows = 10;
let cellSize;
let grid = [];
let canvas, ctx;
let playerPos = { row: 0, col: 0 };
let moves = [];

// Cell constructor with wall information.
function Cell(row, col) {
  this.row = row;
  this.col = col;
  this.walls = { top: true, right: true, bottom: true, left: true };
  this.visited = false;
}

// Initialize the grid.
function initGrid() {
  grid = [];
  for (let r = 0; r < rows; r++) {
    let rowArray = [];
    for (let c = 0; c < cols; c++) {
      rowArray.push(new Cell(r, c));
    }
    grid.push(rowArray);
  }
}

// Maze generation using recursive backtracking.
function generateMaze() {
  let stack = [];
  let current = grid[0][0];
  current.visited = true;
  while (true) {
    let next = getUnvisitedNeighbor(current);
    if (next) {
      next.visited = true;
      stack.push(current);
      removeWalls(current, next);
      current = next;
    } else if (stack.length > 0) {
      current = stack.pop();
    } else {
      break;
    }
  }
}

// Get a random unvisited neighbor.
function getUnvisitedNeighbor(cell) {
  let neighbors = [];
  let { row, col } = cell;
  if (row > 0 && !grid[row - 1][col].visited) {
    neighbors.push(grid[row - 1][col]);
  }
  if (col < cols - 1 && !grid[row][col + 1].visited) {
    neighbors.push(grid[row][col + 1]);
  }
  if (row < rows - 1 && !grid[row + 1][col].visited) {
    neighbors.push(grid[row + 1][col]);
  }
  if (col > 0 && !grid[row][col - 1].visited) {
    neighbors.push(grid[row][col - 1]);
  }
  if (neighbors.length > 0) {
    let randomIndex = Math.floor(Math.random() * neighbors.length);
    return neighbors[randomIndex];
  }
  return undefined;
}

// Remove walls between two adjacent cells.
function removeWalls(a, b) {
  let x = a.col - b.col;
  if (x === 1) {
    a.walls.left = false;
    b.walls.right = false;
  } else if (x === -1) {
    a.walls.right = false;
    b.walls.left = false;
  }
  let y = a.row - b.row;
  if (y === 1) {
    a.walls.top = false;
    b.walls.bottom = false;
  } else if (y === -1) {
    a.walls.bottom = false;
    b.walls.top = false;
  }
}

// Draw the maze, goal, and player.
function drawMaze() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let cell = grid[r][c];
      let x = c * cellSize;
      let y = r * cellSize;
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;
      if (cell.walls.top) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + cellSize, y);
        ctx.stroke();
      }
      if (cell.walls.right) {
        ctx.beginPath();
        ctx.moveTo(x + cellSize, y);
        ctx.lineTo(x + cellSize, y + cellSize);
        ctx.stroke();
      }
      if (cell.walls.bottom) {
        ctx.beginPath();
        ctx.moveTo(x + cellSize, y + cellSize);
        ctx.lineTo(x, y + cellSize);
        ctx.stroke();
      }
      if (cell.walls.left) {
        ctx.beginPath();
        ctx.moveTo(x, y + cellSize);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  }
  // Draw the goal cell (bottom right) as a green square.
  let goalX = (cols - 1) * cellSize;
  let goalY = (rows - 1) * cellSize;
  ctx.fillStyle = "green";
  ctx.fillRect(goalX + cellSize * 0.25, goalY + cellSize * 0.25, cellSize * 0.5, cellSize * 0.5);
  // Draw the player as a blue circle.
  let playerX = playerPos.col * cellSize + cellSize / 2;
  let playerY = playerPos.row * cellSize + cellSize / 2;
  ctx.fillStyle = "blue";
  ctx.beginPath();
  ctx.arc(playerX, playerY, cellSize / 4, 0, 2 * Math.PI);
  ctx.fill();
}

// Initialize the canvas.
function init() {
  canvas = document.getElementById("mazeCanvas");
  canvas.width = 400;
  canvas.height = 400;
  ctx = canvas.getContext("2d");
  cellSize = canvas.width / cols;
}

// Update the "Script" output.
function updateMovesOutput() {
  const outputDiv = document.getElementById("movesOutput");
  outputDiv.textContent = "Script: " + moves.join(", ");
}

// Move the player if no wall blocks the way.
function movePlayer(direction) {
  const currentCell = grid[playerPos.row][playerPos.col];
  if (direction === "up" && !currentCell.walls.top && playerPos.row > 0) {
    playerPos.row -= 1;
    moves.push("U");
  } else if (direction === "right" && !currentCell.walls.right && playerPos.col < cols - 1) {
    playerPos.col += 1;
    moves.push("R");
  } else if (direction === "down" && !currentCell.walls.bottom && playerPos.row < rows - 1) {
    playerPos.row += 1;
    moves.push("D");
  } else if (direction === "left" && !currentCell.walls.left && playerPos.col > 0) {
    playerPos.col -= 1;
    moves.push("L");
  } else {
    return;
  }
  updateMovesOutput();
  drawMaze();
  checkWin();
}

// Check if the player reached the goal.
function checkWin() {
  if (playerPos.row === rows - 1 && playerPos.col === cols - 1) {
    setTimeout(() => {
      alert("You won! Script: " + moves.join(", "));
    }, 100);
  }
}

// Start the game: set difficulty (and pastel background), reset state, generate maze, and draw.
function startGame() {
  const difficulty = document.getElementById("difficultySelect").value;
  if (difficulty === "easy") {
    cols = 10;
    rows = 10;
    document.body.style.backgroundColor = "#B3E5FC";  // pastel blue
  } else if (difficulty === "medium") {
    cols = 15;
    rows = 15;
    document.body.style.backgroundColor = "#D1C4E9";  // pastel purple
  } else if (difficulty === "hard") {
    cols = 20;
    rows = 20;
    document.body.style.backgroundColor = "#FFCDD2";  // pastel red
  }
  initGrid();
  playerPos = { row: 0, col: 0 };
  moves = [];
  updateMovesOutput();
  cellSize = canvas.width / cols;
  generateMaze();
  drawMaze();
}

// Set up event listeners for on-screen buttons.
document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("upButton").addEventListener("click", () => movePlayer("up"));
document.getElementById("rightButton").addEventListener("click", () => movePlayer("right"));
document.getElementById("downButton").addEventListener("click", () => movePlayer("down"));
document.getElementById("leftButton").addEventListener("click", () => movePlayer("left"));

// Listen for keyboard arrow key events.
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      movePlayer("up");
      break;
    case "ArrowRight":
      movePlayer("right");
      break;
    case "ArrowDown":
      movePlayer("down");
      break;
    case "ArrowLeft":
      movePlayer("left");
      break;
  }
});

// Initialize canvas on window load.
window.onload = init;
