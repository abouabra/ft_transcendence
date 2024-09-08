export default class Notifications_Bar extends HTMLElement {
	constructor() {
		super();

		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink("/styles/common.css"));

		const data = [
			{"type": "game_invitation", "user_id": 1, "user_name": "user 1", "user_status": "online", "user_avatar":  "/assets/images/about_us/abouabra.png"},
			{"type": "friend_request", "user_id": 2, "user_name": "user 2", "user_status": "offline", "user_avatar":  "/assets/images/about_us/abouabra.png"},
			{"type": "congrats", "user_id": 3, "user_name": "user 3", "user_status": "online", "user_avatar":  "/assets/images/about_us/abouabra.png"},
			{"type": "strike", "user_id": 4, "user_name": "user 4", "user_status": "offline", "user_avatar":  "/assets/images/about_us/abouabra.png"},
			{"type": "game_invitation", "user_id": 5, "user_name": "user 5", "user_status": "offline", "user_avatar":  "/assets/images/about_us/abouabra.png"},
		];



		this.innerHTML = /*html*/ `
			<div class="notifications_bar_icon">
				<img src="/assets/images/common/Iconly/Light/Notification.svg" alt="search" class="notifications_bar_icon_img">
				<div class="notifications_bar_status"> </div>
			</div>

			<div class="notifications_bar_options">
				${
					data.map((item) => {

						let message;

						if (item.type == "friend_request") {
							message = `

								<span class="p4_regular"><span class="p4_bold">${item.user_name}</span> sent you a friend request</span>
							
							`;
						} else if (item.type == "game_invitation") {
                            message = `<span class="p4_regular"><span class="p4_bold">${item.user_name}</span> sent you a game invitation</span>`;
                        }
						else if (item.type == "congrats") {
                            message = `<span class="p4_regular"><span class="p4_bold">Congratulations! You've advanced to 1000 Elo.</span>`;
                        } else if (item.type == "strike") {
                            message = `<span class="p4_bold" style="color: var(--red)">Warning! You've received a strike.</span>`;
                        }


						return /*html*/ `
							<div class="notifications-bar-option-items">
								<div style="position: relative">
									<img src="${item.user_avatar}" class="friends_bar_item_icon"/>
									<div class="friends_bar_item_icon_status"></div>
								</div>


								<div class="d-flex align-items-center" style="gap: 2px">
									<div class="d-flex flex-column"> 
										${message}
									</div>
								</div>

							</div>
					`
					}).join("")

					
				}

				<div class="notifications-bar-option-items justify-content-center">
					<span class="p2_bold" onclick='handle_action("goto_notifications", null)'> See all notifications </span>
				</div>
			
			</div>
		`;

		const notifications_bar_icon = this.querySelector(".notifications_bar_icon");
		const notifications_bar_options = this.querySelector(".notifications_bar_options");

		notifications_bar_icon.addEventListener("click", () => {
			notifications_bar_options.classList.toggle("show");
		});
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("notifications-bar", Notifications_Bar);
