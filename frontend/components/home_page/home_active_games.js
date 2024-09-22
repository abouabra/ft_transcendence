export default class Home_Active_Games extends HTMLElement {
	constructor() {
		super();

		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink("/styles/home.css"));

		makeRequest("/api/game/home_active_games/")
		.then((data) => {
			this.render_data(data);
		});
		
		this.innerHTML = /*html*/ `
			<div class="d-flex w-100 justify-content-between">
				<span class="p2_bold">Active Games</span>
				
				<div class="leaderboard_header">
					<select class="home-select p4_regular">
						<option class="p4_regular" value="">All</option>
						<option class="p4_regular" value="pong">Pong</option>
						<option class="p4_regular" value="road_fighter">Road Fighter</option>
						<option class="p4_regular" value="space_invaders">Space Invaders</option>
					</select>
					<div class="forward-button">
						<span class="p4_regular">more</span>
						<img src="/assets/images/common/Iconly/Light/Arrow_Right.svg" alt="forward" style="height: 15px; width: auto" />
					</div>
				</div>
			</div>
			
		
		
			<div class="active-games-list"></div>
		`;

		const active_games_list = this.querySelector(".active-games-list");

		const home_select = this.querySelector(".home-select");
		home_select.addEventListener("change", (e) => {
			const value = e.target.value;
			makeRequest(`/api/game/home_active_games/?game_name=${value}`)
			.then((data) => {

				active_games_list.classList.add("active-games-list-animation");
				setTimeout(() => {
					active_games_list.classList.remove("active-games-list-animation");
				}, 300);
				this.render_data(data);
			});
		});
	}

	render_data(data)
	{
		const active_games_list = this.querySelector(".active-games-list");
		


		active_games_list.innerHTML = "";
		data.forEach((item) => {
			active_games_list.innerHTML += /*html*/ `
				<div class="active-games-list-item">
					<img src="${item.player1.avatar}" alt="avatar" class="active-games-list-item-avatar" />
					<div class="d-flex w-100 flex-column justify-items-center align-items-center" style="max-width: 200px; gap: 5px;">
						<span class="p4_bold platinum_40_color">${item.game_name}</span>
						<div class="d-flex" style="gap: 5px;">
							<span class="p4_bold" data-user-id=${item.player1.id}>${item.player1.username}</span>
							<span class="p4_regular">vs</span>
							<span class="p4_bold" data-user-id=${item.player1.id}>${item.player2.username}</span>
						</div>
						<span class="p4_bold platinum_40_color">${item.player1_score} - ${item.player2_score}</span>
					</div>
					<img src="${item.player2.avatar}" alt="avatar" class="active-games-list-item-avatar" />
				</div>
			`;
		});

		const all_users = this.querySelectorAll(".active-games-list-item div div .p4_bold");
		all_users.forEach((user) => {
			user.addEventListener("click", (e) => {
				const user_id = user.getAttribute("data-user-id");
				GoTo(`/profile/${user_id}`);
			});
		});
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("home-active-games", Home_Active_Games);
