const BACKEND_DOMAIN = "http://" + window.location.hostname + ":8000";

const routes = {
    404: "not-found-page",

    "^/$": "landing-page",
    "^/about_us/$": "aboutus-page",
    "^/privacy/$": "privacy-page",
    
    "^/base/$": "base-page",

    "^/play/$": "play-page",
    "^/home/$": "home-page",
    "^/tournament/$": "tournament-page",
    "^/tournament/join/$": "join-tournament",
    "^/tournament/create_tournament/$": "tournament-create",
    "^/leaderboard/$": "leaderboard-page",
    "^/shop/$": "shop-page",
    "^/notifications/$": "notifications-page",
    "^/profile/\\d+$": "profile-page",
    "^/settings/$": "settings-page",
    
    "^/chat/create_server/$": "create-server-page",
    "^/chat/edit_server/[^\/]+$": "edit-server-page",
    "^/chat/$": "chat-page",
    "^/chat/[^\/]+$": "chat-page",
    "^/chat/browse_chat/$": "chat-browse",
    "^/chat/join_server/$": "join-server",

};

// Update allowedRoutesWithoutLogin to use regex patterns as well
const allowedRoutesWithoutLogin = [
    "^/$",
    "^/about_us/$",
    "^/privacy/$",
    "^/base/$"
];


function matchRoute(path) {
    for (let pattern in routes) {
        const regex = new RegExp(pattern);
        if (regex.test(path)) {
            return routes[pattern];
        }
    }
    return routes[404]; // Fallback to 404 if no match
}

function isAllowedWithoutLogin(path) {
    return allowedRoutesWithoutLogin.some(pattern => new RegExp(pattern).test(path));
}


async function handleLocationChange() {
    let path = window.location.pathname;

    const component = matchRoute(path);
    const root_div = document.getElementById("root_div");

    
    if (isAllowedWithoutLogin(path) || component == routes[404]) {
        root_div.innerHTML = `<${component}></${component}>`;
        return;
    }

    const response = await makeRequest("/api/auth/is_authenticated/");
	const isAuthenticated = response.response_code === 200;
   
	if (!isAuthenticated && path !== ("/"))
	{
		GoTo("/");
        return;
	}


    if (!root_div.querySelector("base-page")) {
        root_div.innerHTML = /*html*/ `<base-page></base-page>`;
    }

    const base_page = document.getElementById("base_page");
    base_page.innerHTML = `<${component}></${component}>`;

}

window.onpopstate = handleLocationChange;

window.addEventListener("load", () => {
	handleLocationChange();
});


function login(username, password) {
    makeRequest("/api/auth/token/", "POST", {
        username: username,
        password: password
    })
    .then((data) => {
        if (data.response_code === 200) {
            console.log("Logged in successfully");
            GoTo("/home/");
        }
    })
}

function logout() {
    makeRequest("/api/auth/logout/")
    .then((data) => {
        if (data.response_code === 200) {
            console.log("Logged out successfully");
            GoTo("/");
        }
    })
}
