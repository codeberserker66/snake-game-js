const GRID_WIDTH = 30;
const GRID_HEIGHT = 25;
const CELL_SIZE = 24;
const SNAKE_SPEED = 10;
const INTERVAL = 1000 / SNAKE_SPEED;

const DIRECTIONS = {
  UP: { dx: 0, dy: -1 },
  DOWN: { dx: 0, dy: 1 },
  LEFT: { dx: -1, dy: 0 },
  RIGHT: { dx: 1, dy: 0 },
};

const SNAKE_COLOR = "lime";
const APPLE_COLOR = "red";
const GRID_COLOR = "black";

let apple = generateApple();
let snake = [{ row: 0, col: 1 }];
let currentSnakeDirection = DIRECTIONS.RIGHT;
let directionQueue = [];
let lastTimestamp = 0;
let gameOver = false;

const canvas = document.getElementById("board");
const context = canvas.getContext("2d");

canvas.width = GRID_WIDTH * CELL_SIZE;
canvas.height = GRID_HEIGHT * CELL_SIZE;

function drawApple() {
  context.fillStyle = APPLE_COLOR;
  context.fillRect(
    apple.col * CELL_SIZE,
    apple.row * CELL_SIZE,
    CELL_SIZE,
    CELL_SIZE
  );
}

function drawSnake() {
  context.fillStyle = SNAKE_COLOR;
  snake.forEach(({ row, col }) => {
    context.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  });
}

function clearCanvas() {
  context.fillStyle = GRID_COLOR;
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function draw() {
  if (gameOver) return;

  clearCanvas();
  drawApple();
  drawSnake();
}

function generateApple() {
  return {
    row: randomInt(0, GRID_HEIGHT - 1),
    col: randomInt(0, GRID_WIDTH - 1),
  };
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function update() {
  if (gameOver) {
    handleGameOver();
    return;
  }

  moveSnake();
  changeSnakeDirection();
  checkCollisionWithBorder();
  checkCollisionWithSelf();
  checkCollisionWithApple();
}

function handleGameOver() {
  alert("GameOver...");
  location.reload();
}

function moveSnake() {
  const snakeHead = {
    row: snake[0].row + currentSnakeDirection.dy,
    col: snake[0].col + currentSnakeDirection.dx,
  };

  snake.unshift(snakeHead);
  snake.pop();
}

function changeSnakeDirection() {
  while (directionQueue.length > 0) {
    const nextDirection = directionQueue.shift();

    if (canChangeDirection(nextDirection)) {
      currentSnakeDirection = nextDirection;
      break;
    }
  }
}

function canChangeDirection(nextDirection) {
  return (
    (nextDirection.dx !== -currentSnakeDirection.dx ||
      nextDirection.dx === 0) &&
    (nextDirection.dy !== -currentSnakeDirection.dy || nextDirection.dy === 0)
  );
}

function checkCollisionWithApple() {
  if (snake[0].row === apple.row && snake[0].col === apple.col) {
    snake.push({ row: apple.row, col: apple.col });
    apple = generateApple();
  }
}

function checkCollisionWithBorder() {
  if (
    snake[0].row < 0 ||
    snake[0].row >= GRID_HEIGHT ||
    snake[0].col < 0 ||
    snake[0].col >= GRID_WIDTH
  ) {
    gameOver = true;
  }
}

function checkCollisionWithSelf() {
  for (let i = 1; i < snake.length; i++) {
    if (snake[0].row === snake[i].row && snake[0].col === snake[i].col) {
      gameOver = true;
    }
  }
}

const handleKeydown = (e) => {
  if (e.code.startsWith("Arrow")) {
    const direction = getDirectionFromKeyCode(e.code);
    if (direction) {
      directionQueue.push(direction);
    }
  }
};

function getDirectionFromKeyCode(keyCode) {
  switch (keyCode) {
    case "ArrowUp":
      return DIRECTIONS.UP;
    case "ArrowDown":
      return DIRECTIONS.DOWN;
    case "ArrowLeft":
      return DIRECTIONS.LEFT;
    case "ArrowRight":
      return DIRECTIONS.RIGHT;
    default:
      return null;
  }
}

function gameLoop(timestamp) {
  const deltaTime = timestamp - lastTimestamp;

  if (deltaTime > INTERVAL) {
    lastTimestamp = timestamp - (deltaTime % INTERVAL);
    update();
    draw();
  }

  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", handleKeydown);

requestAnimationFrame(gameLoop);
