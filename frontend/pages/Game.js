
export default class Game_Page extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/game_page.css'));

		const game_id = window.location.pathname.split("/")[3];

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

			<div class="game-page-body platinum_40_color_border">
			</div>
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
		const game_timer = this.querySelector("#game-page-game-timer");


		let minutes = 0;
		let seconds = 0;

		function updateTimer() {
			seconds++;
			if (seconds === 60) {
				seconds = 0;
				minutes++;
			}

			let minutesDisplay = minutes < 10 ? '0' + minutes : minutes;
			let secondsDisplay = seconds < 10 ? '0' + seconds : seconds;

			game_timer.textContent = minutesDisplay + ' : ' + secondsDisplay;
		}

		setInterval(updateTimer, 1000);




	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("game-page", Game_Page);
