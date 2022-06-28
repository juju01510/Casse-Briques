const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let ballRadius = 5;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 5;
let dy = -5;
let paddleHeight = 5;
let paddleWidth = 80;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
let colorBall = "blue";

let brickRowCount = 2;
let brickColumnCount = 9;
let brickWidth = 47;
let brickHeight = 10;
let brickPadding = 5;
let brickOffsetTop = 30;
let brickOffsetLeft = 10;

let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;

let bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
	bricks[c] = [];
	for (var r = 0; r < brickRowCount; r++) {
		bricks[c][r] = { x: 0, y: 0, status: 1 };
	}
}
let score = 0;
let lives = 3;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
	var relativeX = e.clientX - canvas.offsetLeft;
	if (relativeX > 0 && relativeX < canvas.width) {
		paddleX = relativeX - paddleWidth / 2;
	}
}

function randomInteger(max) {
	return Math.floor(Math.random() * (max + 1));
}

function randomColor() {
	let r = randomInteger(255);
	let g = randomInteger(255);
	let b = randomInteger(255);

	return [r, g, b];
}

function keyDownHandler(e) {
	if (e.keyCode == 39) {
		rightPressed = true;
	} else if (e.keyCode == 37) {
		leftPressed = true;
	}
}

function keyUpHandler(e) {
	if (e.keyCode == 39) {
		rightPressed = false;
	} else if (e.keyCode == 37) {
		leftPressed = false;
	}
}

function collisionDetection() {
	for (var c = 0; c < brickColumnCount; c++) {
		for (var r = 0; r < brickRowCount; r++) {
			var b = bricks[c][r];
			if (b.status == 1) {
				if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
					dy = -dy;
					b.status = 0;
					colorBall = `rgb(${randomColor()})`;
					score += 2;
					if (score == brickRowCount * brickColumnCount * 2) {
						alert(`C'est gagné, Bravo ! Score: ${score} points`);
						document.location.reload();
					}
				}
			}
		}
	}
}

function drawScore() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "white";
	ctx.fillText("Score : " + score, 8, 20);
}

function drawLives() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "white";
	ctx.fillText("Vies : " + lives, canvas.width - 65, 20);
}

function drawBall() {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
	ctx.fillStyle = colorBall;
	ctx.fill();
	ctx.closePath();
}

function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}

function drawBricks() {
	for (var c = 0; c < brickColumnCount; c++) {
		for (var r = 0; r < brickRowCount; r++) {
			if (bricks[c][r].status == 1) {
				var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
				var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = "#0095DD";
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBall();
	drawBricks();
	drawPaddle();
	drawScore();
	drawLives();
	collisionDetection();

	if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
		dx = -dx;
		colorBall = `rgb(${randomColor()})`;
	}
	if (y + dy < ballRadius) {
		dy = -dy;
		colorBall = `rgb(${randomColor()})`;
	} else if (y + dy > canvas.height - ballRadius) {
		if (x > paddleX && x < paddleX + paddleWidth) {
			dy = -dy;
			// dx = dx + 1;
			// dx = -dx - 1;
			colorBall = `rgb(${randomColor()})`;
		} else {
			lives--;
			if (!lives) {
				alert(`GAME OVER ! Score: ${score} point(s)`);
				document.location.reload();
			} else {
				x = canvas.width / 2;
				y = canvas.height - 30;
				dx = 5;
				dy = -5;
				paddleX = (canvas.width - paddleWidth) / 2;
			}
		}
	}
	if (rightPressed && paddleX < canvas.width - paddleWidth) {
		paddleX += 5;
	} else if (leftPressed && paddleX > 0) {
		paddleX -= 5;
	}

	x += dx;
	y += dy;
	requestAnimationFrame(draw);
}

draw();
