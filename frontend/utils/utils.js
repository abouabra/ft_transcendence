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

const TOAST_URLS = ["/api/auth/is_authenticated/", "/api/auth/token/refresh/"];

async function makeRequest(url, method = "GET", data = null) {
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

	try {
		let response = await fetch(fullUrl, options);

		// If unauthorized, try refreshing the token and retrying
		if (response.status === 401) {
			await refreshAccessToken();
			return await makeRequest(url, method, data); // Retry with incremented depth
		}

		// Parse JSON response
		const jsonResponse = await response.json();
		jsonResponse.response_code = response.status;


		// Handle toast notifications
		// if (TOAST_URLS.includes(url)) {
		// 	handleToastNotifications(jsonResponse);
		// }

		return jsonResponse;
	} catch (error) {
		// Handle error response
		const errorResponse = {
			response_code: 500,
			detail: error.message,
		};

		// if (!BANNED_TOAST_URLS.includes(url)) {
			handleToastNotifications(errorResponse);
		// }

		return errorResponse;
	}
}

// Function to handle toast notifications based on response
function handleToastNotifications(response) {
	// const toastType = response.response_code >= 400 ? "error" : "success";
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

	console.log("GoTo(): ", url);

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