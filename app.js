const board = document.querySelector('#gameBoard');
const scoreText = document.querySelector('#score');
const bestScoreText = document.querySelector('#bestScore');
const resetBtn = document.querySelector('#resetBtn');
// modes
const easy = document.querySelector('#easy');
const medium = document.querySelector('#medium');
const hard = document.querySelector('#hard');
// board
const ctx = board.getContext('2d');
const width = board.width;
const height = board.height;

const unitSize = 20;
let vel = 100;
let running = true;
let started = false;
let score = 0;
let best = 0;
let timeout;


// snake
let snake = [
    {x:0, y:0}
];

// apple position
let appleX;
let appleY;

// velocity
let xVel = 0;
let yVel = 0;

// colors
const boardColor = 'white';
const snakeColor = 'green';
const appleColor = 'red';

// event listeners
window.addEventListener('keydown', changeDirecton);
resetBtn.addEventListener('click', resetGame);

easy.addEventListener('click', setEasyMode);
medium.addEventListener('click', setMediumMode);
hard.addEventListener('click', setHardMode);

function setEasyMode(){
    if(!started){
        vel = 100;
        easy.classList.add('active');
        medium.classList.remove('active');
        hard.classList.remove('active');
    }
}

function setMediumMode(){
    if(!started){
        vel = 60;
        medium.classList.add('active');
        easy.classList.remove('active');
        hard.classList.remove('active');
    }
}

function setHardMode(){
    if(!started){
        vel = 40;
        hard.classList.add('active');
        medium.classList.remove('active');
        easy.classList.remove('active');
    }
}

function startGame(){
    if(running){
        if(xVel!=0 || yVel!=0){
            started=true;
        }else{
            started=false;
        }
        clearBoard();
        drawSnake();
        drawApple();
        moveSnake();
        checkGameOver();
        timeout = setTimeout(startGame, vel);
    }else{
        displayGameOver();
    }
    
}

function clearBoard(){
    ctx.fillStyle = boardColor;
    ctx.fillRect(0,0,width,height);
}

function drawSnake(){
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = 'black';
    snake.forEach((part) => {
       ctx.fillRect(part.x, part.y, unitSize, unitSize); 
       ctx.strokeRect(part.x, part.y, unitSize, unitSize); 
    })
}

function makeApple(){
    do{
        appleX = Math.floor(Math.random()*unitSize) * unitSize;
        appleY = Math.floor(Math.random()*unitSize) * unitSize;
    }while(appleX == snake[0].x && appleY == snake[0].y);
}

function drawApple(){
    ctx.fillStyle = appleColor;
    ctx.strokeStyle = 'black';
    ctx.fillRect(appleX, appleY, unitSize, unitSize);
    ctx.strokeRect(appleX, appleY, unitSize, unitSize);
}

function moveSnake(){
    const newHead = {
        x:snake[0].x + xVel,
        y:snake[0].y + yVel
    };
    snake.unshift(newHead);
    // if food is eaten
    if(appleX == snake[0].x && appleY == snake[0].y){
        score += 1;
        scoreText.textContent = score;
        // making new apple
        makeApple();
    }else{
        snake.pop();
    }
}

function changeDirecton(event){
    const keyPressed = event.keyCode;

    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    const goingLeft = (xVel == -unitSize);
    const goingUp = (yVel == -unitSize);
    const goingRight = (xVel == unitSize);
    const goingDown = (yVel == unitSize);

    switch(true){
        case(keyPressed == LEFT && !goingRight):
            xVel = -unitSize;
            yVel = 0;
            break;
        case(keyPressed == UP && !goingDown):
            xVel = 0;
            yVel = -unitSize;
            break;
        case(keyPressed == RIGHT && !goingLeft):
            xVel = unitSize;
            yVel = 0;
            break;
        case(keyPressed == DOWN && !goingUp):
            xVel = 0;
            yVel = unitSize;
            break;
    }
}

function checkGameOver(){
    switch(true){
        case (snake[0].x < 0):
            running = false;
            break;
        case (snake[0].x >= width):
            running = false;
            break;
        case (snake[0].y < 0):
            running = false;
            break;
        case (snake[0].y >= height):
            running = false;
            break;
    }

    for(let i=1; i<snake.length; i++){
        if(snake[0].x == snake[i].x && snake[0].y == snake[i].y){
            running = false;
            break;
        }
    }

    if(running == false){
        started = false;
    }
}

function displayGameOver(){
    ctx.font = 'bold 50px "Press Start 2P"';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', width/2, height/2);
}

function resetGame(){
    if(score > best){
        best = score;
    }
    score = 0;
    scoreText.textContent = score;
    bestScoreText.textContent = best;
    snake = [ {x:0, y:0} ];
    xVel = 0;
    yVel = 0;
    running = true;
    clearTimeout(timeout);
    makeApple();
    startGame();
}

makeApple();
startGame();