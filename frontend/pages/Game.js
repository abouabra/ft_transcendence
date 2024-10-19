import { Player } from '/assets/games/space_invaders/js/Player.js';
import { Opponent } from '/assets/games/space_invaders/js/Opponent.js';
import { Setup } from '/assets/games/space_invaders/js/Setup.js';

export default class Game_Page extends HTMLElement {
	constructor() {
		super();

		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/game_page.css'));

		const game_id = window.location.pathname.split("/")[3];
		localStorage.setItem("game_id", game_id);

		makeRequest(`/api/game/get_game_info/${game_id}`)
		.then((data) => {
			if(data.response_code == 404)
			{
				this.innerHTML = /* html */`
					<h1> Game not found</h1>
				`;
				return;		
			}

			this.render_data(data);
		});

		
	}	


	render_data(data)
	{
		console.log(data);
		const current_id = parseInt(localStorage.getItem("id"));
		
		if(data.player2.id == current_id)
		{
			let tmp = data.player2;
			data.player2 = data.player1;
			data.player1 = tmp;
		}


		this.innerHTML = /* html */`
			<div class="game-page-header platinum_40_color_border blur">
				<div class="game-page-user-data-container" data-user-id="${data.player1.id}">
					<img src="${data.player1.avatar}" alt="game image" class="game-page-user-data-image">
					<div class="game-page-user-data">
						<span class="p3_bold platinum_40_color">username</span>
						<span class="header_h3">${data.player1.username}</span>
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
						<span class="header_h3">${data.player2.username}</span>
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

		const user_1_score = this.querySelector("#game-page-user-1-score");
		const user_2_score = this.querySelector("#game-page-user-2-score");

		if(data.game_name == "space_invaders")
		{
			this.space_invaders();
		}

	}

	space_invaders()
	{
		const game_canvas = this.querySelector("#game-canvas");
		game_canvas.innerHTML = /* html */`
			<div class="game-page-stats-container">
				<div class="game-page-stats-part">
					<img src="/assets/games/space_invaders/ui/heart.svg" alt="heart" style="width: 16px;"></img>
					<div class="progress" role="progressbar" aria-label="Animated striped example"  aria-valuemin="0" aria-valuemax="100" style="width: 200px;" id="powerup_health">
						<div class="progress-bar progress-bar-striped progress-bar-animated bg-success" style="width: 100%"><span>100</span></div>
					</div>
				</div>

				<div class="game-page-stats-part">
					<img src="/assets/games/space_invaders/ui/rocket.svg" alt="rocket" style="width: 16px;"></img>
					<div class="progress" role="progressbar" aria-label="Animated striped example"  aria-valuemin="0" aria-valuemax="100" style="width: 200px;" id="powerup_boost">
						<div class="progress-bar progress-bar-striped progress-bar-animated bg-info" style="width: 100%"><span>100</span></div>
					</div>
				</div>

				<div class="game-page-stats-part">
					<img src="/assets/games/space_invaders/ui/damage.svg" alt="damage" style="width: 16px;"></img>
					<span id="powerup_damage"> x 1 </span>
				</div>

				<div class="game-page-stats-part">
					<img src="/assets/games/space_invaders/ui/speed.svg" alt="speed" style="width: 16px;" ></img>
					<span id="powerup_speed"> x 1 </span>
				</div>
			</div>
		`;
				
		this.player = new Player();
		this.opponent = new Opponent();

		this.setup = new Setup(this.player, this.opponent);

		this.player.setSetup(this.setup);
		this.opponent.setSetup(this.setup);

		window.game_socket.onmessage = function (event) {
			const data = JSON.parse(event.data);
			console.log("data from game.js", data);

			if(data.type == "si_receive_data_from_server")
			{
				console.log("received data from server", data);
			}

		};
	}

	connectedCallback() {}

	disconnectedCallback() {
		console.log("disconnected from game page");
		window.game_socket.close();
		delete window.game_socket;
		
		this.player.isAlive = false;

		delete this.player;
		delete this.opponent;
		delete this.setup;
	}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("game-page", Game_Page);
