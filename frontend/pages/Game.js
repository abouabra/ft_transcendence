import { Player } from '/assets/games/space_invaders/js/Player.js';
import { Opponent } from '/assets/games/space_invaders/js/Opponent.js';
import { Setup } from '/assets/games/space_invaders/js/Setup.js';

import { PongGame } from '/assets/games/pong/pong.js';

export default class Game_Page extends HTMLElement {
	constructor() {
		super();

		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/game_page.css'));
			

		const game_id = window.location.pathname.split("/")[3];
		localStorage.setItem("game_id", game_id);

		// pong game
		this.game = null;

		// space invaders game
		this.player = null;
		this.opponent = null;
		this.setup =  null;

		// shared
		this.player1_score = null;
		this.player2_score = null;

		makeRequest(`/api/game/get_game_info/${game_id}`)
		.then((data) => {
			if(data.response_code == 404)
			{
				this.innerHTML = /* html */`
					<h1> Game not found</h1>
				`;
				return;		
			}

			console.log("makeRequest /api/game/get_game_info ",data);

			if(data.has_ended == true)
			{
				showToast("error", "Game is already over");
				GoTo("/play/");
				return;
			}

			this.starting_time = new Date().getTime();
			localStorage.setItem("starting_time", this.starting_time);

			this.game_name = data.game_name;
			this.game_type = data.game_type;
			
			// this.display_game_results({
			// 	winner: data.player1,
			// 	loser: data.player2
			// })
			
			this.render_data(data);

		})
		.catch((error) => {
			console.log("Game.js error", error);
			showToast("error", "You are not part of this game");
			GoTo("/play/");
			return;
		});
	
		
		
	}	


