async function refreshAccessToken() {
	const fullUrl = `${BACKEND_DOMAIN}/api/auth/token/refresh/`;

	const headers = new Headers({
		"Content-Type": "application/json",
		Accept: "application/json",
	});

	try {
		const response = await fetch(fullUrl, {
			credentials: "include",
			method: "POST",
			headers,
		});

		if (!response.ok) {
			throw new Error("Failed to refresh token");
		}
	} catch (error) {
		throw error; // Re-throw the error to be caught in makeRequest
	}
}

async function makeRequest(url, method = "GET", data = null, retryCount = 1) {
	const fullUrl = `${BACKEND_DOMAIN}${url}`;

	const headers = new Headers({
		"Content-Type": "application/json",
		Accept: "application/json",
	});

	const options = {
		credentials: "include",
		method,
		headers,
		body: data ? JSON.stringify(data) : null,
	};

	let response = await fetch(fullUrl, options);
	
	if (response.status === 401) {
		if (response.url === `${BACKEND_DOMAIN}/api/auth/login/`) {
			let response_data = await response.json();
			throw new Error(response_data.error);
		} else if (retryCount > 0) {  // Limit the number of retries
			try {
				await refreshAccessToken();
				return await makeRequest(url, method, data, retryCount - 1);
			} catch (error) {
				let response_data = await response.json();
				throw new Error(response_data.error);
			}
		} else {
			throw new Error("Failed to refresh token after retrying.");
		}
	}

	if (response.status >= 400) {
		let response_data = await response.json();
		throw new Error(response_data.error);
	}

	// Parse JSON response
	const jsonResponse = await response.json();
	jsonResponse.response_code = response.status;

	return jsonResponse;
}


// Function to handle toast notifications based on response
function handleToastNotifications(response) {
	const toastType = "error";
	const toastData = JSON_TO_DATA(response);

	toastData.forEach((data) => showToast(toastType, data));
}

// Function to convert JSON to data for toast notifications
function JSON_TO_DATA(json) {
	if (typeof json !== "object" || json === null) {
		return [json];
	}

	return Object.keys(json)
		.filter((key) => key !== "response_code")
		.map((key) => json[key]);
}

function GoTo(url) {
	const current_url = window.location.pathname;
	
	if (current_url === url) return;

	
	window.history.pushState({}, "", url);
	handleLocationChange();
}

const toastDetails = {
	timer: 5000,
	success: {
		icon: "bi-check-circle-fill",
	},
	error: {
		icon: "bi-x-circle-fill",
	},
	warning: {
		icon: "bi-exclamation-triangle-fill",
	},
	info: {
		icon: "bi-info-circle-fill",
	},
};

const removeToast = (toast) => {
	toast.classList.add("hide");
	if (toast.timeoutId) clearTimeout(toast.timeoutId);
	setTimeout(() => toast.remove(), 1000);
};

const showToast = (type, text) => {
	const { icon } = toastDetails[type];
	const toast = document.createElement("li");
	toast.className = `toast_1 ${type}`;
	toast.innerHTML = `
		<div class="column">
			<i class="${icon}"></i>
			<span>${text}</span>
		</div>
		<i class="bi-x-lg" onclick="removeToast(this.parentElement)"></i>
	`;

	const notifications = document.querySelector(".notifications");
	notifications.appendChild(toast);
	toast.timeoutId = setTimeout(() => removeToast(toast), toastDetails.timer);
};

function createLink(url, rel = "stylesheet") {
	const link = document.createElement("link");
	link.rel = rel;
	link.href = url;
	return link;
}


function checkFlexWrap(container) {
    const children = Array.from(container.children);
    
    // Check if any child has wrapped
    let isWrapped = false;
    let prevBottom = children[0].getBoundingClientRect().bottom;

    for (let i = 1; i < children.length; i++) {
        const currentTop = children[i].getBoundingClientRect().top;
        if (currentTop > prevBottom) {
            isWrapped = true;
            break;
        }
    }

    // Update justify-content based on wrap status
    if (isWrapped) {
        container.style.justifyContent = 'center';
    } else {
        container.style.justifyContent = 'space-between';
    }
}


