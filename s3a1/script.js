// Maze dimensions will change based on difficulty.
let difficulty = "easy";
let cols = 10;
let rows = 10;
let cellSize;
let grid = [];
let canvas, ctx;
let playerPos = { row: 0, col: 0 };
let recordedMoves = [];
let isRecording = false;

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
function initCanvas() {
  canvas = document.getElementById("mazeCanvas");
  canvas.width = 400;
  canvas.height = 400;
  ctx = canvas.getContext("2d");
  cellSize = canvas.width / cols;
}

function drawMenuButtons() {
  document.getElementById("playButton").disabled = isRecording || recordedMoves.length === 0;
  document.getElementById("recordButton").disabled = isRecording;
  document.getElementById("stopButton").disabled = !isRecording;
}

function setIsRecording(recording) {
  isRecording = recording;
  drawMenuButtons();
}

function playRecording() {
  let i = 0;
  let lastTimestamp = 0;
  const moveDelay = 300; // milliseconds
  drawMaze();

  function playNextMove(timestamp) {
    if (i >= recordedMoves.length) {
      if (!checkWin()) {
        alert("Failed to reach the goal. Resetting game.");
        playerPos = { row: 0, col: 0 };
        recordedMoves = [];
        updateMovesOutput();
        drawMenuButtons();
        drawMaze();
      }
      return;
    }
    
    if (timestamp - lastTimestamp >= moveDelay) {
      const move = recordedMoves[i];
      const currentCell = grid[playerPos.row][playerPos.col];
      if (move === "U" && !currentCell.walls.top && playerPos.row > 0) {
        playerPos.row -= 1;
      } else if (move === "R" && !currentCell.walls.right && playerPos.col < cols - 1) {
        playerPos.col += 1;
      } else if (move === "D" && !currentCell.walls.bottom && playerPos.row < rows - 1) {
        playerPos.row += 1;
      } else if (move === "L" && !currentCell.walls.left && playerPos.col > 0) {
        playerPos.col -= 1;
      }
      drawMaze();
      i++;
      lastTimestamp = timestamp;
    }
    
    requestAnimationFrame(playNextMove);
  }
  
  requestAnimationFrame(playNextMove);
}

function recordMove(move) {
  if (!isRecording) return; 
  recordedMoves.push(move)
  updateMovesOutput();
}

// Update the "Script" output.
function updateMovesOutput() {
  const outputDiv = document.getElementById("movesOutput");
  outputDiv.textContent = "Script: " + recordedMoves.join(", ");
}

// Function to move to the next difficulty level
function nextLevel() {
  if (difficulty === "easy") {
    difficulty = "medium";
    alert("Level completed! Proceeding to medium difficulty.");
  } else if (difficulty === "medium") {
    difficulty = "hard";
    alert("Medium level completed! Proceeding to hard difficulty.");
  } else if (difficulty === "hard") {
    difficulty = "easy"; // Reset to easy after completing all levels
    alert("Congratulations! You've completed all difficulty levels!");
  }

  startGame();
}

// Check if the player reached the goal.
function checkWin() {
  if (playerPos.row === rows - 1 && playerPos.col === cols - 1) {
    nextLevel();
    return true;
  }
  return false;
}

// Start the game: reset state, generate maze, and draw.
function startGame() {
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
  recordedMoves = [];
  updateMovesOutput();
  cellSize = canvas.width / cols;
  generateMaze();
  drawMaze();
  
  // Update displayed difficulty level
  const titleElement = document.querySelector('h1');
  titleElement.textContent = `Maze Game - ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`;
}

// Set up event listeners for on-screen buttons.
document.getElementById("upButton").addEventListener("click", () => recordMove("U"));
document.getElementById("rightButton").addEventListener("click", () => recordMove("R"));
document.getElementById("downButton").addEventListener("click", () => recordMove("D"));
document.getElementById("leftButton").addEventListener("click", () => recordMove("L"));
document.getElementById("playButton").addEventListener("click", playRecording);
document.getElementById("recordButton").addEventListener("click", () => setIsRecording(true));
document.getElementById("stopButton").addEventListener("click", () => setIsRecording(false));

// Listen for keyboard arrow key events.
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      e.preventDefault(); // Prevent page scrolling
      recordMove("U");
      break;
    case "ArrowRight":
      e.preventDefault();
      recordMove("R");
      break;
    case "ArrowDown":
      e.preventDefault();
      recordMove("D");
      break;
    case "ArrowLeft":
      e.preventDefault();
      recordMove("L");
      break;
  }
});

function init() {
  initCanvas();
  drawMenuButtons();
  startGame();
}

// Initialize canvas on window load.
window.onload = init;