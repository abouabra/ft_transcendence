function handle_action(action, id) {
	if (action === "goto_profile") {
		console.log("Going to profile", id);
		// GoTo(`/profile/${id}`);
	}
	else if (action === "invite_to_game") {
		console.log("Inviting to game", id);

	}
	else if (action === "go_to_direct") {
		console.log("Going to direct", id);

	}
	else if (action === "goto_settings")
	{
		console.log("Going to settings", id);
		// GoTo(`/settings/`);
	}
	else if (action === "logout")
	{
		console.log("Logout", id);
	}
	else if ("goto_notifications")
	{
		console.log("Notifications", id);
		GoTo('/notifications/')
	}
}