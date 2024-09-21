export default class Home_Leaderboard extends HTMLElement {
	constructor() {
		super();

		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink("/styles/home.css"));

		this.index = 0;

		this.data = [
			[
				{id: 1, name: "EpicGamer", avatar: "/assets/images/avatars/abouabra.png"},
				{id: 2, name: "PixelWarrior", avatar: "/assets/images/avatars/default.jpg"},
				{id: 3, name: "ThunderStrike", avatar: "/assets/images/avatars/abouabra.png"},
			],
			[
				{id: 1, name: "qqqqq", avatar: "/assets/images/avatars/default.jpg"},
				// {id: 2, name: "blalal", avatar: "/assets/images/avatars/abouabra.png"},
				{id: 3, name: "vssvsl", avatar: "/assets/images/avatars/abouabra.png"},
			],
			[
				{id: 1, name: "bbb", avatar: "/assets/images/avatars/abouabra.png"},
				// {id: 2, name: "cccc", avatar: "/assets/images/avatars/abouabra.png"},
				// {id: 3, name: "qlslslslq", avatar: "/assets/images/avatars/default.jpg"},
			],
		];

		this.render_data();

	}

	render_data()
	{

		this.innerHTML = /*html*/ `
		<div class="d-flex w-100 justify-content-between">
			<span class="p2_bold">Leaderboard</span>
			
			<div class="forward-button">
				<span class="p4_regular">more</span>
				<img src="/assets/images/common/Iconly/Light/Arrow_Right.svg" alt="forward" style="height: 15px; width: auto" />
			</div>
		</div>

		<div class="home-leaderboard-list">
			${
				this.data[this.index].map((item, index) => {
					return /*html*/`
					<div class="d-flex w-100 justify-content-between align-items-center home-leaderboard-item" data-id="${item.id}">
						<span class="p4_bold">${index + 1}</span>
						<img src="${item.avatar}" alt="${item.name}" class="home-leaderboard-image" />
						<div class="d-flex justify-content-center align-items-center" style="width: 200px;">
							<span class="p4_bold">${item.name}</span>
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
	

	setInterval(() => {
		const home_leaderboard_list = this.querySelector(".home-leaderboard-list");
		
		this.index = (this.index + 1) % 3;

		home_leaderboard_list.classList.add("home-leaderboard-list-animation");

		setTimeout(() => {
			home_leaderboard_list.classList.remove("home-leaderboard-list-animation");
		}, 300);

		setTimeout(() => {
			home_leaderboard_list.innerHTML = /*html*/ `
				${
					this.data[this.index].map((item, index) => {
						return /*html*/`
						<div class="d-flex w-100 justify-content-between align-items-center home-leaderboard-item" data-id="${item.id}">
							<span class="p4_bold">${index + 1}</span>
							<img src="${item.avatar}" alt="${item.name}" class="home-leaderboard-image" />
							<div class="d-flex justify-content-center align-items-center" style="width: 200px;">
								<span class="p4_bold">${item.name}</span>
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
		
	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("home-leaderboard", Home_Leaderboard);
