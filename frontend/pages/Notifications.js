
export default class Notifications_Page extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/notifications_page.css'));
		head.appendChild(createLink("/styles/home.css"));

		makeRequest('/api/auth/notifications/')
		.then((response) => {
			console.log(response);

			this.innerHTML = /* html */`
				<div class="notifications_page_container blur platinum_40_color_border"> 
					<span class="header_h1">Notifications</span>
					
					<div class="notifications_page_content">
					</div>

					<div class="pagination-container" style="gap: 5px;">
						<div class="pagination-item-arrow pagination-active">
							<span class="p4_bold"><</span>
						</div>


						<div class="pagination-item pagination-active">
							<span class="p4_bold">1</span>
						</div>

						<div class="pagination-item">
							<span class="p4_bold">2</span>
						</div>

						<div class="pagination-item">
							<span class="p4_bold">3</span>
						</div>


						<div class="pagination-item-arrow pagination-active">
							<span class="p4_bold">></span>
						</div>
					</div>
				</div>
			`;

			const active_games_list = this.querySelector(".notifications_page_content");
			const items_per_page = 10;
			const pagination_arrow_left = this.querySelector(".pagination-item-arrow:first-child");
			const pagination_arrow_right = this.querySelector(".pagination-item-arrow:last-child");
			const pagination_items = this.querySelectorAll(".pagination-item .p4_bold");

			const updatePaginationDisplay = () => {
				pagination_items.forEach((item, index) => {
					const page_number = this.current_page + index;
					item.innerText = page_number;
		
					// Hide items outside the range
					if (page_number > this.max_page_number || page_number < 1) {
						item.parentElement.style.display = "none";
					} else {
						item.parentElement.style.display = "flex";
					}
				});
		
				// Hide/show arrows based on current page position
				pagination_arrow_left.style.display = this.current_page === 1 ? "none" : "flex";
				pagination_arrow_right.style.display = this.current_page >= this.max_page_number ? "none" : "flex";
			};


			this.current_page = 1;
			this.max_page_number = Math.ceil(response.count / items_per_page);


			// Initialize pagination
			updatePaginationDisplay();
	
			// Handle previous page click (decrement by 1)
			pagination_arrow_left.addEventListener("click", () => {
				if (this.current_page > 1) {
					this.current_page -= 1; // Decrement by 1
					updatePaginationDisplay();
	
					pagination_items.forEach((item) => item.parentElement.classList.remove("pagination-active"));
					pagination_items[0].parentElement.classList.add("pagination-active");
	
					const selected_page = this.current_page;
					if (selected_page <= this.max_page_number) {
	
						// Update URL with the selected page
						const url_with_page = `/api/auth/notifications/?page=${this.current_page}`;
	
						// Make the API request for the selected page
						makeRequest(url_with_page).then((response) => {
							this.max_page_number = Math.ceil(response.count / items_per_page);
				

	
							active_games_list.classList.add("active-games-list-animation");
							setTimeout(() => {
								active_games_list.classList.remove("active-games-list-animation");
							}, 300);
	
							this.render_data(response);
						});
					}
				}
			});
	
			// Handle next page click (increment by 1)
			pagination_arrow_right.addEventListener("click", () => {
				if (this.current_page < this.max_page_number) {
					this.current_page += 1; // Increment by 1
					updatePaginationDisplay();
	
					pagination_items.forEach((item) => item.parentElement.classList.remove("pagination-active"));
					pagination_items[0].parentElement.classList.add("pagination-active");
	
					const selected_page = this.current_page;
					if (selected_page <= this.max_page_number) {
	
						// Update URL with the selected page
						const url_with_page = `/api/auth/notifications/?page=${this.current_page}`;
	
						// Make the API request for the selected page
						makeRequest(url_with_page).then((response) => {
							this.max_page_number = Math.ceil(response.count / items_per_page);
	
							active_games_list.classList.add("active-games-list-animation");
							setTimeout(() => {
								active_games_list.classList.remove("active-games-list-animation");
							}, 300);
	
							this.render_data(response);
						});
					}
				}
			});
	
			// Handle individual page item click
			pagination_items.forEach((item) => {
				item.parentElement.addEventListener("click", (e) => {
					pagination_items.forEach((item) => item.parentElement.classList.remove("pagination-active"));
					item.parentElement.classList.add("pagination-active");
	
					const selected_page = parseInt(item.innerText, 10);
					if (selected_page <= this.max_page_number) {
						this.current_page = selected_page;

						// Update URL with the selected page
						const url_with_page = `/api/auth/notifications/?page=${this.current_page}`;
	
						// Make the API request for the selected page
						makeRequest(url_with_page).then((response) => {
							this.max_page_number = Math.ceil(response.count / items_per_page);
				
	
							active_games_list.classList.add("active-games-list-animation");
							setTimeout(() => {
								active_games_list.classList.remove("active-games-list-animation");
							}, 300);
	
							this.render_data(response);
						});
					}
				});
			});
	
			this.render_data(response);


		});
	}

	render_data(response) {
		console.log(response);
		const active_games_list = this.querySelector(".notifications_page_content");
		active_games_list.innerHTML = response.results.map((item) => {
			let message;
			if (item.type == "friend_request") {
				message = /*html*/`
					<div class="d-flex align-items-center" style="gap: 10px">
						<span class="p4_regular"><span class="p4_bold">${item.sender.username}</span> sent you a friend request</span>
						<div class="d-flex" style="gap: 10px; margin-left: auto;">
							<div class="d-flex justify-content-center align-items-center notifications-bar-option-items-accept-btn online_status">
								<span class="p4_bold">Accept</span>
							</div>

							<div class="d-flex justify-content-center align-items-center notifications-bar-option-items-accept-btn offline_status">
								<span class="p4_bold">Decline</span>
							</div>
						</div>
					</div>
				`;
			} else if (item.type == "game_invitation") {
				message = /*html*/`<span class="p4_regular"><span class="p4_bold">${item.sender.username}</span> sent you a game invitation</span>`;
			}
			else if (item.type == "congrats") {
				message = /*html*/`<span class="p4_regular"><span class="p4_bold">Congratulations! You've advanced to 1000 Elo.</span>`;
			}
			else if (item.type == "strike") {
				message = /*html*/`<span class="p4_bold" style="color: var(--red)">Warning! You've received a strike.</span>`;
			}
			else {
				return "";
			}
			return /*html*/ `
				<div class="notifications-bar-option-items notifications-bar-option-items-border" data-notification-id="${item.id}" data-sender-id="${item.sender.id}">
					<div style="position: relative">
						<img src="${item.sender.avatar}" class="friends_bar_item_icon"/>
						${item.sender.status == "online" ? 
							/*html*/ `<div class="friends_bar_item_icon_status online_status"></div>`: 
							/*html*/ `<div class="friends_bar_item_icon_status offline_status"></div>`
						}
					</div>


					<div class="d-flex align-items-center" style="gap: 2px;flex-grow: 1">
						<div class="d-flex flex-column"  style="flex-grow: 1"> 
							${message}
						</div>
					</div>

					<img src="/assets/images/common/Iconly/Light/Close_Square.svg" alt="close" class="notifications-bar-option-close">

				</div>
			`;
		}).join("");

		const notifications_bar_options = this.querySelector(".notifications_page_content");
		const notifications_bar_option_items = this.querySelectorAll(".notifications-bar-option-items");
		notifications_bar_option_items.forEach((item) => {
			const close_button = item.querySelector(".notifications-bar-option-close");
			if (!close_button)
				return;



			close_button.addEventListener("click", () => {
				const notification_id = item.getAttribute("data-notification-id");
				makeRequest(`/api/auth/delete_notifications/${notification_id}/`, "DELETE")
				.then((data) => {
					item.classList.add("notification_remove_animation");
					item.addEventListener("animationend", () => {
						item.remove();
						makeRequest('/api/auth/notifications/')
						.then((response) => {
							this.current_page = 1;
							this.render_data(response);
						});
					});
				}).catch(error => {
					showToast("error", error);
				});
			});

			const span_texts = document.querySelectorAll(".notifications-bar-option-items div div span span");
			span_texts.forEach((span_text) => {

				if(span_text)
				{
					span_text.addEventListener("click", () => {
						
						notifications_bar_options.classList.remove("show");
						
						const user_id = item.getAttribute("data-sender-id");
						GoTo(`/profile/${user_id}`);
					});
				};

			});

			const item_decline_button = item.querySelector(".notifications-bar-option-items > div > div > div > div .offline_status");
			
			if (item_decline_button) {
				item_decline_button.addEventListener("click", () => {
					const notification_id = item.getAttribute("data-notification-id");
					makeRequest(`/api/auth/delete_notifications/${notification_id}/`, "DELETE")
					.then((data) => {
						item.classList.add("notification_remove_animation");
						item.addEventListener("animationend", () => {
							item.remove();
							makeRequest('/api/auth/notifications/')
							.then((response) => {
								this.current_page = 1;
								
								this.render_data(response);
							});
						});
						
					}).catch(error => {
						showToast("error", error);
					});
				});
			}

			const item_accept_button = item.querySelector(".notifications-bar-option-items > div > div > div > div .online_status");

			if (item_accept_button) {
				item_accept_button.addEventListener("click", () => {
					const data_sender_id = item.getAttribute("data-sender-id");
					const notification_id = item.getAttribute("data-notification-id");

					makeRequest(`/api/auth/accept_friend_request/${data_sender_id}/`, "GET")
					.then((data) => {
						makeRequest(`/api/auth/delete_notifications/${notification_id}/`, "DELETE")
						.then((data) => {
							item.classList.add("notification_remove_animation");
							item.addEventListener("animationend", () => {
								item.remove();
								makeRequest('/api/auth/notifications/')
								.then((response) => {
									this.current_page = 1;
									this.render_data(response);
								});
							});
							
						}).catch(error => {
							showToast("error", error);
						});
					}).catch(error => {
						showToast("error", error);
					});
				});
			}

			
		});


	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("notifications-page", Notifications_Page);
