function handle_action(action, id) {

	if (action == "goto_profile") {
		console.log("Going to profile", id);
		GoTo(`/profile/${id}`);
	}
	else if (action == "invite_to_game") {
		console.log("Inviting to game", id);

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
	

}