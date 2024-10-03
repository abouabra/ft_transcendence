export default class Home_Leaderboard extends HTMLElement {
	constructor() {
		super();

		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink("/styles/home.css"));

		makeRequest("/api/game/home_leaderboard/")
		.then((data) => {
			this.data = data;
			this.index = 0;
			this.render_data();
		});


		this.innerHTML = /*html*/ `
			<div class="d-flex w-100 justify-content-between">
				<div class="leaderboard_header">
					<span class="p2_bold">Top 3 Leaderboard</span>
					<span class="p3_regular platinum_40_color">Pong</span>
				</div>

				<div class="forward-button">
					<span class="p4_regular">more</span>
					<img src="/assets/images/common/Iconly/Light/Arrow_Right.svg" alt="forward" style="height: 15px; width: auto" />
				</div>
			</div>

			<div class="home-leaderboard-list"></div>
		`;
		
		this.data = [];
		this.game_names = ["Pong", "Space Invaders", "Road Fighter"];
		this.index = 0;

		setInterval(() => {
			const home_leaderboard_list = this.querySelector(".home-leaderboard-list");
			
			this.index = (this.index + 1) % 3;
			
			const leaderboard_header_game_selector = this.querySelector(".leaderboard_header .p3_regular");
			leaderboard_header_game_selector.innerHTML = this.game_names[this.index];
	
			home_leaderboard_list.classList.add("home-leaderboard-list-animation");
	
			setTimeout(() => {
				home_leaderboard_list.classList.remove("home-leaderboard-list-animation");
			}, 300);
	
			setTimeout(() => {			
				home_leaderboard_list.innerHTML = /*html*/ `
					${
						this.data[this.index]?.map((item, index) => {
							return /*html*/`
							<div class="d-flex w-100 justify-content-between align-items-center home-leaderboard-item" data-id="${item.id}">
								<span class="p4_bold">${index + 1}</span>
								<img src="${item.avatar}" alt="${item.username}" class="home-leaderboard-image" />
								<div class="d-flex justify-content-center align-items-center" style="width: 100%;max-width: 200px">
									<span class="p4_bold">${item.username}</span>
								</div>
							</div>
						`}).join("")
					}
				`;
	
				const all_leaderboard_items = this.querySelectorAll(".home-leaderboard-item");
				all_leaderboard_items.forEach((item) => {
					item.addEventListener("click", () => {
						const user_id = item.getAttribute("data-id");
						GoTo(`/profile/${user_id}`);
					});
				});
			}, 150);
	
		}, 2000);


	}

	render_data()
	{

		this.innerHTML = /*html*/ `
			<div class="d-flex w-100 justify-content-between">
				<div class="leaderboard_header">
					<span class="p2_bold">Top 3 Leaderboard</span>
					<span class="p3_regular platinum_40_color">Pong</span>
				</div>

				<div class="forward-button">
					<span class="p4_regular">more</span>
					<img src="/assets/images/common/Iconly/Light/Arrow_Right.svg" alt="forward" style="height: 15px; width: auto" />
				</div>
			</div>

			<div class="home-leaderboard-list">
				${
					this.data[this.index]?.map((item, index) => {
						return /*html*/`
						<div class="d-flex w-100 justify-content-between align-items-center home-leaderboard-item" data-id="${item.id}">
							<span class="p4_bold">${index + 1}</span>
							<img src="${item.avatar}" alt="${item.username}" class="home-leaderboard-image" />
							<div class="d-flex justify-content-center align-items-center" style="width: 100%;max-width: 200px">
								<span class="p4_bold">${item.username}</span>
							</div>
						</div>
					`}).join("")
				}
			</div>
		`;

		const forward_button = this.querySelector(".forward-button");
		forward_button.addEventListener("click", () => {
			GoTo("/leaderboard/");
		});
		
		const all_leaderboard_items = this.querySelectorAll(".home-leaderboard-item");
		all_leaderboard_items.forEach((item) => {
			item.addEventListener("click", () => {
				const user_id = item.getAttribute("data-id");
				GoTo(`/profile/${user_id}`);
			});
		});
	}
		
	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("home-leaderboard", Home_Leaderboard);
