function handle_action(action, id) {

	if (action == "goto_profile") {
		console.log("Going to profile", id);
		GoTo(`/profile/${id}`);
	}
	else if (action == "invite_to_game") {
		console.log("Inviting to game", id);

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
		console.log("Logout", id);
	}
	else if (action == "goto_notifications")
	{
		console.log("Notifications", id);
		const notifications_bar_options = document.querySelector(".notifications_bar_options");
		notifications_bar_options.classList.remove("show");
		GoTo('/notifications/')
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

}