	render_data(data)
	{
		const current_id = parseInt(localStorage.getItem("id"));
		
		localStorage.setItem("player1_id", data.player1.id);
		localStorage.setItem("player2_id", data.player2.id);


		if(data.player2.id == current_id)
		{
			let tmp = data.player2;
			data.player2 = data.player1;
			data.player1 = tmp;
		}
		
		localStorage.setItem("opponent_id", data.player2.id);


		this.innerHTML = /* html */`
			<div class="game-page-header platinum_40_color_border blur">
				<div class="game-page-user-data-container" data-user-id="${data.player1.id}">
					<img src="${data.player1.avatar}" alt="game image" class="game-page-user-data-image">
					<div class="game-page-user-data">
						<span class="p3_bold platinum_40_color">username</span>
						<span class="header_h3 game-page-header-users-highlight">${data.player1.username}</span>
					</div>
				</div>

				<div class="game-page-header-center">
					<div class="game-page-user-data">
						<span class="p3_bold platinum_40_color">user 1 score</span>
						<span class="header_h3" id="game-page-user-1-score">0</span>
					</div>

					<div class="game-page-user-data">
						<span class="p3_bold platinum_40_color">duration</span>
						<span class="header_h3" id="game-page-game-timer">00 : 00</span>
					</div>
					
					<div class="game-page-user-data">
						<span class="p3_bold platinum_40_color">user 2 score</span>
						<span class="header_h3" id="game-page-user-2-score">0</span>
					</div>
				</div>
				
				<div class="game-page-user-data-container" data-user-id="${data.player2.id}">
					<div class="game-page-user-data">
						<span class="p3_bold platinum_40_color">username</span>
						<span class="header_h3 game-page-header-users-highlight">${data.player2.username}</span>
					</div>
					<img src="${data.player2.avatar}" alt="game image" class="game-page-user-data-image">
				</div>
			</div>

			<div class="game-page-body platinum_40_color_border" id="game-canvas"> </div>
		`;

		const all_users = this.querySelectorAll(".game-page-user-data-container");
		all_users.forEach((user) => {
			const avatar = user.querySelector(".game-page-user-data-image");
			const username = user.querySelector(".header_h3");
			const user_id = user.getAttribute("data-user-id");

			avatar.addEventListener("click", () => {
				GoTo(`/profile/${user_id}`);
			});

			username.addEventListener("click", () => {
				GoTo(`/profile/${user_id}`);
			});
		});

		this.player1_score = this.querySelector("#game-page-user-1-score");
		this.player2_score = this.querySelector("#game-page-user-2-score");

		if(data.game_name == "space_invaders")
			this.space_invaders();
		else if(data.game_name == "pong")
			this.pong(data.game_type);


		if(!window.game_socket) return;

		// remove the old event listener and add a new one
		window.game_socket.onmessage = null;
		window.game_socket.onmessage = (event) => {
			const response = JSON.parse(event.data);
			// console.log("Game.js onmessage", response);

			if(response.type == "start_game") 
			{
				const current_id = localStorage.getItem("id");
				localStorage.setItem("initial_data", JSON.stringify(response.initial_data[current_id]));
			}
			if(response.type == "si_from_server_to_client")
			{
				if(this.game_name == "space_invaders" && this.opponent.mesh && response.data.position && response.data.quaternion)
				{
					this.opponent.ws_update(response.data.position, response.data.quaternion);
					this.player.health = response.health;
					this.setup.opponent.score = response.data.score;
					this.player2_score.innerText = response.data.score;
				}

				if(this.game_name == "pong" && response.data)
				{
					this.game.ws_update(response.data);
				}

			}
			else if(response.type == "game_over")
			{
				console.log("Game Over onmessage");

				console.log("Game Over winner is", response.winner);
				console.log("Game Over loser is", response.loser);
				
				if(this.game_name == "pong")
				{
					this.game.gameState = "game_over"
					this.game.stats.dom.style.display = "none";
				}

				if(this.player)
					this.player.isAlive = false;
				
				window.game_socket.onmessage = null;
				window.game_socket.close();
				delete window.game_socket;
				window.game_socket = null;

				if(this.setup && this.setup.opponentTracker)
				{
					this.setup.opponentTracker.destroy();
					this.setup.opponentTracker = null;
				}
				let game_id = parseInt(localStorage.getItem("game_id"));

				localStorage.removeItem("game_id");
				localStorage.removeItem("opponent_id");
				localStorage.removeItem("player1_id");
				localStorage.removeItem("player2_id");
				localStorage.removeItem("starting_time");
				localStorage.removeItem("initial_data");

				makeRequest(`/api/game/get_game_info/${game_id}`)
				.then((data) => {
					if(data.response_code == 404)
					{
						this.innerHTML = /* html */`
							<h1> Game not found</h1>
						`;
						return;		
					}
					if(data.isTournemantMatch == true)
					{
						makeRequest(`/api/tournaments/get_tournament_info/${data.tournament_id}`).then(data=>{
							GoTo(`/tournament/match/?tournament_name=${data.name}`);
						})
					}
					else
						this.display_game_results(response);
				});

				// this.display_game_results(response);

			}
		};
	}

	space_invaders()
	{
		const game_canvas = this.querySelector("#game-canvas");
		game_canvas.innerHTML = /* html */`
			<div class="game-page-stats-container">
				<div class="game-page-stats-part">
					<img src="/assets/games/space_invaders/ui/heart.svg" alt="heart" style="width: 16px;">
					<div class="progress" role="progressbar" aria-label="Animated striped example"  aria-valuemin="0" aria-valuemax="2000" style="width: 200px;" id="powerup_health">
						<div class="progress-bar progress-bar-striped progress-bar-animated bg-success" style="width: 100%"><span>2000</span></div>
					</div>
				</div>

				<div class="game-page-stats-part">
					<img src="/assets/games/space_invaders/ui/rocket.svg" alt="rocket" style="width: 16px;">
					<div class="progress" role="progressbar" aria-label="Animated striped example"  aria-valuemin="0" aria-valuemax="100" style="width: 200px;" id="powerup_boost">
						<div class="progress-bar progress-bar-striped progress-bar-animated bg-info" style="width: 100%"><span>100</span></div>
					</div>
				</div>

				<div class="game-page-stats-part">
					<img src="/assets/games/space_invaders/ui/damage.svg" alt="damage" style="width: 16px;">
					<span id="powerup_damage"> x 1 </span>
				</div>

				<div class="game-page-stats-part">
					<img src="/assets/games/space_invaders/ui/speed.svg" alt="speed" style="width: 16px;" >
					<span id="powerup_speed"> x 1 </span>
				</div>
			</div>
		`;

		
		this.player = new Player();
		this.opponent = new Opponent();

		this.setup = new Setup(this.player, this.opponent);

		this.player.setSetup(this.setup);
		this.opponent.setSetup(this.setup);


		
	}

