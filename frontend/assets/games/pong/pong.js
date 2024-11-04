import {Stats} from '/assets/games/space_invaders/js/three-defs.js';

// Constants
const GAME_CONSTANTS = {
	MODES: {
		LOCAL: "local",
		RANKED: "ranked",
	},
	COLORS: {
		BACKGROUND: "#000000aa",
		PRIMARY: "#fff"
	},
	ITEM_SIZE: 16,
	BASE_SPEED: 10,
	BALL_SPEED_CAP: 23,

	SCORE_TO_WIN: 5,
	TIME_TO_WIN: 5,
	INC_SPEED: 1,
};

// Input handler class
class InputManager {
	constructor() {
		this.keys = {};
		this.keyMap = {
			ARROW_UP: "ArrowUp",
			ARROW_DOWN: "ArrowDown",
			KEY_W: "w",
			KEY_Z: "z",
			KEY_S: "s",
			F_KEY: "f",
		};

		this.setupEventListeners();
	}

	setupEventListeners() {
		window.addEventListener("keydown", (e) => {
			if(e.key == 'f') fullScreen("pong-canvas");
			else this.keys[e.key] = true
		});
		window.addEventListener("keyup", (e) => (this.keys[e.key] = false));
	}

	isKeyPressed(key) {
		return this.keys[key] === true;
	}
}

// Vector class for position and velocity
class Vector2D {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	add(vector) {
		this.x += vector.x;
		this.y += vector.y;
	}

	multiply(scalar) {
		this.x *= scalar;
		this.y *= scalar;
	}
}

// Base class for game objects
class GameObject {
	constructor(position, size) {
		this.position = position;
		this.size = size;
		this.color = GAME_CONSTANTS.COLORS.PRIMARY;
	}

	draw(ctx) {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
	}
}

// Ball class
class Ball extends GameObject {
	constructor(position) {
		super(position, new Vector2D(GAME_CONSTANTS.ITEM_SIZE, GAME_CONSTANTS.ITEM_SIZE));

		this.velocity = new Vector2D(GAME_CONSTANTS.BASE_SPEED, GAME_CONSTANTS.BASE_SPEED);
	}

	update(canvas) {
		this.position.add(this.velocity);
		this.checkWallCollision(canvas);
	}

	checkWallCollision(canvas) {
		if (this.position.y + this.size.y >= canvas.height || this.position.y <= 0) {
			this.velocity.y *= -1;
		}
	}

	respawn(canvas) {
		this.position.x = canvas.width / 2;
		this.position.y = Math.random() * (canvas.height - canvas.height * 0.4) + canvas.height * 0.4;
		this.velocity.x = Math.sign(this.velocity.x) * -1 * GAME_CONSTANTS.BASE_SPEED;
		this.velocity.y = Math.sign(this.velocity.y) * -1 * GAME_CONSTANTS.BASE_SPEED;
	}
}

// Paddle class
class Paddle extends GameObject {
	constructor(position, height, side) {
		super(position, new Vector2D(GAME_CONSTANTS.ITEM_SIZE, height));
		this.side = side;
		this.score = 0;
		this.velocity = new Vector2D(0, GAME_CONSTANTS.BASE_SPEED);
	}

	update(inputManager, canvas) {
		if (this.side === "left") {
			if (inputManager.isKeyPressed(inputManager.keyMap.ARROW_UP))
				this.position.y -= this.velocity.y;

			if (inputManager.isKeyPressed(inputManager.keyMap.ARROW_DOWN))
				this.position.y += this.velocity.y;

		} else {
			if (inputManager.isKeyPressed(inputManager.keyMap.KEY_W) || inputManager.isKeyPressed(inputManager.keyMap.KEY_Z))
				this.position.y -= this.velocity.y;

			if (inputManager.isKeyPressed(inputManager.keyMap.KEY_S))
				this.position.y += this.velocity.y;
		}

		this.clampToBounds(canvas);
	}

	clampToBounds(canvas) {
		if (this.position.y <= 0)
			this.position.y = 0;

		if (this.position.y + this.size.y >= canvas.height)
			this.position.y = canvas.height - this.size.y;

	}

	checkBallCollision(ball) {
		const willCollide =
			ball.position.x + ball.size.x >= this.position.x &&
			ball.position.x <= this.position.x + this.size.x &&
			ball.position.y + ball.size.y >= this.position.y &&
			ball.position.y <= this.position.y + this.size.y;

		if (willCollide) {
			ball.velocity.x = ball.velocity.x * -1 + Math.sign(ball.velocity.x) * -1 * GAME_CONSTANTS.INC_SPEED;

			if (Math.abs(ball.velocity.x) > GAME_CONSTANTS.BALL_SPEED_CAP)
				ball.velocity.x = Math.sign(ball.velocity.x) * GAME_CONSTANTS.BALL_SPEED_CAP;
		}

		return willCollide;
	}
}

