

var canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("myCanvas"))


//fetch highscore if theres data in localstorage --> else set to zero
var currentScore = 0;
var highScore = (localStorage.getItem("highScore") == null || localStorage.getItem("highScore") == undefined) ? 0 : localStorage.getItem("highScore")
//

const counterBox = document.querySelector(".countericon");
const highScoreicon = document.querySelector(".highScoreicon");
//game over / menu
const box = document.querySelector(".box");
const msg = document.querySelector(".text");
const retry = document.querySelector(".retry");
//snake board
const board = document.getElementById("myCanvas");
const board_ctx = board.getContext("2d");
const start_btn = document.querySelector(".start");
//draw checker borad
function colorBoard() {
    board_ctx.fillStyle = '#ECFFE4';

    board_ctx.strokestyle = 'rgb(0, 0, 0)';
    console.log(board_ctx.strokestyle = 'rgb(0, 0, 255)')
    for (x = 0; x < 400; x += 20) {
        for (y = 0; y < 400; y += 20) {
            board_ctx.fillRect(x, y, 20, 20);
            board_ctx.strokeRect(x, y, 20, 20);
        }
    }
}


var keyname;
var ignore = false;
//

//
var gameInterval;
//movement
var varx = 20;
var vary = 0;

//food Coords
var foodXCoords;
var foodYCoords;

//get keyboard input
document.addEventListener('keydown', (e) => {
    keyname = e.code;
    console.log(keyname)
})



//snake list
var snake = [
    { x: 200, y: 200 },
    { x: 180, y: 200 },
    { x: 160, y: 200 },
    { x: 140, y: 200 },
    { x: 120, y: 200 }
];

//draw each snake cube in the canvas
function drawSnakeElement(snake) {
    board_ctx.fillStyle = 'lightgreen';
    board_ctx.strokestyle = 'darkgreen';
    board_ctx.fillRect(snake.x, snake.y, 20, 20);
    board_ctx.strokeRect(snake.x, snake.y, 20, 20);
}

//draw full snake
function drawSnake() {
    snake.forEach(drawSnakeElement);
}

function gameover(snake) {
    var bool = false
    for (i = 1; i < snake.length; i++) {
        if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
            bool = true;
            break;
        }
        if (snake[0].x > board.width - 10 || snake[0].x < 0 || snake[0].y > board.height - 20 || snake[0].y < 0) {
            bool = true;
            break;
        }
    }
    return bool;
}

function coordGeneration(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 20) * 20;
}

function resetSnake() {
    varx = 20;
    vary = 0;
    snake = [
        { x: 200, y: 200 },
        { x: 180, y: 200 },
        { x: 160, y: 200 },
        { x: 140, y: 200 },
        { x: 120, y: 200 }
    ];
}

//random gen of food coords
function randomFood() {
    foodXCoords = coordGeneration(0, board.width - 10);
    foodYCoords = coordGeneration(0, board.height - 10);
    //foodXCoords = Math.round((Math.random() * (board.width - 10)) / 10) * 10;
    //foodYCoords = Math.round((Math.random() * (board.height - 10)) / 10) * 10;

    for (i = 0; i < snake.length; i++) {
        if (snake[i].x == foodXCoords && snake[i].y == foodYCoords) {
            //if snake in same pos as the random food coords.. generate another
            randomFood()
        }
    }
    console.log(foodXCoords, foodYCoords)
}

function drawFood() {

    board_ctx.fillStyle = 'red';
    board_ctx.strokestyle = 'darkgreen';
    board_ctx.fillRect(foodXCoords, foodYCoords, 20, 20);
    board_ctx.strokeRect(foodXCoords, foodYCoords, 20, 20);
}



//change dir
function changeDirection() {
    
    const UP = "ArrowUp";
    const DOWN = "ArrowDown";
    const RIGHT = "ArrowRight";
    const LEFT = "ArrowLeft";


    //WASD keys
    const keyW = "KeyW";
    const keyA = "KeyA";
    const keyS = "KeyS";
    const keyD = "KeyD";


    //prevDir
    var dirUp = (vary === -20);
    var dirDown = (vary === 20);
    var dirRight = (varx === 20);
    var dirLeft = (varx === -20);

    if ((keyname == UP || keyname == keyW) && !dirDown) {
        varx = 0;
        vary = -20;
    }
    if ((keyname == DOWN || keyname == keyS) && !dirUp) {
        varx = 0;
        vary = 20;
    }
    if ((keyname == RIGHT || keyname == keyD) && !dirLeft) {
        varx = 20;
        vary = 0;
    }
    if ((keyname == LEFT || keyname == keyA) && !dirRight) {
        varx = -20;
        vary = 0;
    }
}

//move function
function moveSnake() {
    var temp = {
        x: snake[0].x + varx,
        y: snake[0].y + vary
    };
    //put it first
    snake.unshift(temp);
    var onEaten = (snake[0].x == foodXCoords && snake[0].y == foodYCoords);
    console.log(onEaten);
    if (onEaten === true) {
        currentScore++;
        randomFood();
    }

    else {
        //remove last
        snake.pop();
    }

    //change dir is called in the game before each moveSnake() method

    //1- create a temp var with the
    //2- we put it first in the list
    //3- we check if the snake has consumed food -> continue without removing an element 
    //4- if not we pop the last to continue the movement with current length
}

function beginGame() {

    var gameInterval = setInterval(() => {
        if (gameover(snake)) {
            clearInterval(gameInterval);
        }

        game();
    }, 100)
    return gameInterval;
}




function game() {
    //board_ctx.clearRect(0, 0, 400, 400);
    colorBoard()

    if (gameover(snake)) {
        if (currentScore > localStorage.getItem("highScore")) {
            localStorage.setItem("highScore", currentScore);
            highScore = currentScore;
            highScoreicon.textContent = highScore + ":";
        }
        currentScore = 0;
        drawFood();
        drawSnake();
        msg.textContent = "GAME OVER!";
        box.style.display = "";
        retry.style.display = "";
        return;
    }
    highScoreicon.textContent = highScore + ":";

    counterBox.textContent = currentScore.toString();
    drawFood();
    changeDirection();
    moveSnake();
    drawSnake();

}



//onclick
function retryGame() {
    msg.textContent = "";
    box.style.display = "none";
    retry.style.display = "none";

    resetSnake();
    randomFood();
    beginGame();
}
highScoreicon.textContent = highScore + ":";

function start() {
    msg.textContent = "";
    start_btn.style.display = "none";
    randomFood();
    beginGame();
}

function clearScore() {
    localStorage.setItem("highScore", 0);
    highScore = 0
    highScoreicon.textContent = highScore + ":";
}


console.log(snake);
