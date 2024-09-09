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
    "^/chat/$": "chat-page",
    "^/leaderboard/$": "leaderboard-page",
    "^/shop/$": "shop-page",
    "^/notifications/$": "notifications-page",
    "^/profile/\\d+$": "profile-page",
    "^/settings/$": "settings-page",
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
    console.log("handleLocationChange(): ", path);

    const component = matchRoute(path);
    const root_div = document.getElementById("root_div");

    if (isAllowedWithoutLogin(path) || component == routes[404]) {
        root_div.innerHTML = `<${component}></${component}>`;
        return;
    } else {
        if (!root_div.querySelector("base-page")) {
            root_div.innerHTML = /*html*/ `<base-page></base-page>`;
        }

        const base_page = document.getElementById("base_page");
        base_page.innerHTML = `<${component}></${component}>`;
        return;
    }

	// const response = await makeRequest("/api/auth/is_authenticated/");
	// const isAuthenticated = response.response_code === 200;

	// if (!isAuthenticated && path !== ("/"))
	// {
	// 	GoTo("/");
	// }

	// if (path === "/logout/") {
	// 	await makeRequest("/api/logout/", "POST");
	// 	GoTo("/");
	// }
}

window.onpopstate = handleLocationChange;


window.addEventListener("load", () => {
	handleLocationChange();
});
