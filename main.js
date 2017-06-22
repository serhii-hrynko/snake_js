var 
		
gridHeight = 30,
gridWidth = 30,
cellSize = 20,

backgroundColor = "#333333", // grey
gameoverColor = "#00cc00", // green
foodColor = "#ff0000", // red
snakeColor = "#ffffff", // white

minInterval = 85,
maxInterval = 50, 
upInterval = 0.5,

LEFT = 37,
UP = 38,
RIGHT = 39,
DOWN = 40,

canvas,
context,

intervalID,

grid = [],

food = {
	x: 0,
	y: 0,
	
	update: function() 
	{
		do 
		{
			this.x = Math.floor(Math.random() * gridWidth);
			this.y = Math.floor(Math.random() * gridHeight);
		} while(!this.check());	
	},

	check: function() 
	{
		for (var i = 0; i < snake.size - 1; i++)
			if (snake.pieces[i].x == this.x && snake.pieces[i].y == this.y) 
				return false;
		
		return true;
	}
},

snake = {
	pieces: null,
	size: null,
	interval:  null,
	dir: null,
	game: null,

	prevx: null,
	prevy: null,

	init: function() 
	{
		this.pieces = [];
		this.size = 1;
		this.interval = minInterval;
		this.dir = LEFT;
		this.game = true;

		p = new piece(0, 0);
		this.pieces.push(p);	

		for (var i = 0; i < gridWidth; i++) 
		{
			grid[i] = [];
			for (var j = 0; j < gridHeight; j++) 
				grid[i][j] = false;
		}
		grid[this.pieces[0].x][this.pieces[0].y] = true;
	},

	push: function() 
	{
		var p = new piece(food.x, food.y);
		this.pieces.push(p);
		this.size++;

		if (this.interval >= maxInterval) 
			this.interval -= upInterval;
	}
};


function go() 
{
	grid[snake.pieces[snake.size - 1].x][snake.pieces[snake.size - 1].y] = false;

	for (var i = snake.size - 1; i > 0; i--) 
	{
		snake.pieces[i].x = snake.pieces[i - 1].x;
		snake.pieces[i].y = snake.pieces[i - 1].y;
	}
	
	switch (snake.dir)
	{
		case LEFT: 
			snake.pieces[0].x--;
			if(snake.pieces[0].x < 0) 
				snake.pieces[0].x = gridWidth - 1; 
			break;
		case UP: 
			snake.pieces[0].y--; 
			if(snake.pieces[0].y < 0) 
				snake.pieces[0].y = gridHeight - 1; 
			break;
		case RIGHT:
			snake.pieces[0].x++;
			if(snake.pieces[0].x > gridWidth - 1) 
				snake.pieces[0].x = 0; 
			break;
		case DOWN: 
			snake.pieces[0].y++; 
			if(snake.pieces[0].y > gridHeight - 1) 
				snake.pieces[0].y = 0; 
			break;
		default: break;
	}

	if (snake.pieces[0].x == food.x && snake.pieces[0].y == food.y) 
	{
		snake.push();
		food.update();
	}

	if (!grid[snake.pieces[0].x][snake.pieces[0].y])
		grid[snake.pieces[0].x][snake.pieces[0].y] = true;
	else snake.game = false;
}

function draw() 
{
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	context.fillStyle = snakeColor;
	for (var i = snake.size - 1; i >= 0; i--) 
	{
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
}

function gameover()
{
	if (context.fillStyle == gameoverColor) 
		context.fillStyle = snakeColor;
	else context.fillStyle = gameoverColor
	context.fillRect(
		snake.pieces[0].x * cellSize + 1, 
		snake.pieces[0].y * cellSize + 1, 
		cellSize - 1, 
		cellSize - 1
	);
}

function piece(x, y) 
{
	this.x = x;
	this.y = y;
}

document.addEventListener("keydown", function(evt) {
	if (snake.game)
	{
		var key = evt.keyCode;

		if (key == LEFT && snake.dir == RIGHT ||
			key == UP && snake.dir == DOWN ||
			key == RIGHT && snake.dir == LEFT ||
			key == DOWN && snake.dir == UP ) return;

		if (snake.prevx == snake.pieces[0].x && snake.prevy == snake.pieces[0].y) 
			return;

		if (key == LEFT || key == UP || key == RIGHT || key == DOWN) 
		{
			snake.prevx = snake.pieces[0].x;
			snake.prevy = snake.pieces[0].y;

			snake.dir = key;
		}
	}
});

function create() 
{
	canvas = document.createElement("canvas");
	canvas.width = gridWidth * cellSize + 1;
	canvas.height = gridHeight * cellSize + 1;
	canvas.style.backgroundColor = backgroundColor;
	
	context = canvas.getContext("2d");	

	document.body.appendChild(canvas);
}

function main()
{
	create();
	snake.init();
	food.update();

	intervalID = setInterval( 
		function() 
		{
			if (snake.game) 
			{
				go();
				draw();
			} 
			else 
			{
				gameover();
				clearInterval(intervalID);
			}
		}, 
		snake.interval);
}

main();