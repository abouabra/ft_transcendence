export default class Friends_Bar extends HTMLElement {
	constructor() {
		super();

		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink("/styles/common.css"));

		makeRequest("/api/auth/friends_bar/")
		.then((data) => {
			// const tt = [
			// 	{id: 1, username: "admin",avatar: "/assets/images/avatars/default.jpg",is_playing: "Pong"},
			// 	{id: 2, username: "User 2",avatar: "/assets/images/about_us/abouabra.png",is_playing: "Space Invaders"},
			// 	{id: 3, username: "User 3",avatar: "/assets/images/about_us/abouabra.png",is_playing: "Road Fighter"},
			// 	{id: 4, username: "User 4",avatar: "/assets/images/about_us/abouabra.png",is_playing: ""},
			// 	{id: 5, username: "User 5",avatar: "/assets/images/about_us/abouabra.png",is_playing: ""},
			// 	{id: 6, username: "User 6",avatar: "/assets/images/about_us/abouabra.png",is_playing: ""},
			// 	{id: 7, username: "User 7",avatar: "/assets/images/about_us/abouabra.png",is_playing: ""},
			// 	{id: 8, username: "User 8",avatar: "/assets/images/about_us/abouabra.png",is_playing: ""},
			// 	{id: 9, username: "User 9",avatar: "/assets/images/about_us/abouabra.png",is_playing: ""},
			// 	{id: 10, username: "User 10",avatar: "/assets/images/about_us/abouabra.png",is_playing: ""},
			// 	{id: 11, username: "User 11",avatar: "/assets/images/about_us/abouabra.png",is_playing: ""},
			// 	{id: 12, username: "User 12",avatar: "/assets/images/about_us/abouabra.png",is_playing: ""},
			// ];
			console.log(data);
			this.render_data(data);
		})
		.catch((error) => {
			showToast("error", error);
		});

		

		
	}

	render_data(data)
	{
		this.innerHTML = /*html*/ `
			${data
				.map((item) => {
					return /*html*/ `
						<div class="friends_bar_item" data-link="/profile/${item.id}">
							<div>
								<img src="${item.avatar}" class="friends_bar_item_icon"/>
								<div class="friends_bar_item_icon_status"></div>
								${
									item.is_playing ? /*html*/ `
									<div class="in_game_bar">
										<span class="in_game_bar_text" style="white-space: nowrap;">In Game</span>
									</div>
									` : ""
								}
								</div>

							<div class="d-flex jusify-content-center" style="gap: 5px;">
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
								<span class="p2_bold" style="white-space: nowrap;">${item.username}</span>
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
									<div class="options_list_item" onclick='handle_action("go_to_direct", ${item.id})'>
										<img src="/assets/images/common/Iconly/Bold/Message.svg" class="options_list_item_icon"/>
										<span class="p2_bold" style="white-space: nowrap;">Send Message</span>
									</div>
									<div class="options_list_item" onclick='handle_action("invite_to_pong", ${item.id}, ${JSON.stringify({username: item.username, avatar: item.avatar})})'>
										<img src="/assets/images/common/Iconly/Bold/Game.svg" class="options_list_item_icon"/>
										<span class="p2_bold" style="white-space: nowrap;">Invite to Pong</span>
									</div>
									<div class="options_list_item" onclick='handle_action("invite_to_space_invaders", ${item.id}, ${JSON.stringify({username: item.username, avatar: item.avatar})})'>
										<img src="/assets/images/common/Iconly/Bold/Game.svg" class="options_list_item_icon"/>
										<span class="p2_bold" style="white-space: nowrap;">Invite to Space Invaders</span>
									</div>
									<div class="options_list_item" onclick='handle_action("invite_to_road_fighter", ${item.id}, ${JSON.stringify({username: item.username, avatar: item.avatar})})'>
										<img src="/assets/images/common/Iconly/Bold/Game.svg" class="options_list_item_icon"/>
										<span class="p2_bold" style="white-space: nowrap;">Invite to Road Fighter</span>
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
			item.addEventListener("click", () => {
				const link = item.getAttribute("data-link");
				GoTo(link);
			});

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
