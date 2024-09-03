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
}