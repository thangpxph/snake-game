import "./style.css";

// =====================
// DOM
// =====================
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const gameArea = document.getElementById("gameArea");
const gameOver = document.getElementById("gameOver");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const scoreText = document.querySelector("#score span");
const bestScoreText = document.getElementById("bestScore");

const finalScore = document.getElementById("finalScore");
const finalBest = document.getElementById("finalBest");

// =====================
// GAME CONFIG
// =====================
const grid = 20;
const tile = canvas.width / grid;

let snake;
let food;

let dx;
let dy;

let score;
let gameRunning = false;

// High Score
let highScore = Number(localStorage.getItem("highScore")) || 0;
bestScoreText.textContent = highScore;

// =====================
// RANDOM FOOD
// =====================
function randomFood() {

    while (true) {

        const newFood = {

            x: Math.floor(Math.random() * grid),
            y: Math.floor(Math.random() * grid)

        };

        const onSnake = snake.some(s =>

            s.x === newFood.x &&
            s.y === newFood.y

        );

        if (!onSnake) {

            return newFood;

        }

    }

}

// =====================
// RESET GAME
// =====================
function resetGame() {

    snake = [

        {
            x: 10,
            y: 10
        }

    ];

    dx = 1;
    dy = 0;

    score = 0;

    scoreText.textContent = score;

    food = randomFood();

}

// =====================
// START GAME
// =====================
function startGame() {

    resetGame();

    menu.style.display = "none";
    gameOver.style.display = "none";
    gameArea.style.display = "block";

    gameRunning = true;

}

// =====================
// END GAME
// =====================
function endGame() {

    gameRunning = false;

    if (score > highScore) {

        highScore = score;

        localStorage.setItem(

            "highScore",
            highScore

        );

    }

    bestScoreText.textContent = highScore;

    finalScore.textContent = score;
    finalBest.textContent = highScore;

    gameArea.style.display = "none";
    gameOver.style.display = "block";

}

// =====================
// KEYBOARD
// =====================
document.addEventListener("keydown", (e) => {

    if (!gameRunning) return;

    switch (e.key) {

        case "ArrowUp":

            if (dy === 1) return;

            dx = 0;
            dy = -1;

            break;

        case "ArrowDown":

            if (dy === -1) return;

            dx = 0;
            dy = 1;

            break;

        case "ArrowLeft":

            if (dx === 1) return;

            dx = -1;
            dy = 0;

            break;

        case "ArrowRight":

            if (dx === -1) return;

            dx = 1;
            dy = 0;

            break;

    }

});

// =====================
// UPDATE
// =====================
function update() {

    if (!gameRunning) return;

    const head = {

        x: snake[0].x + dx,
        y: snake[0].y + dy

    };

    // Wall
    if (

        head.x < 0 ||
        head.x >= grid ||
        head.y < 0 ||
        head.y >= grid

    ) {

        endGame();
        return;

    }

    // Self collision
    for (let s of snake) {

        if (

            head.x === s.x &&
            head.y === s.y

        ) {

            endGame();
            return;

        }

    }

    snake.unshift(head);

    // Eat food
    if (

        head.x === food.x &&
        head.y === food.y

    ) {

        score++;

        scoreText.textContent = score;

        food = randomFood();

    } else {

        snake.pop();

    }

}

// =====================
// DRAW
// =====================
function draw() {

    ctx.clearRect(

        0,
        0,
        canvas.width,
        canvas.height

    );

    ctx.fillStyle = "#d7d7d7";

    ctx.fillRect(

        0,
        0,
        canvas.width,
        canvas.height

    );

    // Food
    ctx.fillStyle = "red";

    ctx.fillRect(

        food.x * tile,
        food.y * tile,
        tile,
        tile

    );

    // Snake
    snake.forEach((part, index) => {

        ctx.fillStyle =

            index === 0
                ? "#00ff00"
                : "#00aa00";

        ctx.fillRect(

            part.x * tile,
            part.y * tile,
            tile - 2,
            tile - 2

        );

    });

}

// =====================
// GAME LOOP
// =====================
function gameLoop() {

    if (!gameRunning) return;

    update();

    draw();

}

setInterval(gameLoop, 120);

// =====================
// BUTTON
// =====================
startBtn.addEventListener("click", startGame);

restartBtn.addEventListener("click", startGame);