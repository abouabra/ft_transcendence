
export default class Expanded_Home_Active_Games extends HTMLElement {
	constructor() {
		super();

		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink("/styles/home.css"));



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
					<div class="expanded-games-x-button-container">
						<img src="/assets/images/common/Iconly/Light/x.svg" alt="forward"/>
					</div>
				</div>
			</div>
			
		
		
			<div class="active-games-list"></div>




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

			<nav aria-label="Page navigation example">
		`;





		const active_games_list = this.querySelector(".active-games-list");

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

		makeRequest("/api/game/home_expanded_active_games/")
		.then((response) => {
	
			this.game_name = "";
			this.current_page = 1;
			const items_per_page = 3;  // You have 3 pagination items
			this.max_page_number = Math.ceil(response.count / response.results.length);
	
			// Helper to update pagination items display
			
	
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
						const url_with_page = `/api/game/home_expanded_active_games/?page=${this.current_page}&game_name=${this.game_name}`;
	
						// Make the API request for the selected page
						makeRequest(url_with_page).then((response) => {
							this.max_page_number = Math.ceil(response.count / response.results.length);
	
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
						const url_with_page = `/api/game/home_expanded_active_games/?page=${this.current_page}&game_name=${this.game_name}`;
	
						// Make the API request for the selected page
						makeRequest(url_with_page).then((response) => {
							this.max_page_number = Math.ceil(response.count / response.results.length);
	
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
						const url_with_page = `/api/game/home_expanded_active_games/?page=${this.current_page}&game_name=${this.game_name}`;
	
						// Make the API request for the selected page
						makeRequest(url_with_page).then((response) => {
							this.max_page_number = Math.ceil(response.count / response.results.length);
	
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
	
		

		const expanded_games_x_button_container = this.querySelector(".expanded-games-x-button-container");
		expanded_games_x_button_container.addEventListener("click", (e) => {
			const expanded_active_games_container = document.querySelector(".expanded-active-games-container");
			expanded_active_games_container.style.display = "none";
		});


		

		
		const home_select = this.querySelector(".home-select");
		home_select.addEventListener("change", (e) => {
			const value = e.target.value;
			this.game_name = value;

			this.current_page = 1;
			
			makeRequest(`/api/game/home_expanded_active_games/?page=${this.current_page}&game_name=${this.game_name}`)
			.then((response) => {
				this.max_page_number = Math.ceil(response.count / response.results.length);
				updatePaginationDisplay();

				active_games_list.classList.add("active-games-list-animation");
				setTimeout(() => {
					active_games_list.classList.remove("active-games-list-animation");
				}, 300);
				this.render_data(response);
			});
		});




		
	}

	

	render_data(response)
	{
		
		const active_games_list = this.querySelector(".active-games-list");

		active_games_list.innerHTML = "";
		response.results.forEach((item) => {
			active_games_list.innerHTML += /*html*/ `
				<div class="expanded-active-games-list-item">
					<img src="${item.player1.avatar}" alt="avatar" class="active-games-list-item-avatar" />
					
					<div class="d-flex flex-wrap align-items-center justify-content-around" style="gap: 5px; flex-grow: 1;">

						<div class="d-flex flex-column align-items-center justify-content-center" style="gap: 5px;">
							<span class="p4_bold" data-user-id=${item.player1.id}>${item.player1.username}</span>
							<span class="p6_bold platinum_40_color">Elo: ${item.player1.current_elo}</span>
						</div>

						<div class="d-flex flex-column align-items-center justify-content-center" style="gap: 5px">
							<span class="p6_bold platinum_40_color">match type</span>
							<span class="p4_bold">${item.game_type}</span>
						</div>


						<div class="d-flex flex-column align-items-center justify-content-center" style="gap: 5px">
							<span class="p6_bold platinum_40_color">Score</span>
							<span class="p4_bold">${item.player_1_score} - ${item.player_2_score}</span>
						</div>


						
						<div class="d-flex flex-column align-items-center justify-content-center" style="gap: 5px">
							<span class="p6_bold platinum_40_color">duration</span>
							<div class="d-flex" style="gap: 3px;">
								<span class="p4_bold">${item.game_duration}</span>
								<span class="active-games-duration-games">min</span>
							</div>
						</div>

						<div class="d-flex flex-column align-items-center justify-content-center" style="gap: 5px;">
							<span class="p4_bold" data-user-id=${item.player2.id}>${item.player2.username}</span>
							<span class="p6_bold platinum_40_color">Elo: ${item.player2.current_elo}</span>
						</div>
					
					</div>

					<img src="${item.player2.avatar}" alt="avatar" class="active-games-list-item-avatar" />
				</div>
			`;
		});

		const all_users = this.querySelectorAll(".expanded-active-games-list-item div div .p4_bold");
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

customElements.define("expanded-home-active-games", Expanded_Home_Active_Games);