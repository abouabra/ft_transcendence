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
		console.log(data);
		if(data.user.is_blocked)
		{
			console.log("hnnnnnaaaaaa")
			// const child = document.querySelector(".first_part");
			// const parent = child.parentElement;
			this.innerHTML= /*html*/ `
				<not-found-page text_span="You blocked this user" text_button="Tap to unblock" go_to="/unblock_${data.user.id}"></not-found-page>
			`;
			return ;
			// makeRequest(`/api/auth/profile/${user_id}/`)
			// .then((data) => {
			// 	this.render_data(data, user_id);
			// })
			// .catch((error) => {
			// 	showToast("error", error);
			// });
		}
		let dot_color="";

		if(data.user.status=="online")
			dot_color='"#11ac12"'
		else
			dot_color="#e84c3d";
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
		
		if(data.user.id != localStorage.getItem("id"))
		{
			
			const first_right_top = document.querySelector(".top_part");
			first_right_top.innerHTML=/*html*/`
			<div class="buttons_right_top">
			<button-component class="button_right_top" data-text="Add friend" data-type="no-bg"></button-component>
			<button-component class="button_right_top" data-text="Message" data-type="no-bg"></button-component>
			<button-component class="button_right_top three_point" data-text=". . ." data-type="no-bg"></button-component>
			<div class="three_point_options">
				<span class="button_right_top-items p3_regular block" >Block</span>
				<span class="button_right_top-items p3_regular report" >Report</span>
			</div>
			</div>
			`;
		}
		if(data.user.is_friend)
		{
			const is_friend = document.querySelector("[data-text='Add friend']");
			is_friend.setAttribute("data-text", "Remove friend");
		}

		const three_point_options = this.querySelector(".three_point_options");
		const  three_points = document.querySelector(".three_point button");
		if(three_points){
			three_points.addEventListener("click", (event) => {
				three_point_options.classList.toggle("show");
				three_points.classList.toggle("show_1");
				event.stopPropagation();
			});
			document.addEventListener('click', (event) => {
				three_point_options.classList.remove("show");
				three_points.classList.remove("show_1")
			});
		}




		const add_friend=document.querySelector("[data-text='Add friend']")
		if (add_friend)
		{
			add_friend.addEventListener('click', () => {
				send_friend_request(data.user.id);
				rm_friend.setAttribute("data-text", "Add friend")

				// add_friend.innerHTML="Remove friend";
			})
		}

		const rm_friend=document.querySelector("[data-text='Remove friend']")
		if (rm_friend)
		{
			rm_friend.addEventListener('click', () => {
				remove_friend(data.user.id);
				rm_friend.setAttribute("data-text", "Add friend")
				// rm_friend.innerHTML="Add friend";
			})
		}

		const message_direct=document.querySelector("[data-text='Message']")
		if(message_direct){
			message_direct.addEventListener('click', () => {
				send_user_to_direct(data.user.id);
			})
		}

		const block=document.querySelector(".block")
		if(block)
		{
			block.addEventListener('click', () => {
				makeRequest("/api/auth/unblock_and_block/", "POST", {isBlocked:false, id:data.user.id})
				.then(response => {
					data.user.is_blocked=true;
					this.render_data(data, user_id)
				});
			})	
		}

		const report=document.querySelector(".report")
		if(report)
		{
			report.addEventListener('click', () => {
				const center_part = document.getElementById("base_page");
				center_part.innerHTML+=/*html*/
				`
				<div class="card" style="display:flex" id="card1" tabindex="0" autofocus >
					<div class="small_card_report card1" >
					<span class="header_h3">Report this user ${data.user.username}</span>
						<div class="d-flex flex-column align-items-center">
							<form>
								<div class="inputs_2fa">
									<p class="header_h4 primary_color_color">Subject :</p>
									<input type="text" class=" input_2fa subject">
									<p class="header_h4 primary_color_color">Description :</p>
									<textarea rows="6" cols="60" name="comment" class=" input_2fa description"></textarea>
								</div>
							</form>
						</div>
						<div class="small_card_cta">
							<button-component data-text="Cancel" data-type="no-bg" onclick="Delete_Card('#card1');"></button-component>
							<button-component data-text="Report" onclick="send_report(${data.user.id})" ></button-component>
						</div>
					</div>
                </div>
				`;
			})	
		}
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("profile-page", Profile_Page);
