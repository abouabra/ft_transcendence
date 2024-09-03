export default class Friends_Bar extends HTMLElement {
	constructor() {
		super();

		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink("/styles/common.css"));

		const data = [
			{id: 1, name: "User 1",avatar: "/assets/images/about_us/abouabra.png",is_playing: "Pong"},
			{id: 2, name: "User 2",avatar: "/assets/images/about_us/abouabra.png",is_playing: "Space Invaders"},
			{id: 3, name: "User 3",avatar: "/assets/images/about_us/abouabra.png",is_playing: "Road Fighter"},
			{id: 4, name: "User 4",avatar: "/assets/images/about_us/abouabra.png",is_playing: ""},
			{id: 5, name: "User 5",avatar: "/assets/images/about_us/abouabra.png",is_playing: ""},
			{id: 6, name: "User 6",avatar: "/assets/images/about_us/abouabra.png",is_playing: ""},
			{id: 7, name: "User 7",avatar: "/assets/images/about_us/abouabra.png",is_playing: ""},
			{id: 8, name: "User 8",avatar: "/assets/images/about_us/abouabra.png",is_playing: ""},
			{id: 9, name: "User 9",avatar: "/assets/images/about_us/abouabra.png",is_playing: ""},
			{id: 10, name: "User 10",avatar: "/assets/images/about_us/abouabra.png",is_playing: ""},
			{id: 11, name: "User 11",avatar: "/assets/images/about_us/abouabra.png",is_playing: ""},
			{id: 12, name: "User 12",avatar: "/assets/images/about_us/abouabra.png",is_playing: ""},
		];

		this.innerHTML = /*html*/ `
			${data
				.map((item) => {
					return /*html*/ `
						<div class="friends_bar_item">
							<div>
								<img src="${item.avatar}" class="friends_bar_item_icon"/>
								<div class="friends_bar_item_icon_status"></div>
							</div>

							<div class="d-flex jusify-content-center" style="gap: 2px;">
								${
									item.is_playing
										? `<span class="p2_bold" style="white-space: nowrap;">${item.is_playing}</span>`
										: ""
								}
								${
									item.is_playing
										? `<span class="p2_bold" style="white-space: nowrap;">-</span>`
										: ""
								}
								<span class="p2_bold" style="white-space: nowrap;">${item.name}</span>
							</div>

							<div class="options_list">
								<div class="three_dots_container">
									<div class="single_dot"> </div>
									<div class="single_dot"> </div>
									<div class="single_dot"> </div>
								</div>
								<div class="options_list_container">
									<div class="options_list_item" onclick='handle_action("goto_profile", ${item.id})'> 
										<img src="/assets/images/common/Iconly/Bold/Profile.svg" class="options_list_item_icon"/>
										<span class="p2_bold" style="white-space: nowrap;">Go To Profile</span>
									</div>
									<div class="options_list_item" onclick='handle_action("invite_to_game", ${item.id})'>
										<img src="/assets/images/common/Iconly/Bold/Game.svg" class="options_list_item_icon"/>
										<span class="p2_bold" style="white-space: nowrap;">Invite to game</span>
									</div>
									<div class="options_list_item" onclick='handle_action("go_to_direct", ${item.id})'>
										<img src="/assets/images/common/Iconly/Bold/Message.svg" class="options_list_item_icon"/>
										<span class="p2_bold" style="white-space: nowrap;">Send Message</span>
									</div>
								</div>
							</div>
						</div>
					`;
				})
				.join("")}
		`;

		this.addEventListener("mouseleave", () => {
			this.scrollTop = 0;
		});

		const options_list = this.querySelectorAll(".options_list");
		options_list.forEach((item) => {

			const three_dots_container = item.querySelector(".three_dots_container");
			const options_list_container = item.querySelector(".options_list_container");
			
			three_dots_container.addEventListener("click", (e) => {
				if (options_list_container.style.display === "flex") {
					options_list_container.style.display = "none";
				}
				else {
					options_list_container.style.display = "flex";
				}
			});
		});
		

		const all_friends_bar_item = this.querySelectorAll(".friends_bar_item");
		all_friends_bar_item.forEach((item) => {
			item.addEventListener("mouseleave", () => {
				const options_list_container = item.querySelector(".options_list_container");
				options_list_container.style.display = "none";
			});
		});
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("friends-bar", Friends_Bar);
