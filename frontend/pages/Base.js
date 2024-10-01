
export default class Base_Page extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/base.css'));

		this.innerHTML = /* html */`
			<side-bar></side-bar>
		
			<div class="center-part" >
				<nav-header></nav-header>
				<friends-servers-bar></friends-servers-bar>
				
				<div class="d-flex w-100 h-100" style="overflow-x: auto;position: relative;">
					<div style=" width: 100%; height: 100%;position: relative;" id="base_page">
						<h1> Base Page </h1>
					</div>
				</div>
				
				
			</div>
		`;



		const center_part = document.querySelector('.center-part');
		const resizeObserver1 = new ResizeObserver(() => checkFlexWrap(center_part));
		resizeObserver1.observe(center_part);



		
		if(!window.notification_socket) {
			window.notification_socket = new WebSocket(`wss://${window.location.hostname}/ws/notifications/`);
		}

		window.notification_socket.onopen = (event) => {
			console.log("Notification socket opened");
			
			const sender_id = localStorage.getItem("id");
			sendNotification("join_group", sender_id);
			console.log("Notification socket message sent to join group");
		};

		window.notification_socket.onclose = function (event) {
			console.log("Notification socket closed");
		};

		window.notification_socket.onerror = function (event) {
			console.log("Notification socket error");
		};

		window.notification_socket.onmessage = function (event) {
			const data = JSON.parse(event.data);
			console.log("Notification socket message: ", data)

			if(data.type != "cancel_game_invitation")
			{
				const notifications_bar_status = document.querySelector(".notifications_bar_status");
				if(notifications_bar_status.style.display == "" || notifications_bar_status.style.display == "none")
					notifications_bar_status.style.display = "flex";


				const counter_span = notifications_bar_status.querySelector("span");
				counter_span.textContent = parseInt(counter_span.textContent) + 1;
			}


			if(data.type == "game_invitation")
			{
				Make_Small_Card("join_game", null, data.game_id, data.sender.username, data.sender.avatar, data.game_name, null, null, data.sender.id);
			}
			else if(data.type == "cancel_game_invitation")
			{
				Delete_Small_Card();
			}
			else if(data.type == "friend_request")
			{

			}
			else if(data.type == "strike")
			{

			}
		};

	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("base-page", Base_Page);
