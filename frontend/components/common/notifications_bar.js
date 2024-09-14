export default class Notifications_Bar extends HTMLElement {
	constructor() {
		super();

		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink("/styles/common.css"));

		makeRequest("/api/auth/notifications_brief/")
		.then((data) => {

			this.innerHTML = /*html*/ `
				<div class="notifications_bar_icon">
					<img src="/assets/images/common/Iconly/Light/Notification.svg" alt="search" class="notifications_bar_icon_img">

					${data.total_unread_notifications == 0 ? 
						/*html*/ `
							<div class="notifications_bar_status hide">
								<span class="p5_regular">${data.total_unread_notifications}</span>	
							</div> 
						` : 
						/*html*/ `
							<div class="notifications_bar_status">
								<span class="p5_regular">${data.total_unread_notifications}</span>	
							</div> 
					`}
				</div>
						


				<div class="notifications_bar_options">
					<div class="notifications-bar-option-items justify-content-center">
						<span class="p2_bold"> See all notifications </span>
					</div>
				</div>
			`;

			const notifications_bar_icon = this.querySelector(".notifications_bar_icon");
			const notifications_bar_options = this.querySelector(".notifications_bar_options");
			notifications_bar_icon.addEventListener("click", () => {
				
				if (!notifications_bar_options.classList.contains("show")) {
					this.getNotifications();
				}
	
				notifications_bar_options.classList.toggle("show");
	
	
				navbar_check_only_one_active("notifications_bar_options");
			});

			document.addEventListener('click', (event) => {
				if (!notifications_bar_options.contains(event.target) && !notifications_bar_icon.contains(event.target))
				{
					notifications_bar_options.classList.remove("show");
				}
			});
			

		}).catch(error => {
			showToast("error", error);
		});
	}


	getNotifications () {
		makeRequest("/api/auth/notifications_brief/")
		.then((data) => {

			const notifications_bar_status = this.querySelector(".notifications_bar_status");
			if (notifications_bar_status) {
				const span_count = notifications_bar_status.querySelector("span");
				var count = parseInt(span_count.textContent);
				count = count - data.unread_notifications;
				span_count.textContent = count;
				if (count < 0)
					count = 0;
				span_count.textContent = count;

				if(count == 0)
					notifications_bar_status.style.display = "none";
			}
			
			const notifications_bar_options = this.querySelector(".notifications_bar_options");
			notifications_bar_options.innerHTML = /*html*/ `
					${
						data.notifications.map((item) => {

							let message;

							if (item.type == "friend_request") {
								message = `
									<span class="p4_regular"><span class="p4_bold">${item.sender.username}</span> sent you a friend request</span>
								`;
							} else if (item.type == "game_invitation") {
								message = `<span class="p4_regular"><span class="p4_bold">${item.sender.username}</span> sent you a game invitation</span>`;
							}
							else if (item.type == "congrats") {
							    message = `<span class="p4_regular"><span class="p4_bold">Congratulations! You've advanced to 1000 Elo.</span>`;
							}
							else if (item.type == "strike") {
								message = `<span class="p4_bold" style="color: var(--red)">Warning! You've received a strike.</span>`;
							}


							return /*html*/ `
								<div class="notifications-bar-option-items">
									<div style="position: relative">
										<img src="${item.sender.avatar}" class="friends_bar_item_icon"/>
										${item.sender.status == "online" ? 
											/*html*/ `<div class="friends_bar_item_icon_status online_status"></div>`: 
											/*html*/ `<div class="friends_bar_item_icon_status offline_status"></div>`
										}
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

					<div class="notifications-bar-option-items justify-content-center" id="see_all_notifications">
						<span class="p2_bold" > See all notifications </span>
					</div>
			`;

			

			const see_all_notifications = document.getElementById("see_all_notifications");
			see_all_notifications.addEventListener("click", () => {

				const notifications_bar_options = document.querySelector(".notifications_bar_options");
				notifications_bar_options.classList.remove("show");
				
				GoTo('/notifications/')
			});

		}).catch(error => {
			showToast("error", error);
		});

		
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("notifications-bar", Notifications_Bar);
