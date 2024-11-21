
export default class Play_Page extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/play_page.css'));

		this.selected_game = null;
		this.selected_mode = null;
		this.updateTimerID = null;

		this.first_stage_data = [
			{img: "/assets/images/landing_page/pong-video-game.gif", text: "Pong 1972", game_name: "pong"},
			{img: "/assets/images/landing_page/pong-video-game-2.gif", text: "Road Fighter 1984", game_name: "road_fighter"},
			{img: "/assets/images/landing_page/pong-video-game-3.gif", text: "Space Invaders 1978", game_name: "space_invaders"},
		]

		this.second_stage_data = [
			{text: "Player vs Player Online", mode: "ranked"},
			{text: "Player vs Player Local", mode: "local"},
		]

		this.render_first_stage();
	}

	render_first_stage()
	{
		
		this.innerHTML = /* html */`
			<div class="cards_container">
				${this.first_stage_data.map((item) => {
					return /* html */`
						<div class="play-game-card blur platinum_40_color_border" data-game-name="${item.game_name}">
							<img src="${item.img}" alt="${item.text}" class="play-game-card-image">
							<div class="d-flex flex-column play-game-text-btn">
								<span class="header_h3 play-game-text">${item.text}</span>
								
								<div class="d-flex w-100">
									<button-component data-text="Choose"></button-component>
								</div>
							</div>
						</div>
					`
				}).join("")}
			</div>
			<button-component data-text="Back" id="play-page-go-back"></button-component>
		`;
		const go_back_btn = this.querySelector("#play-page-go-back");
		go_back_btn.style.opacity = "0";

		const all_cards = this.querySelectorAll(".play-game-card");
		all_cards.forEach((card) => {
			const card_btn = card.querySelector("button-component");
			card_btn.addEventListener("click", () => {
				this.selected_game = card.getAttribute("data-game-name");
				
				for (let i = 0; i < all_cards.length; i++) {
					all_cards[i].classList.add("play-page-rotation");
					
					all_cards[i].addEventListener("animationend", () => {
						all_cards[i].classList.remove("play-page-rotation");
					});
					
					if(i == 0) {
							all_cards[i].addEventListener("animationend", () => {
							go_back_btn.style.opacity = "100";
						});
					};
					if(this.selected_game == "space_invaders") {
						this.selected_mode = "ranked";
						this.construct_a_game();
						return;
					}
					else if(this.selected_game == "road_fighter") {
						
						const cards_container = this.querySelector(".cards_container");
						cards_container.innerHTML = /* html */`
							<div class="d-flex flex-column align-items-center justify-content-center">
								<span class="header_h2">Road Fighter 1984</span>
								<span class="p1_bold">Work in progress</span>

								<button-component data-text="Go Home" onclick="GoTo('/home/')" style="margin-top: 50px;"></button-component>
							</div>
						`;
						return;
					}
					else {
						setTimeout(() => {
							if(i == 2)
							{
								all_cards[i].innerHTML = "";
								all_cards[i].style.display = "none";
							}
							else
							{								
								all_cards[i].innerHTML = /* html */`
									<div class="play-game-card blur platinum_40_color_border">
										<div class="d-flex flex-column play-game-text-btn">
											<div class="d-flex h-100 justify-content-center align-items-center">
												<span class="header_h3 play-game-text">${this.second_stage_data[i].text}</span>
											</div>
												
											<div class="d-flex" style="width: 100%;">
												<button-component data-text="Play" onclick="GoTo('/play/')"></button-component>
											</div>
										</div>
									</div>
									`;
								
								const btn = all_cards[i].querySelector("button-component");
								btn.addEventListener("click", () => {
									this.selected_mode = this.second_stage_data[i].mode;
									this.construct_a_game();
								});
							}
						}, 250);
					}

				}

			});
		});

		
		go_back_btn.addEventListener("click", () => {
			this.render_first_stage();
		});

		
	}




	construct_a_game() {
		console.log(this.selected_game, this.selected_mode);

		
		if(this.selected_mode == "ranked") {
			if(window.game_socket == null)
				window.game_socket = new WebSocket(`ws://${window.location.hostname}:8000/ws/game/`);

			window.game_socket.onopen = () => {
				console.log("Game socket opened | Connected to the game server");

				window.game_socket.send(JSON.stringify({
					type: "join_game",
					user: {
						username: localStorage.getItem("username"),
						avatar: localStorage.getItem("avatar"),
						id: parseInt(localStorage.getItem("id")),
					},
					game_name: this.selected_game,
				}));
			};

			window.game_socket.onclose = function (event) {
				console.log("Game socket closed");
			};
	
			window.game_socket.onerror = function (event) {
				console.log("Game socket error");
			};
	
			window.game_socket.onmessage = (event) => {
				const data = JSON.parse(event.data);
				console.log(`Play.js | Received data:`, data);

				if(data.type == "start_game") 
				{
					const current_id = localStorage.getItem("id");
					const opponent = data.player1.id == current_id ? data.player2 : data.player1;
					
					console.log("start_game start_game start_game start_game initial data", data.initial_data[current_id]);
					
					localStorage.setItem("initial_data", JSON.stringify(data.initial_data[current_id]));

					clearInterval(this.updateTimerID);

					const match_making_timer = document.querySelector('.match-making-timer');
					match_making_timer.style.backgroundColor = "var(--primary_color)";


					const cancel_match_making = document.getElementById("cancel-match-making");
					cancel_match_making.style.display = "none";



					const status_text = document.getElementById("match-making-user-status-text");
					status_text.textContent = "Match Found";

					handle_action("reveal_opponent", opponent.id, {
						opponent,
						game_room_id: data.game_room_id,
					});
					
					
				}

			};


			this.match_making();
		}

		else if(this.selected_mode == "local") {		
			makeRequest("/api/game/construct_game/", "POST", {
				game_name: this.selected_game,
				user_id: parseInt(localStorage.getItem("id")),
				game_type: "local",
			}).then((data) => {
				GoTo(`/play/game/${data.game_room_id}`);
			});
		}
	}

	match_making() {
		const current_user_data = {};
		current_user_data.username = localStorage.getItem("username");
		current_user_data.avatar = localStorage.getItem("avatar");
		current_user_data.id = parseInt(localStorage.getItem("id"));

		this.innerHTML = /* html */`
			<div class="match-making-user-vs-user">
				<div class="match-current-making-user">
					<img src="${current_user_data.avatar}" alt="avatar" class="match-making-current-user-avatar-container platinum_40_color_border">
					<span class="header_h2">${current_user_data.username}</span>
				</div>

				<img src="/assets/images/play_page/vs_art.svg" alt="vs" class="match-making-vs-art">

				<div class="match-making-user">
					<div id="avatarContainer" class="match-making-user-avatar-container platinum_40_color_border">
						<div class="avatar-roller"></div>
						<img id="opponentAvatar" class="opponent-avatar" alt="Opponent Avatar">
					</div>
					<span id="match-making-user-status-text" class="header_h2"> searching ... </span>
				</div>
			</div>

			<div class="match-making-timer-btn">
				<div class="match-making-timer platinum_40_color_border blur">
					<div class="match-making-timer-bar">
						<span class="p2_bold platinum_40_color">searching ...</span>
						<span class="header_h1">00 : 00</span>
					</div>
				</div>
				
				<button-component data-text="Cancel" id="cancel-match-making"></button-component>

			</div>
		`;

		const timer = document.querySelector('.match-making-timer-bar .header_h1');
		let minutes = 0;
		let seconds = 0;

		function updateTimer(reverse = false) {
			if(reverse)
				seconds--;
			else
				seconds++;

			if (seconds === 60) {
				seconds = 0;
				minutes++;
			}
			else if(seconds === -1) {
				seconds = 59;
				minutes--;
			}

			let minutesDisplay = minutes < 10 ? '0' + minutes : minutes;
			let secondsDisplay = seconds < 10 ? '0' + seconds : seconds;

			timer.textContent = minutesDisplay + ' : ' + secondsDisplay;
		}

		this.updateTimerID = setInterval(updateTimer, 1000);


		
		
		const avatars = [
            '/assets/images/play_page/avatars/avatar_1.svg',
            '/assets/images/play_page/avatars/avatar_2.svg',
            '/assets/images/play_page/avatars/avatar_3.svg',
            '/assets/images/play_page/avatars/avatar_4.svg',
            '/assets/images/play_page/avatars/avatar_5.svg',
            '/assets/images/play_page/avatars/avatar_6.svg',
            '/assets/images/play_page/avatars/avatar_7.svg'
        ];

        const roller = document.querySelector('.avatar-roller');

        function createAvatarElements() {
            avatars.forEach(createAndAppendAvatar);
            avatars.forEach(createAndAppendAvatar);
        }

        function createAndAppendAvatar(src) {
            const img = document.createElement('img');
            img.src = src;
            img.alt = "avatar";
            img.className = 'match-making-user-avatar';
            roller.appendChild(img);
        }

        createAvatarElements();

		const cancel_match_making = document.getElementById("cancel-match-making");
		cancel_match_making.addEventListener("click", () => {
			window.game_socket.send(JSON.stringify({
				type: "cancel_match_making",
				user: current_user_data,
				game_name: this.selected_game,
			}));
			window.game_socket.onmessage = null;
			window.game_socket.close();
			delete window.game_socket;
			window.game_socket = null;

			if(this.updateTimerID)
				clearInterval(this.updateTimerID);


			this.render_first_stage();
		});
	}


	


	

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("play-page", Play_Page);
