
export default class Base_Page extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/base.css'));

		this.innerHTML = /* html */`
			<div id="spinner-overlay" class="spinner-overlay">
				<div class="spinner-border text-primary" role="status">
				</div>
			</div>
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



		
		if(window.notification_socket == null)
			window.notification_socket = new WebSocket(`wss://${window.location.hostname}/ws/notifications/`);

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

			if(data.type != "cancel_game_invitation" && data.type != "tournament_game_invitation")
			{
				const notifications_bar_status = document.querySelector(".notifications_bar_status");
				if(notifications_bar_status && (notifications_bar_status.style.display == "" || notifications_bar_status.style.display == "none"))
					notifications_bar_status.style.display = "flex";


				if(notifications_bar_status) {
					const counter_span = notifications_bar_status.querySelector("span");
					counter_span.textContent = parseInt(counter_span.textContent) + 1;
				}
			}
			if(data.type == "tournament_game_invitation")
			{
				const current_id = parseInt(localStorage.getItem("id"));
				const tournament_sender_id = current_id == data.player1_id.id ? data.player2_id.id : data.player1_id.id;
				// console.log("tournament_game_invitation tournament_sender_id: ", tournament_sender_id);

				// Make_Small_Card("tournament_join_game", null, data.tournament.name, data.tournament.avatar, data.game_name, null, null, tournament_sender_id, null, data.game_id);
				handle_action("join_tournament_game", 0, JSON.stringify({game_id: data.game_id, opponent_id: tournament_sender_id, game_name: data.game_name}));
				// setTimeout(() => {
				// 	GoTo(`/play/game/${data.game_id}`);
				// }, 1000);
			}

			else if(data.type == "game_invitation")
			{
				console.log("game_invitation data: ", data);
				Make_Small_Card("join_game", null, data.sender.username, data.sender.avatar, data.game_name, null, null, data.sender.id);
			}
			else if(data.type == "cancel_game_invitation")
			{
				Delete_Small_Card();
			}
			else if(data.type == "game_invitation_response")
			{
				// if(window.game_socket)
				// 	window.game_socket.close();
				if(!window.game_socket)
					window.game_socket = new WebSocket(`wss://${window.location.hostname}/ws/game/`);
				
				window.game_socket.onopen = () => {
					console.log("Game socket opened | game_invitation_response");
					console.log(`game_id: ${data.game_id} | game_invitation_response`);
	
					window.game_socket.send(JSON.stringify({
						type: "join_custom_game",
	
						player_id: parseInt(localStorage.getItem("id")),
						player_username: localStorage.getItem("username"),
						player_avatar: localStorage.getItem("avatar"),
	
						game_name: data.game_name,
	
						game_id: data.game_id,
					}));

					setTimeout(() => {
						GoTo(`/play/game/${data.game_id}`);
					}, 1000);
				};

				window.game_socket.onclose = function (event) {
					console.log("Game socket closed | game_invitation_response");
				};
		
				window.game_socket.onerror = function (event) {
					console.log("Game socket error | game_invitation_response");
				};

				window.game_socket.onmessage = (event) => {
					const data = JSON.parse(event.data);
					console.log(`game_invitation_response | Received data:`, data);
					
					if(data.type == "start_game") 
					{
						const current_id = localStorage.getItem("id");
						localStorage.setItem("initial_data", JSON.stringify(data.initial_data[current_id]));
					}

				};
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

	disconnectedCallback() {
		if(window.notification_socket)
		{
			window.notification_socket.close();
			window.notification_socket = null;
		}
	}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("base-page", Base_Page);