	pong(game_type) {
		const game_canvas = this.querySelector("#game-canvas");
		game_canvas.innerHTML = /* html */`
			<canvas id="pong-canvas"></canvas>
		`;

		this.game = new PongGame("pong-canvas", game_type);
		this.game.start();
	}

	display_game_results(result)
	{
		const isDraw = result.draw || false;

		this.innerHTML += /* html */`
			<div class="display_game_results_bg">
				<div class="display_game_results_container">
					<div class="display_game_results_winner">
						${isDraw ?  /* html */ `
							<span class="winner_header" style="color: var(--blue);">Draw</span>
							` :  /* html */ `
							<span class="winner_header">Winner</span>
						`}
						<img src="${result.winner.avatar}" alt="winner avatar" class="display_game_results_winner_avatar">
						<span class="header_h1">${result.winner.username}</span>
					</div>
					${isDraw ?  /* html */ `
						<div class="display_game_results_winner">
							<span class="winner_header" style="color: var(--blue);">Draw</span>
							<img src="${result.loser.avatar}" alt="loser avatar" class="display_game_results_winner_avatar">
							<span class="header_h1">${result.loser.username}</span>
						</div>
						` :  /* html */ `
						<div class="display_game_results_loser">
							<span class="loser_header">Loser</span>
							<img src="${result.loser.avatar}" alt="loser avatar" class="display_game_results_loser_avatar">
							<span class="p2_bold">${result.loser.username}</span>
						</div>
					`}

					<button-component data-text="Go to winner profile" onclick="GoTo('/profile/${result.winner.id}')"></button-component>
				</div>
			</div>
		`;
	}


	connectedCallback() {}

	disconnectedCallback() {
		
		
		if(this.game && this.game_type == "local")
		{
			console.log("disconnected from game page");
			if(this.game.leftPaddle.score == this.game.rightPaddle.score)
				this.game.rightPaddle.score += 1;

			this.game.endGame();
			return;
		}
		if(this.game && this.game.stats)
		{
			this.game.gameState = "game_over"
			this.game.stats.dom.style.display = "none";
		}


		if(this.setup && this.setup.opponentTracker)
		{
			this.setup.opponentTracker.destroy();
			this.setup.opponentTracker = null;
		}

		if(!window.game_socket)
		{
			localStorage.removeItem("game_id");
			localStorage.removeItem("opponent_id");
			localStorage.removeItem("player1_id");
			localStorage.removeItem("player2_id");
			localStorage.removeItem("starting_time");
			localStorage.removeItem("initial_data");
			return;
		}

		console.log("disconnected from game page");
		const uid = parseInt(localStorage.getItem("id"));

		const current_time = new Date().getTime();
		const delta_time_in_sec = (current_time - this.starting_time) / 1000;
		console.log("delta time in seconds", delta_time_in_sec);


		window.game_socket.send(JSON.stringify({
			type: "game_over",
			user_id: uid,
			game_room_id: parseInt(localStorage.getItem('game_id')),
			game_time : delta_time_in_sec,
			is_interupted: true
		}));

		
		localStorage.removeItem("game_id");
		localStorage.removeItem("opponent_id");
		localStorage.removeItem("player1_id");
		localStorage.removeItem("player2_id");
		localStorage.removeItem("starting_time");
		localStorage.removeItem("initial_data");


		window.game_socket.onmessage = null;
		window.game_socket.close();
		delete window.game_socket;
		window.game_socket = null;
		
		if(this.player) this.player.isAlive = false;

		if(this.player) delete this.player;
		if(this.opponent) delete this.opponent;
		if(this.setup) delete this.setup;
	}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("game-page", Game_Page);
