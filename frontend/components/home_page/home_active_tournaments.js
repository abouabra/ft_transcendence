export default class Home_Active_Tournaments extends HTMLElement {
	constructor() {
		super();

		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink("/styles/home.css"));

		makeRequest("/api/tournaments/home_active_tournaments/")
		.then((data) => {
			this.render_data(data);
		});
		
		this.innerHTML = /*html*/ `
			<div class="d-flex w-100 justify-content-between">
				<span class="p2_bold">Active Tournaments</span>
				
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

			<div class="active-tournament-list">
			</div>
		`;

		const active_games_list = this.querySelector(".active-tournament-list");

		const home_select = this.querySelector(".home-select");
		home_select.addEventListener("change", (e) => {
			const value = e.target.value;
			makeRequest(`/api/tournaments/home_active_tournaments/?game_name=${value}`)
			.then((data) => {

				active_games_list.classList.add("active-games-list-animation");
				setTimeout(() => {
					active_games_list.classList.remove("active-games-list-animation");
				}, 300);
				this.render_data(data);
			});
		});



		const forward_button = this.querySelector(".forward-button");
		forward_button.addEventListener("click", (e) => {
			const expanded_active_games_container = document.querySelector(".expanded-active-tournaments-container");
			expanded_active_games_container.style.display = "flex";
		});
	}

	render_data(data)
	{
		const active_games_list = this.querySelector(".active-tournament-list");
		


		active_games_list.innerHTML = "";
		data.forEach((item) => {
			active_games_list.innerHTML += /*html*/ `
				<div class="active-games-list-item">
					<img src="${item.tournament_avatar}" alt="avatar" class="active-games-list-item-avatar" />
					<div class="d-flex w-100 flex-column justify-items-center align-items-center" style="max-width: 200px; gap: 5px;">
						<span class="p4_bold platinum_40_color">${item.tournament_game}</span>
						<div class="d-flex" style="gap: 5px;">
							<span class="p4_bold" data-tournament-id=${item.tournament_id} >${item.tournament_name}</span>
						</div>
						<span class="p4_bold platinum_40_color">${item.total_number_of_players} players</span>
					</div>
					<img src="null" alt="avatar" class="active-games-list-item-avatar" style="opacity: 0" />
				</div>
			`;
		});

		const all_tournaments = this.querySelectorAll(".active-games-list-item div div .p4_bold");
		all_tournaments.forEach((tournament) => {
			tournament.addEventListener("click", (e) => {
				const tournament_id = tournament.getAttribute("data-tournament-id");
				GoTo(`/tournament/join/${tournament_id}`);
			});
		});
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("home-active-tournaments", Home_Active_Tournaments);
