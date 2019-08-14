function Snake() {
    const gridHeight = 30; // px
    const gridWidth = 30;
    const cellSize = 20;

    const backgroundColor = "#333333";
    const gameoverColor = "#ff0000";
    const foodColor = "#ffc107"; 
    const snakeColor = "#ffffff";

    const minInterval = 85; // ms
    const maxInterval = 50;
    const upInterval = 0.5;

    const LEFT = 37; // key code
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    let context;
    let canvas;
    let snake;
    let food;
    let grid = [];

    function Piece(x, y) {
        this.x = x;
        this.y = y;
    };

    function Food() {
        this.x = null;
        this.y = null;

        this.update = () => {
            do {
                this.x = Math.floor(Math.random() * gridWidth);
                this.y = Math.floor(Math.random() * gridHeight);
            } while (!this.check());
        };

        this.check = () => {
            for (let i = 0; i < snake.pieces.length - 1; i++) {
                if ((snake.pieces[i].x == this.x) && (snake.pieces[i].y == this.y)) {
                    return false;
                }
            }

            return true;
        }
    };

    function Snake() {
        this.prevx = null;
        this.prevy = null;

        this.pieces = [];
        this.interval = minInterval;
        this.dir = LEFT;
        this.live = true;

        this.init = () => {
            const piece = new Piece(0, 0);
            this.pieces.push(piece);
            grid[piece.x][piece.y] = true;
        };

        this.push = () => {
            const piece = new Piece(food.x, food.y);
            this.pieces.push(piece);

            if (this.interval >= maxInterval) {
                this.interval -= upInterval;
            }
        }
    };

    const go = () => {
        grid[snake.pieces[snake.pieces.length - 1].x][snake.pieces[snake.pieces.length - 1].y] = false;

        for (let i = snake.pieces.length - 1; i > 0; i--) {
            snake.pieces[i].x = snake.pieces[i - 1].x;
            snake.pieces[i].y = snake.pieces[i - 1].y;
        }

        switch (snake.dir) {
            case LEFT:
                snake.pieces[0].x--;

                if (snake.pieces[0].x < 0) {
                    snake.pieces[0].x = gridWidth - 1;
                }

                break;
            case UP:
                snake.pieces[0].y--;

                if (snake.pieces[0].y < 0) {
                    snake.pieces[0].y = gridHeight - 1;
                }

                break;
            case RIGHT:
                snake.pieces[0].x++;

                if (snake.pieces[0].x > gridWidth - 1) {
                    snake.pieces[0].x = 0;
                }

                break;
            case DOWN:
                snake.pieces[0].y++;

                if (snake.pieces[0].y > gridHeight - 1) {
                    snake.pieces[0].y = 0;
                }

                break;

            default: break;
        }

        if ((snake.pieces[0].x == food.x) && (snake.pieces[0].y == food.y)) {
            snake.push();
            food.update();
        }

        if (!grid[snake.pieces[0].x][snake.pieces[0].y]) {
            grid[snake.pieces[0].x][snake.pieces[0].y] = true;
        } else {
            snake.live = false;
        }
    };

    const draw = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = snakeColor;
        for (let i = snake.pieces.length - 1; i >= 0; i--) {
            context.fillRect(
                snake.pieces[i].x * cellSize + 1,
                snake.pieces[i].y * cellSize + 1,
                cellSize - 1,
                cellSize - 1
            );
        }

        context.fillStyle = foodColor;
        context.fillRect(
            food.x * cellSize + 1,
            food.y * cellSize + 1,
            cellSize - 1,
            cellSize - 1
        );
    };

    const gameover = () => {
        if (context.fillStyle == gameoverColor) {
            context.fillStyle = snakeColor;
        } else {
            context.fillStyle = gameoverColor;
        }

        context.fillRect(
            snake.pieces[0].x * cellSize + 1,
            snake.pieces[0].y * cellSize + 1,
            cellSize - 1,
            cellSize - 1
        );
    };

    const initCanvas = () => {
        canvas = document.createElement('canvas');
        canvas.width = gridWidth * cellSize + 1;
        canvas.height = gridHeight * cellSize + 1;
        canvas.style.backgroundColor = backgroundColor;

        context = canvas.getContext('2d');

        document.body.appendChild(canvas);

        document.addEventListener('keydown', event => {
            if (snake.live) {
                const key = event.keyCode;

                if (
                    (Math.abs(key - snake.dir) == 2) ||
                    ((snake.prevx === snake.pieces[0].x) && (snake.prevy === snake.pieces[0].y))
                ) return;

                if ((key == LEFT) || (key == UP) || (key == RIGHT) || (key == DOWN)) {
                    snake.prevx = snake.pieces[0].x;
                    snake.prevy = snake.pieces[0].y;

                    snake.dir = key;
                }
            }
        });
    };

    const initGrid = () => {
        for (let i = 0; i < gridWidth; i++) {
            grid[i] = [];

            for (let j = 0; j < gridHeight; j++) {
                grid[i][j] = false;
            }
        }
    };

    this.start = () => {
        initCanvas();
        initGrid();

        snake = new Snake();
        snake.init();

        food = new Food();
        food.update();

        const intervalID = setInterval(() => {
            if (snake.live) {
                go();
                draw();
            } else {
                gameover();
                clearInterval(intervalID);
            }
        }, snake.interval);
    };
}

const snake = new Snake();
snake.start();