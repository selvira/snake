//CONSTANTS
const CANVAS_BORDER_COLOUR = "black";
const CANVAS_BACKGROUND_COLOUR = "black";
const SNAKE_COLOUR = "lightgreen";
const SNAKE_BORDER_COLOUR = "darkgreen";
const FOOD_COLOUR = "red";
const FOOD_BORDER_COLOUR = "darkred";

var score = 0; //INITIAL SCORE

//get the canvas element
var gameCanvas = document.getElementById("gameCanvas");

//return a 2 dimensional drawing context
var ctx = gameCanvas.getContext("2d");

function clearCanvas() {
	ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
	ctx.strokestyle = CANVAS_BORDER_COLOUR;

	ctx.fillRect(0,0,gameCanvas.width,gameCanvas.height);
	ctx.strokeRect(0,0,gameCanvas.width,gameCanvas.height);
}

//snake represented by array of coordinates
let snake = [
	{x:150, y:150},
	{x:140, y:150},
	{x:130, y:150},
	{x:120, y:150},
	{x:110, y:150},
];

//display snake, function draw rectangle for each pair of coordinates
function drawSnakePart(snakePart) {
	ctx.fillStyle = SNAKE_COLOUR;
	ctx.strokestyle = SNAKE_BORDER_COLOUR;

	ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
	ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function drawSnake() {
	snake.forEach(drawSnakePart);
} //forEach() method executes a provided function once for each array element.

var changingDirection;
function changeDirection(event) {
	const LEFT_KEY = 37;
	const RIGHT_KEY = 39;
	const UP_KEY = 38;
	const DOWN_KEY = 40;

	if (changingDirection) return;

	changingDirection = true;

	const keyPressed = event.keyCode;
	const goingUp = dy === -10;
	const goingDown = dy === 10;
	const goingRight = dx === 10;
	const goingLeft = dx === -10;

	if (keyPressed === LEFT_KEY && !goingRight) {
		dx = -10;
		dy = 0;
	}

	if (keyPressed === RIGHT_KEY && !goingLeft) {
		dx = 10;
		dy = 0;
	}

	if (keyPressed === DOWN_KEY && !goingUp) {
		dx = 0;
		dy = 10;
	}

	if (keyPressed === UP_KEY && !goingDown) {
		dx = 0;
		dy = -10;
	}
}

//MOVE snake
let dx = 10; //horizontal velocity
let dy = 0; //vertical velocity

function advanceSnake() {
	const head = {x:snake[0].x + dx, y:snake[0].y + dy};
	snake.unshift(head); //adds items to beginning of array
	
	const didEatFood = snake[0].x === foodX
					   && snake[0].y === foodY;
    if (didEatFood) {
    	score += 10;
    	document.getElementById("score").innerHTML = score;

    	createFood();
    } else {
    	snake.pop(); //remove last element of array
    }
}

//generate food
function randomTen(min, max) {
	return Math.round((Math.random() * (max - min) + min) /10) * 10;
}

function createFood() {
	foodX = randomTen(0,gameCanvas.width - 10); //x-coordinate
	foodY = randomTen(0,gameCanvas.height - 10); //y-coordinate

	snake.forEach(function isFoodOnSnake(part) {
		const foodIsOnSnake = part.x == foodX
							&& part.y == foodY
		if (foodIsOnSnake) {
			createFood();
		}
	});
}

function drawFood() {
	ctx.fillStyle = FOOD_COLOUR;
	ctx.strokestyle = FOOD_BORDER_COLOUR;
	ctx.fillRect(foodX, foodY, 10, 10);
	ctx.strokeRect(foodX, foodY, 10, 10);
}

//check IF game END
function didGameEnd() {
	for (let i = 4; i < snake.length; i++) {
		const didCollide = snake[i].x === snake[0].x
						  && snake[i].y === snake[0].y;
	 if (didCollide) {
	 	return true;
	 }
	}
	const hitLeftWall = snake[0].x < 0;
	const hitRightWall = snake[0].x > gameCanvas.width - 10;
	const hitTopWall = snake[0].y < 0;
	const hitBottomWall = snake[0].y > gameCanvas.height - 10;

	return hitLeftWall ||
		   hitRightWall ||
		   hitTopWall ||
		   hitBottomWall;
}

//function to run the game
function main() {
	if (didGameEnd()) return;
	setTimeout(function onTick() {
		changingDirection = false;
		clearCanvas();
		drawFood();
		advanceSnake();
		drawSnake();
		//call main function again
		main();
	}, 100)
}

//RUN THE GAME
createFood();
document.addEventListener("keydown", changeDirection)
main();