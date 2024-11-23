const BACKEND_DOMAIN = "https://" + window.location.hostname + ":443";

const routes = {
    "^/$": "landing-page",
    "^/2FA/": "two-factor-authentication",
    "^/about_us/$": "aboutus-page",
    "^/chat/$": "chat-page",
    "^/chat/(server|direct)/[^\/]+$": "chat-page",
    "^/chat/browse_chat/$": "chat-browse",
    "^/chat/create_server/$": "create-server-page",
    "^/chat/edit_server/[^\/]+$": "edit-server-page",
    "^/chat/join_server/$": "join-server",
    "^/chat/[^\/]+$": "chat-page",
    "^/forgot_password/$": "forgot-routes",
    "^/home/$": "home-page",
    "^/leaderboard/$": "leaderboard-page",
    "^/login/$": "login-page",
    "^/notifications/$": "notifications-page",
    "^/play/$": "play-page",
    "^/play/game/[^/]+$" : "game-page",
    "^/privacy/$": "privacy-page",
    "^/profile/\\d+$": "profile-page",
    "^/settings/$": "settings-page",
    "^/shop/$": "shop-page",
    "^/signup/$": "signup-routes",
    "^/tournament/$": "tournament-page",
    "^/tournament/create_tournament/$": "tournament-create",
    "^/tournament/join_tournament/$": "join-tournament",
    "^/tournament/match/$": "tournament-match",
    
    404: "not-found-page",
};

const allowedRoutesWithoutOrWitLogin = [
    "^/about_us/$",
    "^/privacy/$",
];

// Update allowedRoutesWithoutLogin to use regex patterns as well
const allowedRoutesWithoutLogin = [
    "^/$",
    // "^/about_us/$",
    // "^/privacy/$",
    "^/login/$",
    "^/signup/$",
    "^/forgot_password/$",
    "^/2FA/"
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

function isAllowedWithoutOrWithLogin(path) {
    return allowedRoutesWithoutOrWitLogin.some(pattern => new RegExp(pattern).test(path));
}

function isAllowedWithoutLogin(path) {
    return allowedRoutesWithoutLogin.some(pattern => new RegExp(pattern).test(path));
}


async function handleLocationChange() {
    update_active_sidebar();

    let path = window.location.pathname;
    const component = matchRoute(path);
    const root_div = document.getElementById("root_div");

    try {
        await makeRequest("/api/auth/is_authenticated/");

        if (isAllowedWithoutLogin(path)) {
            GoTo("/home/");
            return;
        }    
       
        if (!root_div.querySelector("base-page")) {
            root_div.innerHTML = /*html*/ `<base-page></base-page>`;
        }

        const base_page = document.getElementById("base_page");
        base_page.innerHTML = `<${component}></${component}>`;
    }
    catch (error) {
        if ((isAllowedWithoutLogin(path) || isAllowedWithoutOrWithLogin(path) || component == routes[404] )) {
            root_div.innerHTML = `<${component}></${component}>`;
            return;
        }

        if (path !== ("/"))
            GoTo("/login/");

    }
}

window.onpopstate = handleLocationChange;

window.addEventListener("load", () => {
	handleLocationChange();
});


function logout() {
    makeRequest("/api/auth/logout/")
    .then((data) => {
        if (data.response_code === 200) {
            window.notification_socket.close();
            window.notification_socket = null;
            console.log("Logged out successfully");
            GoTo("/");
        }
    })
}