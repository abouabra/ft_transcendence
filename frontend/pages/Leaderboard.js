
export default class Leaderboard_Page extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/leaderboard_page.css'));

		makeRequest('/api/game/leaderboard/')
		.then((response) => {

			console.log(response);
			this.innerHTML = /* html */`
				<div class="leaderboard_page_container blur platinum_40_color_border"> 
					
				<div class="leaderboard_page_header">
					<span class="header_h1" style="margin: auto;">Leaderboard</span>
					<div class="leaderboard_page_header_filter"  style="margin: auto;">
						<div class="leaderboard_page_header_filter_item leaderboard_page_active_filter" data-name="pong">
							<span class="p4_bold">Pong</span>
						</div>
						<div class="leaderboard_page_header_filter_item" data-name="space_invaders">
							<span class="p4_bold">Space Invaders</span>
						</div>
						<div class="leaderboard_page_header_filter_item" data-name="road_fighter">
							<span class="p4_bold">Road Fighter</span>
						</div>
					</div>
				</div>


					<div class="leaderboard_page_content">
					</div>
				</div>
			`;

			this.render_data(response);

			const leaderboard_page_header_filter_items = this.querySelectorAll('.leaderboard_page_header_filter_item');
			let current_active_filter_name = this.querySelector('.leaderboard_page_active_filter').getAttribute('data-name');

			leaderboard_page_header_filter_items.forEach((item) => {
				item.addEventListener('click', () => {
					leaderboard_page_header_filter_items.forEach((item) => {
						item.classList.remove('leaderboard_page_active_filter');
					});
					item.classList.add('leaderboard_page_active_filter');
					if(current_active_filter_name === item.getAttribute('data-name')) {
						return;
					}
					current_active_filter_name = item.getAttribute('data-name');
					const game_name = item.getAttribute('data-name');
					
					makeRequest(`/api/game/leaderboard/?game_name=${game_name}`)
					.then((response) => {
						// triple the response to make it look like there are more users
						
						this.render_data(response);
					});
				});
			});

		});
	}

	render_data(response) {
		console.log(response);
		const leaderboard_page_content = this.querySelector('.leaderboard_page_content');
		leaderboard_page_content.innerHTML = /* html */`
			<div class="leaderboard_page_top_3_container">
				${response[2] != null ? /* html */`
				<div class="leaderboard_page_rank_3_container blur platinum_40_color_border">
					<div class="leaderboard_page_top_3_rank_container" >
							<img class="leaderboard_page_rank_3_avatar" src=${response[2].user.avatar} alt="avatar">
							<div class="leaderboard_page_rank_diamond" style="background-color: var(--blue);">
								<span class="p2_bold" style="rotate: -45deg">3</span>
							</div>
						</div>
					<div class="leaderboard_page_top_3_text_container" style="margin-top: 55px">
						<span class="p2_bold leaderboard_page_top_3_text_item" data-id="${response[2].user.id}">${response[2].user.username}</span>
						<span class="p2_bold primary_color_color">${response[2].current_elo}</span>
					</div>
				</div>
				` : ''}

				${response[0] != null ? /* html */`
				<div class="leaderboard_page_rank_1_container blur platinum_40_color_border">
					<div class="leaderboard_page_top_3_rank_container" >
						<img src="/assets/images/leaderboard_page/crown.svg" alt="crown" class="leaderboard_page_crown">
						<img class="leaderboard_page_rank_1_avatar" src=${response[0].user.avatar} alt="avatar">
						<div class="leaderboard_page_rank_diamond" style="background-color: var(--red);">
							<span class="p2_bold" style="rotate: -45deg">1</span>
						</div>
					</div>
					<div class="leaderboard_page_top_3_text_container" style="margin-top: 40px;gap: 10px">
						<span class="header_h2 leaderboard_page_top_3_text_item" data-id="${response[0].user.id}">${response[0].user.username}</span>
						<span class="p1_bold primary_color_color">${response[0].current_elo}</span>
					</div>
				</div>
				` : ''}

				${response[1] != null ? /* html */`
					<div class="leaderboard_page_rank_2_container blur platinum_40_color_border">
						<div class="leaderboard_page_top_3_rank_container" >
							<img class="leaderboard_page_rank_2_avatar" src=${response[1].user.avatar} alt="avatar">
							<div class="leaderboard_page_rank_diamond" style="background-color: var(--green);">
								<span class="p2_bold" style="rotate: -45deg">2</span>
							</div>
						</div>
						
						<div class="leaderboard_page_top_3_text_container" style="margin-top: 40px;gap: 3px">
							<span class="header_h3 leaderboard_page_top_3_text_item" data-id="${response[1].user.id}">${response[1].user.username}</span>
							<span class="p1_bold primary_color_color">${response[1].current_elo}</span>
						</div>
					</div>
				` : ''}

			</div>
		`;
		
		
		
		response.forEach((row, index) => {
			// if(row.user.username === 'local_user') return;
			if(index <= 2) return; 

			leaderboard_page_content.innerHTML += /* html */`
				<div class="leaderboard_page_content_item">
					<span class="p4_bold leaderboard_page_content_item_rank">${index + 1}</span>
					<img class="leaderboard_page_content_item_avatar" src="${row.user.avatar}" alt="avatar">
					<span class="p4_bold leaderboard_page_content_item_username" data-id="${row.user.id}">${row.user.username}</span>
					<span class="p4_bold leaderboard_page_content_item_current_elo">${row.current_elo}</span>
				</div>
			`;
		});

		// loop through leaderboard_page_top_3_text_item
		const leaderboard_page_top_3_text_item = this.querySelectorAll('.leaderboard_page_top_3_text_item');
		leaderboard_page_top_3_text_item.forEach((item) => {
			item.addEventListener('click', () => {
				const user_id = item.getAttribute('data-id');
				GoTo(`/profile/${user_id}`);
			});
		});

		const leaderboard_page_content_item_usernames = this.querySelectorAll('.leaderboard_page_content_item_username');
		leaderboard_page_content_item_usernames.forEach((item) => {
			item.addEventListener('click', () => {
				const user_id = item.getAttribute('data-id');
				GoTo(`/profile/${user_id}`);
			});
		});


	
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("leaderboard-page", Leaderboard_Page);
