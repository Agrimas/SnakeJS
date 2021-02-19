window.onload = function () {
	let canvas = document.getElementById('canvas');
	let context = canvas.getContext('2d');
	let [width, height] = [canvas.width, canvas.height];
	let blockSize = 20;
	let widthInBlocks = width / blockSize;
	let heightInBlocks = height / blockSize;
	let score = 0;
	let bendBlocks = [];
	let directions = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	}
	document.body.addEventListener('keydown', function (event) {
		let newDirection = directions[event.keyCode];
		if (newDirection !== undefined) {
			snake.setDirection(newDirection);
		}
	})

	function drawScore() {
		blockScore.innerText = 'Score: ' + score;
	}

	function gameOver() {
		speed = 0;
		context.font = '60px Hachi Maru Pop';
		context.fillStyle = 'red';
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.fillText('Game Over', width / 2, height / 2);
	}

	class Block {
		constructor(col, row) {
			this.col = col;
			this.row = row;
		}

		drawSquare(color) {
			let x = this.col * blockSize;
			let y = this.row * blockSize;
			context.fillStyle = color;
			context.fillRect(x, y, blockSize, blockSize);
		}

		drawCircle(color) {
			let x = this.col * blockSize + blockSize / 2;
			let y = this.row * blockSize + blockSize / 2;
			context.beginPath();
			context.fillStyle = color;
			context.arc(x, y, blockSize / 2, 0, 2 * Math.PI, false);
			context.fill();
		}

		drawImage(img) {
			let x = this.col * blockSize;
			let y = this.row * blockSize;
			context.drawImage(img, x, y, blockSize, blockSize);
		}

		equal(otherBlock) {
			return this.col === otherBlock.col && this.row === otherBlock.row;
		}
	}

	class Snake {
		constructor() {
			this.segments = [
				new Block(9, 5),
				new Block(8, 5),
				new Block(7, 5),
				new Block(6, 5),
				new Block(5, 5),
				new Block(4, 5),
				new Block(3, 5),
			];
			this.direction = 'right';
			this.nextDirection = 'right';
			this.imgs = {
				headLeft: $('<img>').attr('src', '/img/snake-head-left.png')[0],
				headRight: $('<img>').attr('src', '/img/snake-head-right.png')[0],
				headUp: $('<img>').attr('src', '/img/snake-head-up.png')[0],
				headDown: $('<img>').attr('src', '/img/snake-head-down.png')[0],
				turn1: $('<img>').attr('src', '/img/snake-turn1.png')[0],
				turn2: $('<img>').attr('src', '/img/snake-turn2.png')[0],
				turn3: $('<img>').attr('src', '/img/snake-turn3.png')[0],
				turn4: $('<img>').attr('src', '/img/snake-turn4.png')[0],
			}
		}

		draw() {
			this.drawHead();
			this.drawBody();
			// this.drawTail();
		}

		drawHead() {
			let head = this.segments[0];
			let img = new Image;
			switch (this.direction) {
				case 'right':
					head.drawImage(this.imgs.headRight);
					break;
				case 'left':
					head.drawImage(this.imgs.headLeft);
					break;
				case 'up':
					head.drawImage(this.imgs.headUp);
					break;
				case 'down':
					head.drawImage(this.imgs.headDown);
					break;
			}
		}

		drawBody() {
			let imgs = this.imgs;
			let tail = this.segments[this.segments.length - 1];
			let directionBody;
			if (this.direction === 'right' || this.direction === 'left') {
				directionBody = true;
			} else {
				directionBody = false;
			}
			for (let index = 1; index < this.segments.length; index++) {
				let bodyBlock = this.segments[index];
				let img = new Image;
				let [isTail, isBend] = [false, false];

				// Проверка и отрисовка головы
				if (bodyBlock.equal(tail)) {
					bodyBlock.drawSquare('blue');
					isTail = true;
				}

				// Проверка и отрисовка изгибов
				bendBlocks.forEach(function (item, index, object) {
					if (bodyBlock.equal(item)) {
						isBend = true;
						directionBody = !directionBody;
						if (isTail) {
							object.splice(index, 1);
							return;
						}
						if ((item.direction == 'left' && item.nextDirection == 'up') || (item.direction == 'down' && item.nextDirection == 'right')) {
							bodyBlock.drawImage(imgs.turn1);
						}
						if ((item.direction == 'left' && item.nextDirection == 'down') || (item.direction == 'up' && item.nextDirection == 'right')) {
							bodyBlock.drawImage(imgs.turn2);
						}
						if ((item.direction == 'right' && item.nextDirection == 'up') || (item.direction == 'down' && item.nextDirection == 'left')) {
							bodyBlock.drawImage(imgs.turn3);
						}
						if ((item.direction == 'right' && item.nextDirection == 'down') || (item.direction == 'up' && item.nextDirection == 'left')) {
							bodyBlock.drawImage(imgs.turn4);
						}
					}
				})

				// Отрисовка тела
				if (isBend == false && isTail == false) {
					if (directionBody) {
						bodyBlock.drawSquare('yellow');
					} else {
						bodyBlock.drawSquare('green');
					}
				}
			}
		}

		drawTail() {
			this.segments[this.segments.length - 1].drawSquare('blue');
		}

		checkCollision(head) {
			let leftCollision = (head.col === -1);
			let rightCollision = (head.col === widthInBlocks);
			let topCollision = (head.row === -1);
			let bottomCollision = (head.row === heightInBlocks);

			let wallCollision = leftCollision || rightCollision || topCollision || bottomCollision;

			let selfCollision = false;

			for (let index = 0; index < this.segments.length; index++) {
				if (head.equal(this.segments[index])) {
					selfCollision = true;
				}
			}

			return wallCollision || selfCollision;
		}

		move() {
			let head = this.segments[0];
			let newHead;
			if (this.direction !== this.nextDirection) {
				bendBlocks.push({
					col: head.col,
					row: head.row,
					direction: this.direction,
					nextDirection: this.nextDirection,
				});
			}
			this.direction = this.nextDirection;
			switch (this.direction) {
				case 'right':
					newHead = new Block(head.col + 1, head.row);
					break;
				case 'left':
					newHead = new Block(head.col - 1, head.row);
					break;
				case 'up':
					newHead = new Block(head.col, head.row - 1);
					break;
				case 'down':
					newHead = new Block(head.col, head.row + 1);
					break;
			}

			if (this.checkCollision(newHead)) {
				gameOver();
				return;
			}

			this.segments.unshift(newHead);

			if (newHead.equal(apple.position)) {
				if (speed > 80) {
					speed -= 10;
				}
				score++;
				apple.move();
			} else {
				this.segments.pop();
			}
		}

		setDirection(newDirection) {
			if (this.direction === 'up' && newDirection === 'down') {
				return;
			} else if (this.direction === 'down' && newDirection === 'up') {
				return;
			} else if (this.direction === 'left' && newDirection === 'right') {
				return;
			} else if (this.direction === 'right' && newDirection === 'left') {
				return;
			}
			this.nextDirection = newDirection;
		}
	}
	class Apple {
		constructor() {
			this.position = new Block(10, 10);
		}

		draw() {
			let img = new Image();
			img.src = '/img/apple.png';
			this.position.drawImage(img);
			// this.position.drawCircle('red');
		}

		move() {
			let randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
			let randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
			this.position = new Block(randomCol, randomRow);
		}
	}

	let blockScore = document.createElement('div');
	blockScore.id = 'score';
	canvas.insertAdjacentElement('beforebegin', blockScore);
	let apple = new Apple();
	let snake = new Snake();
	let speed = 200;

	let timerId = setTimeout(function request() {
		if (speed === 0) {
			return;
		}
		context.clearRect(0, 0, width, height);
		drawScore();
		snake.move();
		snake.draw();
		apple.draw();
		timerId = setTimeout(request, speed);
	}, speed);
}
