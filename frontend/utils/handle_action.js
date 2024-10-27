function handle_action(action, id, data = null) {

	if (action == "goto_profile") {
		console.log("Going to profile", id);
		GoTo(`/profile/${id}`);
	}



	else if (action == "invite_to_pong") {
		console.log("Inviting to Pong Game", id);

		let extra_data = {
			game_name: "Pong",
			game_id: 33, // call an api to get the game id
		}

		if (data)
			extra_data = {...extra_data, ...data};
		sendNotification("game_invitation", id, extra_data);


		Make_Small_Card("waiting_for_accept_game", null, null, null, extra_data.game_name, extra_data.username, extra_data.avatar, null, id);
	}
	else if (action == "invite_to_space_invaders") {
		console.log("Inviting to Space Invaders Game", id);

		let extra_data = {
			game_name: "Space Invaders",
			game_id: 42,  // call an api to get the game id
		}

		if (data)
			extra_data = {...extra_data, ...data};
		sendNotification("game_invitation", id, extra_data);


		Make_Small_Card("waiting_for_accept_game", null, null, null, extra_data.game_name, extra_data.username, extra_data.avatar, null, id);
	}
	


	else if (action == "join_game") {
		console.log("Joining game", id);
		data = JSON.parse(data);
		data.opponent_id = parseInt(data.opponent_id);
		console.log("Extra data: ", data);
		makeRequest("/api/game/construct_game/", "POST", {
			game_name: data.game_name,
			user_id: parseInt(localStorage.getItem("id")),
			opponent_id: data.opponent_id,
			game_type: "ranked",
		}).then((data) => {
			GoTo(`/play/game/${data.game_room_id}`);
		});


	}

	else if (action == "go_to_direct") {
		console.log("Going to direct", id);

	}
	else if (action == "goto_settings")
	{
		console.log("Going to settings", id);
		GoTo(`/settings/`);
	}
	else if (action == "logout")
	{
		Make_Small_Card("logout");
		console.log("Logout", id);
	}
	else if (action == "logout_confirmed")
	{
		console.log("Logout Confirmed", id);
		//call an api to logout then redirect to landing page
		logout();
	}
	else if (action == "delete_server")
	{
		console.log("Delete server", id);
	}
	else if (action == "leave_server")
	{
		console.log("Leave server", id);
	}
	else if (action == "delete_account")
	{
		console.log("Delete account", id);
	}
	else if (action == "cancel_game_invitation")
	{
		console.log("Cancel game invitation", id);
		Delete_Small_Card();
	}
	else if (action == "reveal_opponent")
	{
		const roller = document.querySelector('.avatar-roller');
		const opponentAvatar = document.getElementById('opponentAvatar');
		const statusText = document.getElementById('match-making-user-status-text');

		// Start slowing down the animation
		roller.classList.add('slowing');

		const timer = document.querySelector('.match-making-timer-bar .header_h1');
		let seconds = 6;

		function ReverseUpdateTimer() {
			seconds--;
			
			if(seconds === -1) {
				seconds = 0;
			}

			timer.textContent = `00 : 0${seconds}`;
		}

		const updateTimerID = setInterval(ReverseUpdateTimer, 1000);

		setTimeout(() => {
			// Stop the animation
			roller.classList.remove('slowing');
			roller.classList.add('stopped');

			// Show opponent's avatar
			opponentAvatar.src = data.opponent.avatar;
			opponentAvatar.classList.add('visible');
			
			// Update status text
			statusText.textContent = data.opponent.username;

			setTimeout(() => {
				clearInterval(updateTimerID);
				GoTo(`/play/game/${data.game_room_id}`);
			}, 3000);

		}, 3000);


	}

}