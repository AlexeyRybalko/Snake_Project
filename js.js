const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const currentScore = document.querySelector("#currentScore");
const bestScore = document.querySelector("#bestScore")
const resetBtn = document.querySelector("#resetBtn");
const startBtn = document.querySelector("#startBtn");
const boardBackground = "white";
const snakeColor = "lime";
const snakeBorder = "green";
const foodColor = "red";
const unitSize = 25;
let gameWidth = gameBoard.width;
let gameHeight = gameBoard.height;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let bestScoreData = 0;
let timeOut;
let gameAcceleration = 1;


window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);
window.addEventListener("click", gameStart);
// startBtn.addEventListener("click", gameStart);
inputSize();
drawLogo();
drawInfo();


function inputSize(){
    let setWidth = +prompt("Введи ширину поля: ", "от 400 до 1200");
    let setHeight = +prompt("Введи высоту поля: ", "от 300 до 700");
    
    while (setWidth < 400 || setWidth > 1200 || !Number.isFinite(setWidth)){
        alert("Неверные параметры ширины!");
        setWidth = +prompt("Введи ширину поля", "от 400 до 1200");
        };

    while (setHeight < 300 || setHeight > 700 || !Number.isFinite(setHeight)){
        alert("Неверные параметры высоты!");
        setHeight = +prompt("Введи высоту поля", "от 300 до 700");
    }

    gameWidth = setWidth;
    gameHeight = setHeight;
    gameBoard.width = setWidth;
    gameBoard.height = setHeight;

};

function drawLogo(){
    ctx.font = "80px MV Boli";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("SNAKE!", gameWidth / 2, gameHeight / 2);
};

function drawInfo(){
    ctx.font = "23px MV Boli";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("Click anywhere to start the game!", gameWidth / 2, gameHeight / 1.5);
};

function gameStart(){
    running = true;

    currentScore.textContent = "Score: " + score;
    bestScore.textContent = "Best Score: " + localStorage.getItem('ScoreData');

    if(!localStorage.getItem('ScoreData')){
        bestScore.textContent = "Best Score: " + 0;
    };

    bestScoreData = localStorage.getItem('ScoreData');

    resetBtn.style = "display: block";
    // startBtn.style = "display: none";
    window.removeEventListener("click", gameStart);

    createFood();
    drawFood();
    nextTick();
};

let snake = [
    {x: gameWidth / 2, y: gameHeight / 2},
    {x: gameWidth / 2 - unitSize, y: gameHeight / 2},
];

function nextTick(){
    if(running){
        timeOut = setTimeout(() =>{
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, (500 * gameAcceleration));
    }
    else {
        displayGameOver();
    }
};

function clearBoard (){
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
};

function createFood (){
    function randomFood(min, max){
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    };
    
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameHeight - unitSize);

    for(let i = 0; i < snake.length; i +=1){
        if(foodX == snake[i].x && foodY == snake[i].y){
            // console.log("same");
            createFood();
            drawFood();
        }
    }
};

function drawFood(){
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
};

function moveSnake(){
    const head = {x: snake[0].x + xVelocity,
                  y: snake[0].y + yVelocity};

    snake.unshift(head);

    if(snake[0].x == foodX && snake[0].y == foodY){
        score+=1;
        increaseSpeed();
        currentScore.textContent = "Score: " + score;
        createFood();
    }
    else{
        snake.pop();
    }
};

function drawSnake(){
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;

    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    })
};

function changeDirection(event){
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    const goingUp = (yVelocity == -unitSize);
    const goingDown = (yVelocity == unitSize);
    const goingRight = (xVelocity == unitSize);
    const goingLeft = (xVelocity == -unitSize);

    switch(true){
        case(keyPressed == LEFT && !goingRight):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case(keyPressed == RIGHT && !goingLeft):
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case(keyPressed == UP && !goingDown):
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        case(keyPressed == DOWN && !goingUp):
            xVelocity = 0;
            yVelocity = unitSize;
            break;    
    }
};

function checkGameOver(){
    switch(true){
        case (snake[0].x < 0 ):
            running = false;
            break;
        case (snake[0].x >= gameWidth):
            running = false;
            break;
        case (snake[0].y < 0 ):
            running = false;
            break;
        case (snake[0].y >= gameHeight):
            running = false;
            break;  
    };

    for(let i = 1; i < snake.length; i+=1){
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            running = false;
        };
    };
};

function displayGameOver(){
    ctx.font = "50px MV Boli";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
    
    if(bestScoreData < score){
        bestScoreData = score;
    };

    bestScore.textContent = "Best Score: " + bestScoreData;
    localStorage.setItem('ScoreData', bestScoreData);

    running = false;
};

function resetGame(){
    clearTimeout(timeOut);

    score = 0;

    bestScore.textContent = "Best Score: " + localStorage.getItem('ScoreData');

    gameAcceleration = 1;
    console.log("speed: ", (500 * gameAcceleration));

    xVelocity = unitSize;
    yVelocity = 0;

    snake = [
        {x: gameWidth / 2, y: gameHeight / 2},
        {x: gameWidth / 2 - unitSize, y: gameHeight / 2},
    ];
    
    gameStart();
};

function increaseSpeed(){
    if (score >= 1 && score % 3 == 0 && score <= 24){
        gameAcceleration -= 0.1;
        console.log("speed: ", (500 * gameAcceleration));
    };
};