function navbar_check_only_one_active(item_to_show) {
	const user_bar_options = document.querySelector(".user-bar-options");
	const notifications_bar_options = document.querySelector(".notifications_bar_options");
	const search_user_bar_option = document.querySelector(".search-user-bar-option");


	if (item_to_show != "user-bar-options") {
		user_bar_options.classList.remove("show");
	}
	if (item_to_show != "notifications_bar_options") {
		notifications_bar_options.classList.remove("show");
	}
	if (item_to_show != "search-user-bar-option") {
		search_user_bar_option.classList.remove("show");
	}
}


function sendNotification(type, receiver_id, extra_data = null)
{
	let notification = {
		type: type,
		receiver_id: parseInt(receiver_id),
		sender_id: parseInt(localStorage.getItem("id")),
	};
	if (extra_data)
		notification = {...notification, ...extra_data};

	window.notification_socket.send(JSON.stringify(notification));
}


function Make_Small_Card(type, server_id = null, username_who_invited_you = null, avatar_who_invited_you = null, game_name = null, username_waiting_for = null, avatar_waiting_for = null, data_id_who_invited_you=null, data_id_waiting_for=null)
{
	const center_part = document.getElementById("base_page");
	center_part.innerHTML += `<small-cards data-type="${type}" data-server-id="${server_id}" data-username_who_invited_you="${username_who_invited_you}" data-avatar_who_invited_you="${avatar_who_invited_you}" data-game-name="${game_name}" data-username_waiting_for="${username_waiting_for}" data-avatar_waiting_for="${avatar_waiting_for}" data-id_who_invited_you="${data_id_who_invited_you}" data-id_waiting_for="${data_id_waiting_for}"></small-cards>`;

	// example for logout small card
	// Make_Small_Card("logout");
	
	// example for delete account small card
	// Make_Small_Card("delete_account");
	
	// example for delete server small card
	// Make_Small_Card("delete_server", 1);
	
	// example for leave server small card
	// Make_Small_Card("leave_server", 1);
	
	
	// example for join game small card
	// Make_Small_Card("join_game", null, 1, "abouabra", "/assets/images/avatars/abouabra.png", "Pong");
	
	
	// example for waiting for accept game small card
	// Make_Small_Card("waiting_for_accept_game", null, 1, null, null, "Pong", "default", "/assets/images/avatars/default.jpg");

}	

function Delete_Small_Card() {
	const elements = document.querySelectorAll("small-cards");

	for (let i = 0; i < elements.length; i++) {
		elements[i].classList.add('small-cards-end-animation');

		// Listen for the animation end event
		setTimeout(() => {
			elements[i].remove();
			console.log("small card removed");
		}, 1000);
	}
}

function update_active_sidebar() {
	const elements = document.querySelectorAll("side-bar-item");
	const current_path = window.location.pathname;
	const active_element = document.querySelector(".active_side_bar_item");
	
	if(active_element) 
		active_element.classList.remove("active_side_bar_item");

	elements.forEach((element) => {
		if (current_path.includes(element.getAttribute("data-link")))
			element.classList.add("active_side_bar_item");
	});
}



function change_display(first ,second) {
	const display_1 = document.querySelector(first);
	const display_2 = document.querySelector(second);

	display_1.outerHTML="";
	display_2.style.display = "block";
};

const handle_first_one = (type, element ) => async (event) => {
	event.preventDefault();

	const email = element.querySelector('input[name="email"]').value;
	if (!email) {
		showToast("error", "email is required");
		return;
	}

	const data = {
		email,
		type
	};

	try {
		const response = await makeRequest('/api/auth/verification_email/', 'POST', data);
		change_display("#displaay", "#displaaay");
		const response2 = await makeRequest('/api/auth/send-email/', 'POST', data);
	} catch (error) {
		showToast("error", error.message);
	}
};

const handleLoginGoogle = async (event) => {
	event.preventDefault();
	window.location.href = 'http://127.0.0.1:8000/oauth/login/google-oauth2/';
}

const handleLoginIntra = async (event) => {
	event.preventDefault();

	const clientId = "u-s4t2ud-b586afbf5e752427a0054088bc2d5356073ce239c3856370e319da8620f43d68"; 
	const redirectUri = "http://127.0.0.1:8000/api/auth/callback/";
	const authorizationUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;

	window.location.href = authorizationUrl;
};


