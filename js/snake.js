class snakeGame {
	constructor(containerId, width, height) {
		this.canvas = document.createElement('canvas');
		this.numberGame = document.querySelectorAll('snakeGame') + 1;
		this.canvas.width = width;
		this.canvas.height = height;
		this.canvas.style.backgroundColor = 'Gray';
		this.context = this.canvas.getContext('2d');
		this.container = document.getElementById(containerId);

		this.width = this.canvas.width;	// Ширина поля
		this.height = this.canvas.height;	//	Высота поля
		this.blockSize = 10;	// Размер ячейки
		this.widthInBlocks = this.width / this.blockSize;	// Ширина поля в ячейках
		this.heightInBlocks = this.height / this.blockSize;	// Высота поля в ячейках
		this.score = 0;	// Изначальный счёт

		this.drawScore = this.drawScore.bind(this);
		this.gameOver = this.gameOver.bind(this);

		// Вызовы
		this.container.append(this.canvas);
		this.drawScore();
		new Snake(this.context, this.blockSize).draw();
	}

	drawScore() {
		let scoreBlock = document.getElementById('scoreBlock');
		if (scoreBlock) {
			scoreBlock.innerHTML = `Текущий счёт: ${this.score}`;
		} else {
			scoreBlock = document.createElement('p');
			scoreBlock.id = 'scoreBlock' + this.numberGame;
			scoreBlock.style.marginBottom = 0;
			scoreBlock.innerHTML = `Текущий счёт: ${this.score}`;
			this.container.prepend(scoreBlock);
		}

	}

	gameOver() {
		// clearInterval(intervalId);
		this.context.font = '60px cursive';
		this.context.textAlign = 'center';
		this.context.textBaseline = 'middle';
		this.context.fillText('Конец игры', this.width / 2, this.height / 2);
	}
}

class Block {
	constructor(col, row, context, blockSize) {
		this.col = col;
		this.row = row;
		this.context = context;
		this.blockSize = blockSize;
	}

	drawSquare(color) {
		let x = this.col * this.blockSize;
		let y = this.row * this.blockSize;
		this.context.fillStyle = color;
		this.context.fillRect(x, y, this.blockSize, this.blockSize);
	}

	drawImg(img) {
		let x = this.col * this.blockSize;
		let y = this.row * this.blockSize;
		this.context.drawImage(img, x, y, this.blockSize, this.blockSize);
	}

	equal(otherBlock) {
		return this.col === otherBlock.col && this.row === otherBlock.row;
	}
}

class Snake {
	constructor(context, blockSize) {
		this.context = context;
		this.blockSize = blockSize;
		this.segments = [
			this.newBlock(7, 5),
			this.newBlock(6, 5),
			this.newBlock(5, 5),
			this.newBlock(5, 4),
		];
		this.direction = 'right';
		this.nextDirection = 'right';
	}

	newBlock(col, row) {
		return new Block(col, row, this.context, this.blockSize);
	}

	draw() {
		for (let x = 0; x < this.segments.length; x++) {
			this.segments[x].drawSquare('orange');
		}
	}

	// move() {
	// 	let head = this.segments[0];
	// 	let newHead;
	// 	this.direction = this.nextDirection;

	// }
}