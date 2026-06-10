class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.lengthElement = document.getElementById('length');

        this.cellSize = 20;
        this.canvasSize = 400;
        this.gridSize = this.canvasSize / this.cellSize;

        this.snake = [{ x: 10, y: 10 }];
        this.direction = { x: 1, y: 0 };
        this.food = { x: 15, y: 15 };
        this.score = 0;
        this.gameRunning = false;
        this.gamePaused = false;
        this.snakeHeadImage = null;
        this.headImageLoaded = false;

        this.touchStartX = 0;
        this.touchStartY = 0;

        this.setupCanvas();
        this.loadHeadImage();
        this.setupEventListeners();
        this.draw();
    }

    setupCanvas() {
        const maxSize = Math.min(window.innerWidth - 40, 400);
        this.canvasSize = maxSize;
        this.cellSize = this.canvasSize / this.gridSize;
        this.canvas.width = this.canvasSize;
        this.canvas.height = this.canvasSize;
    }

    loadHeadImage() {
        const img = new Image();
        img.onload = () => {
            this.snakeHeadImage = img;
            this.headImageLoaded = true;
            this.draw();
        };
        img.onerror = () => {
            this.headImageLoaded = false;
        };
        img.src = 'head.png';
    }

    setupEventListeners() {
        document.getElementById('startBtn').addEventListener('click', () => this.start());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());

        document.querySelectorAll('.dir-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.changeDirection(e.target.dataset.dir));
        });

        document.addEventListener('keydown', (e) => this.handleKeyDown(e));

        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });

        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.draw();
        });
    }

    handleKeyDown(event) {
        if (!this.gameRunning || this.gamePaused) return;

        switch(event.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                this.changeDirection('up');
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                this.changeDirection('down');
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                this.changeDirection('left');
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                this.changeDirection('right');
                break;
        }
    }

    handleTouchStart(event) {
        const touch = event.touches[0];
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
    }

    handleTouchEnd(event) {
        if (!this.gameRunning || this.gamePaused) return;

        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - this.touchStartX;
        const deltaY = touch.clientY - this.touchStartY;
        const minSwipe = 30;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > minSwipe) {
                this.changeDirection('right');
            } else if (deltaX < -minSwipe) {
                this.changeDirection('left');
            }
        } else {
            if (deltaY > minSwipe) {
                this.changeDirection('down');
            } else if (deltaY < -minSwipe) {
                this.changeDirection('up');
            }
        }
    }

    changeDirection(dir) {
        const opposites = {
            up: 'down',
            down: 'up',
            left: 'right',
            right: 'left'
        };

        if (opposites[dir] === this.getCurrentDirection()) return;

        switch(dir) {
            case 'up':
                this.direction = { x: 0, y: -1 };
                break;
            case 'down':
                this.direction = { x: 0, y: 1 };
                break;
            case 'left':
                this.direction = { x: -1, y: 0 };
                break;
            case 'right':
                this.direction = { x: 1, y: 0 };
                break;
        }
    }

    getCurrentDirection() {
        if (this.direction.x === 1) return 'right';
        if (this.direction.x === -1) return 'left';
        if (this.direction.y === 1) return 'down';
        if (this.direction.y === -1) return 'up';
        return 'right';
    }

    start() {
        if (this.gameRunning && !this.gamePaused) return;

        if (!this.gameRunning) {
            this.gameRunning = true;
            this.gameLoop();
        } else {
            this.gamePaused = false;
            this.gameLoop();
        }
    }

    togglePause() {
        if (!this.gameRunning) return;
        this.gamePaused = !this.gamePaused;
        if (!this.gamePaused) {
            this.gameLoop();
        }
    }

    reset() {
        this.gameRunning = false;
        this.gamePaused = false;
        this.snake = [{ x: 10, y: 10 }];
        this.direction = { x: 1, y: 0 };
        this.score = 0;
        this.spawnFood();
        this.updateScore();
        this.draw();
    }

    gameLoop() {
        if (!this.gameRunning || this.gamePaused) return;

        this.move();
        if (this.checkCollision()) {
            this.gameOver();
            return;
        }
        this.draw();

        setTimeout(() => this.gameLoop(), 150);
    }

    move() {
        const head = { x: this.snake[0].x + this.direction.x, y: this.snake[0].y + this.direction.y };
        this.snake.unshift(head);

        if (this.checkFoodCollision()) {
            this.score += 10;
            this.updateScore();
            this.spawnFood();
        } else {
            this.snake.pop();
        }
    }

    checkFoodCollision() {
        const head = this.snake[0];
        return head.x === this.food.x && head.y === this.food.y;
    }

    checkCollision() {
        const head = this.snake[0];

        if (head.x < 0 || head.x >= this.gridSize || head.y < 0 || head.y >= this.gridSize) {
            return true;
        }

        for (let i = 1; i < this.snake.length; i++) {
            if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
                return true;
            }
        }

        return false;
    }

    spawnFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * this.gridSize),
                y: Math.floor(Math.random() * this.gridSize)
            };
        } while (this.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));

        this.food = newFood;
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
        this.lengthElement.textContent = this.snake.length;
    }

    draw() {
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);

        this.ctx.strokeStyle = '#16213e';
        this.ctx.lineWidth = 1;
        for (let i = 0; i <= this.gridSize; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.cellSize, 0);
            this.ctx.lineTo(i * this.cellSize, this.canvasSize);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.cellSize);
            this.ctx.lineTo(this.canvasSize, i * this.cellSize);
            this.ctx.stroke();
        }

        this.drawFood();
        this.drawSnake();

        if (this.gamePaused) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 36px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('暂停', this.canvasSize / 2, this.canvasSize / 2);
        }
    }

    drawFood() {
        const x = this.food.x * this.cellSize;
        const y = this.food.y * this.cellSize;

        const gradient = this.ctx.createRadialGradient(
            x + this.cellSize / 2, y + this.cellSize / 2, 0,
            x + this.cellSize / 2, y + this.cellSize / 2, this.cellSize / 2
        );
        gradient.addColorStop(0, '#ff6b6b');
        gradient.addColorStop(1, '#ee5a24');

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x + this.cellSize / 2, y + this.cellSize / 2, this.cellSize / 2 - 2, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawSnake() {
        this.snake.forEach((segment, index) => {
            const x = segment.x * this.cellSize;
            const y = segment.y * this.cellSize;

            if (index === 0) {
                this.drawSnakeHead(x, y);
            } else {
                const gradient = this.ctx.createLinearGradient(x, y, x + this.cellSize, y + this.cellSize);
                gradient.addColorStop(0, '#4ecdc4');
                gradient.addColorStop(1, '#44a08d');

                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                const radius = Math.max(2, this.cellSize * 0.15);
                const w = this.cellSize - 4;
                const h = this.cellSize - 4;
                this.ctx.moveTo(x + 2 + radius, y + 2);
                this.ctx.arcTo(x + 2 + w, y + 2, x + 2 + w, y + 2 + h, radius);
                this.ctx.arcTo(x + 2 + w, y + 2 + h, x + 2, y + 2 + h, radius);
                this.ctx.arcTo(x + 2, y + 2 + h, x + 2, y + 2, radius);
                this.ctx.arcTo(x + 2, y + 2, x + 2 + w, y + 2, radius);
                this.ctx.closePath();
                this.ctx.fill();
            }
        });
    }

    drawSnakeHead(x, y) {
        if (this.headImageLoaded && this.snakeHeadImage) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(x + this.cellSize / 2, y + this.cellSize / 2, this.cellSize / 2 - 2, 0, Math.PI * 2);
            this.ctx.closePath();
            this.ctx.clip();
            this.ctx.drawImage(this.snakeHeadImage, x, y, this.cellSize, this.cellSize);
            this.ctx.restore();
        } else {
            const gradient = this.ctx.createRadialGradient(
                x + this.cellSize / 2, y + this.cellSize / 2, 0,
                x + this.cellSize / 2, y + this.cellSize / 2, this.cellSize / 2
            );
            gradient.addColorStop(0, '#4ecdc4');
            gradient.addColorStop(1, '#26de81');

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(x + this.cellSize / 2, y + this.cellSize / 2, this.cellSize / 2 - 2, 0, Math.PI * 2);
            this.ctx.fill();

            const eyeRadius = Math.max(1.5, this.cellSize * 0.1);
            const pupilRadius = Math.max(0.8, this.cellSize * 0.06);
            let eyeX1, eyeY1, eyeX2, eyeY2;

            const cx = x + this.cellSize / 2;
            const cy = y + this.cellSize / 2;
            const offsetX = this.cellSize * 0.22;
            const offsetY = this.cellSize * 0.18;

            switch(this.getCurrentDirection()) {
                case 'up':
                    eyeX1 = cx - offsetX; eyeY1 = cy - offsetY;
                    eyeX2 = cx + offsetX; eyeY2 = cy - offsetY;
                    break;
                case 'down':
                    eyeX1 = cx - offsetX; eyeY1 = cy + offsetY;
                    eyeX2 = cx + offsetX; eyeY2 = cy + offsetY;
                    break;
                case 'left':
                    eyeX1 = cx - offsetY; eyeY1 = cy - offsetX;
                    eyeX2 = cx - offsetY; eyeY2 = cy + offsetX;
                    break;
                default:
                    eyeX1 = cx + offsetY; eyeY1 = cy - offsetX;
                    eyeX2 = cx + offsetY; eyeY2 = cy + offsetX;
                    break;
            }

            this.ctx.fillStyle = '#fff';
            this.ctx.beginPath();
            this.ctx.arc(eyeX1, eyeY1, eyeRadius, 0, Math.PI * 2);
            this.ctx.arc(eyeX2, eyeY2, eyeRadius, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.fillStyle = '#000';
            this.ctx.beginPath();
            this.ctx.arc(eyeX1, eyeY1, pupilRadius, 0, Math.PI * 2);
            this.ctx.arc(eyeX2, eyeY2, pupilRadius, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    gameOver() {
        this.gameRunning = false;
        this.draw();

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);

        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.font = 'bold 32px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('游戏结束', this.canvasSize / 2, this.canvasSize / 2 - 30);

        this.ctx.fillStyle = '#fff';
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`最终分数: ${this.score}`, this.canvasSize / 2, this.canvasSize / 2 + 10);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new SnakeGame();
});