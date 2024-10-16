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


		Make_Small_Card("waiting_for_accept_game", null, null, null, null, extra_data.game_name, extra_data.username, extra_data.avatar, null, id);
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


		Make_Small_Card("waiting_for_accept_game", null, null, null, null, extra_data.game_name, extra_data.username, extra_data.avatar, null, id);
	}
	else if (action == "invite_to_road_fighter") {
		console.log("Inviting to Road Fighter Game", id);

		let extra_data = {
			game_name: "Road Fighter",
			game_id: 7,  // call an api to get the game id
		}

		if (data)
			extra_data = {...extra_data, ...data};
		sendNotification("game_invitation", id, extra_data);


		Make_Small_Card("waiting_for_accept_game", null, null, null, null, extra_data.game_name, extra_data.username, extra_data.avatar, null, id);
	}
	


	else if (action == "join_game") {
		console.log("Joining game", id);
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
		const statusText = document.getElementById('statusText');

		// Start slowing down the animation
		roller.classList.add('slowing');
		
		setTimeout(() => {
			// Stop the animation
			roller.classList.remove('slowing');
			roller.classList.add('stopped');
			
			// Show opponent's avatar
			opponentAvatar.src = data.avatar;
			opponentAvatar.classList.add('visible');
			
			// Update status text
			statusText.textContent = data.username;
		}, 3000); // Adjust this time to match the slowing animation duration
	}

}