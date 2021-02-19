window.onload = function () {
	let canvas = document.getElementById('canvas');
	let context = canvas.getContext('2d');
	let width = canvas.width;
	let height = canvas.height;
	let blockSize = 20;
	let widthInBlocks = width / blockSize;
	let heightInBlocks = height / blockSize;
	let score = 0;
	let bendBlocks = [];
	let blockScore = document.createElement('div');
	blockScore.id = 'score';
	canvas.insertAdjacentElement('beforebegin', blockScore);
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
		clearInterval(intervalId);
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
			this.imgHeadRight = new Image;
			this.imgHeadRight.src = '/img/snake-head-right.png';
			this.imgHeadLeft = new Image;
			this.imgHeadLeft.src = '/img/snake-head-left.png';
			this.imgHeadUp = new Image;
			this.imgHeadUp.src = '/img/snake-head-up.png';
			this.imgHeadDown = new Image;
			this.imgHeadDown.src = '/img/snake-head-down.png';

			this.imgTurn2 = new Image;
			this.imgTurn2.src = '/img/snake-turn2.png'
			this.imgTurn3 = new Image;
			this.imgTurn3.src = '/img/snake-turn3.png'
			this.imgTurn4 = new Image;
			this.imgTurn4.src = '/img/snake-turn4.png'
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
					img.src = '/img/snake-head-right.png';
					head.drawImage(img);
					break;
				case 'left':
					img.src = '/img/snake-head-left.png';
					head.drawImage(img);
					break;
				case 'up':
					img.src = '/img/snake-head-up.png';
					head.drawImage(img);
					break;
				case 'down':
					img.src = '/img/snake-head-down.png';
					head.drawImage(img);
					break;
			}
		}

		drawBody() {
			let bodyDirection = true;
			let tail = this.segments[this.segments.length - 1];

			for (let index = 1; index < this.segments.length; index++) {
				let bodyBlock = this.segments[index];
				let img = new Image;
				let isTail = false;
				let directionBend;
				let nextDirectionBend;
				let isBend = false;

				// Отрисовка головы
				if (bodyBlock.equal(tail)) {
					bodyBlock.drawSquare('blue');
					isTail = true;
				}

				// Отрисовка изгибов
				bendBlocks.forEach(function (item, index, object) {
					if (bodyBlock.equal(item)) {
						isBend = true;
						if (isTail) {
							object.splice(index, 1);
							return;
						}
						directionBend = item.direction;
						nextDirectionBend = item.nextDirection;
						if (directionBend == 'left') {
							if (nextDirectionBend == 'up') {
								img.src = '/img/snake-turn1.png'
							} else {
								img.src = '/img/snake-turn2.png'
							}
						} else if (directionBend == 'right') {
							if (nextDirectionBend == 'up') {
								img.src = '/img/snake-turn3.png'
							} else {
								img.src = '/img/snake-turn4.png'
							}
						} else if (directionBend == 'up') {
							if (nextDirectionBend == 'right') {
								img.src = '/img/snake-turn2.png'
							} else {
								img.src = '/img/snake-turn4.png'
							}
						} else if (directionBend == 'down') {
							if (nextDirectionBend == 'right') {
								img.src = '/img/snake-turn1.png'
							} else {
								img.src = '/img/snake-turn3.png'
							}
						}
						bodyBlock.drawImage(img);
					}
				})

				// Отрисовка тела
				if (bodyBlock !== this.segments[this.segments.length - 1] && isBend == false && isTail == false) {
					if (bodyBlock.row < this.segments[index + 1].row || bodyBlock.row > this.segments[index + 1].row) {
						bodyBlock.drawSquare('yellow');
						continue;
					} else {
						bodyBlock.drawSquare('green');
						continue;
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

	let apple = new Apple();
	let snake = new Snake();

	let intervalId = setInterval(() => {
		context.clearRect(0, 0, width, height);
		drawScore();
		snake.move();
		snake.draw();
		apple.draw();
	}, 200);
}