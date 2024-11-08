//  Define HTML elements
const board = document.getElementById('game-board')
const instructionText = document.getElementById('instruction-text')
const logo = document.getElementById('logo')
const score = document.getElementById('score')
const highScoreText = document.getElementById('highScore')

//  Define game variables
const GRID_SIZE = 20
let snake = [{x: 10, y: 10}]
let food = generateFood()
let highScore = 0
let direction = 'right'
let gameInterval
let gameSpeedDelay = 200
let gameStarted = false


//  Will draw game map, snake and food
function draw () {
    board.innerHTML = ''
    drawSnake()
    drawFood()
    updateScore()
}

//  Draw snake
function drawSnake () {
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', 'snake')
        setPosition(snakeElement, segment)
        board.appendChild(snakeElement)
    })
}

//  Creating snake or food cube
function createGameElement (tag, className) {
    const element = document.createElement(tag)
    element.className = className
    return element;
}

//  Set the position of the snake or the food
function setPosition (element, position) {
    element.style.gridColumn = position.x
    element.style.gridRow = position.y
}

//  Draw food function
function drawFood () {
    if (gameStarted) {
        const foodElement = createGameElement('div', 'food')
        setPosition(foodElement, food)
        board.appendChild(foodElement)
    }
}

//  To generate random position for food
function generateFood () {
    const x = Math.floor(Math.random() * GRID_SIZE) + 1
    const y = Math.floor(Math.random() * GRID_SIZE) + 1
    return { x, y }
}

//  Moving the snake
function move () {
    const head = {...snake[0]}
    switch (direction) {
        case 'up':
            head.y--
            break;
        case 'down':
            head.y++
            break;
        case 'right':
            head.x++
            break;
        case 'left':
            head.x--
            break;
    
        default:
            break;
    }

    snake.unshift(head)
    
    if (head.x === food.x && head.y === food.y) {
        food = generateFood()
        increaseSpeed()
        //  Clear past interval
        clearInterval(gameInterval)
        gameInterval = setInterval(() => {
            move()
            checkCollision()
            draw()
        }, gameSpeedDelay)
    } else {
        snake.pop()
    }
}

function increaseSpeed () {
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5
    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3
    } else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2
    } else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1
    }
}

//  Test draw function
// draw()
// setInterval(() => {
//     move()
//     draw()
// }, 200)

//  check collision with wall or body and reset
function checkCollision () {
    const head = snake[0]

    if (head.x < 1 || head.x > GRID_SIZE || head.y < 1 || head.y > GRID_SIZE) {
        resetGame()
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame()
        }
    }
}

function updateScore () {
    const currentScore = snake.length - 1
    score.textContent = currentScore.toString().padStart(3, '0')
}

function updateHighScore () {
    const currentScore = snake.length - 1
    if (currentScore > highScore) {
        highScore = currentScore
        highScoreText.textContent = highScore.toString().padStart(3, '0')
    }
    highScoreText.style.display = 'block'
}

function stopGame () {
    clearInterval(gameInterval)
    gameStarted = false
    instructionText.style.display = 'block'
    logo.style.display = 'block'
}

function resetGame () {
    updateHighScore()
    stopGame()
    snake = [{x: 10, y: 10}]
    food = generateFood()
    direction = 'right'
    gameSpeedDelay = 200
    updateScore()
}

//  Start game function
function startGame () {
    //  Keep track of running game
    gameStarted = true
    instructionText.style.display = 'none'
    logo.style.display = 'none'
    gameInterval = setInterval(() => {
        move()
        checkCollision()
        draw()
    }, gameSpeedDelay)
}

//  Key press event listener
function handleKeyPress (event) {
    if ((!gameStarted && event.code === 'Space') || (!gameStarted && event.key === ' ') || (!gameStarted && event.keyCode === 32)) {
        startGame()
    } else {
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up'
                break;
            case 'ArrowDown':
                direction = 'down'
                break;
            case 'ArrowLeft':
                direction = 'left'
                break;
            case 'ArrowRight':
                direction = 'right'
                break;
        }
    }
}

//  Added event listener on key press
document.addEventListener('keydown', handleKeyPress)