// Game manager class
class PongGame {
	constructor(canvasId, gameMode) {
		this.canvas = document.getElementById(canvasId);

		this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });
		this.gameState = "running";



		if(!this.canvas || !this.ctx) {
			this.gameState = "game_over";
			console.error("Canvas not found");
			return;
		}

		if(gameMode !== "local" && gameMode !== "ranked") {
			this.gameState = "game_over";
			console.error("Invalid game mode");
			return;
		}

		this.gameMode = gameMode == "local" ? GAME_CONSTANTS.MODES.LOCAL : GAME_CONSTANTS.MODES.RANKED;
		
		this.gameStartTime = new Date();
		this.gameTimer = document.getElementById('game-page-game-timer');
		this.user1Score = document.getElementById('game-page-user-1-score');
		this.user2Score = document.getElementById('game-page-user-2-score');
		
        this.stats = new Stats();
		document.querySelector("body").appendChild(this.stats.dom);

		this.setupCanvas();
		this.inputManager = new InputManager();
		this.initializeGameObjects();

		this.setupResizeHandler();
	}

	setupCanvas() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.canvas.style.backgroundColor = GAME_CONSTANTS.COLORS.BACKGROUND;
	}
	
	initializeGameObjects() {
		const paddleHeight = this.canvas.height / 5;

		this.ball = new Ball(new Vector2D(this.canvas.width / 2, this.canvas.height / 2));

		this.leftPaddle = new Paddle(new Vector2D(0, 0), paddleHeight, "right");

		this.rightPaddle = new Paddle(new Vector2D(this.canvas.width - GAME_CONSTANTS.ITEM_SIZE, 0), paddleHeight, "left");
	}

	setupResizeHandler() {
		window.addEventListener("resize", () => {
			this.canvas.width = window.innerWidth;
			this.canvas.height = (window.innerWidth * 9) / 16;


			this.leftPaddle.size.y = this.canvas.height / 5;
			this.rightPaddle.size.y = this.canvas.height / 5;


			this.rightPaddle.position.x = this.canvas.width - GAME_CONSTANTS.ITEM_SIZE;
		});
	}

	drawCenterLine() {
		const lineWidth = GAME_CONSTANTS.ITEM_SIZE * 0.6;
		const lineHeight = GAME_CONSTANTS.ITEM_SIZE * 1.7;
		const gap = 38;

		this.ctx.fillStyle = this.ball.color;

		for (let y = 0; y < this.canvas.height; y += gap) {
			this.ctx.fillRect(this.canvas.width / 2, y, lineWidth, lineHeight);
		}
	}

	updateStatsHeader() {
		const timeDiff = new Date() - this.gameStartTime;
		const minutes = Math.floor(timeDiff / 60000);
		const seconds = Math.floor((timeDiff % 60000) / 1000);
		this.gameTimer.innerText = `${minutes.toString().padStart(2, "0")} : ${seconds.toString().padStart(2, "0")}`;
	
		this.user1Score.innerText = this.leftPaddle.score;
		this.user2Score.innerText = this.rightPaddle.score;
	}



	update() {

		this.ball.update(this.canvas);
		this.leftPaddle.update(this.inputManager, this.canvas);

		this.stats.update();

		if (this.gameMode === GAME_CONSTANTS.MODES.LOCAL)
			this.rightPaddle.update(this.inputManager, this.canvas);

		this.checkCollisions();
		this.checkScore();
		this.send_ws_data();
	}

	checkCollisions() {
		this.leftPaddle.checkBallCollision(this.ball);
		this.rightPaddle.checkBallCollision(this.ball);
	}

	checkScore() {
		if (this.ball.position.x + this.ball.size.x >= this.canvas.width) {
			this.leftPaddle.score++;
			this.ball.respawn(this.canvas);
		}
		if (this.ball.position.x <= 0) {
			this.rightPaddle.score++;
			this.ball.respawn(this.canvas);
		}
	}

	send_ws_data() {
		return;

		const data = {
            type: "si_send_from_client_to_server",
            user_id: parseInt(localStorage.getItem("id")),
            game_id: parseInt(localStorage.getItem("game_id")),
        };

        window.game_socket.send(JSON.stringify(data));
	}

	draw() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.drawCenterLine();
		this.ball.draw(this.ctx);
		this.leftPaddle.draw(this.ctx);
		this.rightPaddle.draw(this.ctx);
	}

	isGameOver() {
		if (this.leftPaddle.score >= GAME_CONSTANTS.SCORE_TO_WIN || this.rightPaddle.score >= GAME_CONSTANTS.SCORE_TO_WIN)
			return true;

		const timeDiff = new Date() - this.gameStartTime;
		const minutes = Math.floor(timeDiff / 60000);
		return minutes >= GAME_CONSTANTS.TIME_TO_WIN;
	}

	gameLoop = () => {
		this.updateStatsHeader();

		if (this.gameState === "game_over") return;

		this.update();
		this.draw();

		if (this.isGameOver()) {
			this.gameState = "game_over";
			console.log("Game Over");
			
			this.endGame();
			return;
		}

		requestAnimationFrame(this.gameLoop);
	};

	start() {
		this.gameLoop();
	}

	endGame() {
		this.stats.dom.style.display = "none";
		
		const game_id = parseInt(localStorage.getItem("game_id"));
		makeRequest("/api/game/pong/end/", "POST", {
			game_id: game_id,
			score1: this.leftPaddle.score,
			score2: this.rightPaddle.score,
			time: parseInt((new Date() - this.gameStartTime) / 1000)
		})
		.then((data) => {
			const game_page = document.querySelector("game-page");
			if(game_page)
				game_page.display_game_results({ winner: data.winner, loser: data.loser });
		})

		
	}
}

function fullScreen(canvasId) {
	const gameElement = document.getElementById(canvasId);
	if(!gameElement) return;

	const isFullScreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
	
	if(!isFullScreen)
	{
		if (gameElement.requestFullscreen) {
			gameElement.requestFullscreen().catch((err) => {});
		}
	}
	else
	{
		if (document.exitFullscreen) {
			document.exitFullscreen().catch((err) => {});
		}
	}
}

export { PongGame };