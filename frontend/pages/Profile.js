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
						<not-found-page text_span="User Not Found"></not-found-page>
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
			await new Promise(resolve => setTimeout(resolve, 100));
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
			<div class="sec_part">
			</div>
			<div class="third_part">
			</div>
		</div>
		`;
		if(data.user.is_blocked)
		{
			const child = document.querySelector(".first_part");
			const parent = child.parentElement;
			parent.innerHTML= /*html*/ `
				<not-found-page text_span="You blocked this user" text_button="Tap to unblock" go_to="/unblock_${data.user.id}"></not-found-page>
			`;
			// makeRequest(`/api/auth/profile/${user_id}/`)
			// .then((data) => {
			// 	this.render_data(data, user_id);
			// })
			// .catch((error) => {
			// 	showToast("error", error);
			// });
		}
		if(data.user.id != localStorage.getItem("id"))
		{
			
			const first_right_top = document.querySelector(".top_part");
			first_right_top.innerHTML=/*html*/`
			<div class="buttons_right_top">
			<button-component class="button_right_top" data-text="Add friend" data-type="no-bg"></button-component>
			<button-component class="button_right_top" data-text="Message" data-type="no-bg"></button-component>
			<button-component class="button_right_top three_point" data-text=". . ." data-type="no-bg"></button-component>
			<div class="three_point_options">
				<span class="button_right_top-items p3_regular" >Block</span>
				<span class="button_right_top-items p3_regular" >Report</span>
			</div>
			</div>
			`;
		}
		if(data.user.is_friend)
		{
			const is_friend = document.querySelector("[data-text='Add friend']");
			is_friend.setAttribute("data-text", "Delete friend");
		}
		const three_point_options = this.querySelector(".three_point_options");
		const  three_points = document.querySelector(".three_point button");
			three_points.addEventListener("click", () => {
				three_point_options.classList.toggle("show");
				const primaryColor = getComputedStyle(document.documentElement).getPropertyValue("--primary_color");
    			three_points.style.backgroundColor = primaryColor.trim();
			})
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("profile-page", Profile_Page);
