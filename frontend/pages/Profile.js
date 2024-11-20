export default class Profile_Page extends HTMLElement {
	constructor() {
		super();
		
		// Append the stylesheet link
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/profile_page.css'));

		const user_id = window.location.pathname.split("/")[2];

		this.waitForSocket().then(() => {
			makeRequest(`/api/auth/profile/${user_id}/`)
			.then((data) => {
				if (data.response_code === 404) {
					this.innerHTML = /* html */`
						<h1>User not found</h1>
					`;
					return;
				}
				this.render_data(data, user_id);
			})
			.catch((error) => {
				showToast("error", error);
			});
		});
	}

	async waitForSocket() {
		while (!window.notification_socket || window.notification_socket.readyState !== WebSocket.OPEN) {
			await new Promise(resolve => setTimeout(resolve, 100)); // Poll every 100ms
		}
	}
	
	render_data(data, user_id)
	{
		let dot_color="";

		if(data.user.status=="online")
			dot_color='"#11ac12"'
		else
			dot_color="#e84c3d";
		console.log(data);
		this.innerHTML = /* html */`
			<div class="first_part">
				<img src="${data.user.profile_banner}" class="banner">
				<div class="left_part">
					<img src="${data.user.avatar}" class="avatar">
					<span class="dot" style="background-color:${dot_color}"></span>
					<span class="header_h1 ">${data.user.username}</span>
				</div>
				<div class="right_part">
					<div class="top_part">
						
					</div>
					<div class="bottom_part">
						<div class="leaderboard_page_header_filter">
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
				</div>
			</div>
			<div class="sec_part">
			</div>
			<div class="third_part">
			</div>
		`;
		if(data.user.is_blocked)
		{
			
		}
		if(data.user.id != localStorage.getItem("id"))
		{
			
			const first_right_top = document.querySelector(".top_part");
			first_right_top.innerHTML=/*html*/`
			<div class="buttons_right_top">
			<button-component class="button_right_top" data-text="Add friend" data-type="no-bg"></button-component>
			<button-component class="button_right_top" data-text="Message" data-type="no-bg"></button-component>
			<button-component class="button_right_top three_point" data-text=". . ." data-type="no-bg"></button-component>
			</div>
			`;
		}
		if(data.user.is_friend)
		{
			const is_friend = document.querySelector("[data-text='Add friend']");
			is_friend.setAttribute("data-text", "Delete friend");
		}
			
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("profile-page", Profile_Page);
