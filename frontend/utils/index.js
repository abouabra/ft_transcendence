const BACKEND_DOMAIN = "http://" + window.location.hostname + ":8000";

function route(event) {
	const clickedLink = event.target.closest("a");
	const href = clickedLink && clickedLink.href;
	if (!href) return;

	event.preventDefault();
	window.history.pushState({}, "", href);

	handleLocationChange();
}

const routes = {
	404: "not-found-page",

	"/": "landing-page",
	"/about_us/": "aboutus-page",
	"/privacy/": "privacy-page",
	
	"/base/": "base-page",

	"/play/": "play-page",
	"/home/": "home-page",
};

const allowedRoutesWithoutLogin = ["/", "/about_us/", "/privacy/", "/base/"];

async function handleLocationChange() {
	let path = window.location.pathname;
	console.log(path);
	const component = routes[path] || routes[404];
	const root_div = document.getElementById("root_div");

	if (allowedRoutesWithoutLogin.includes(path) || component == routes[404]) {
		root_div.innerHTML = `<${component}></${component}>`;
		return;
	}
	else
	{
		if (!root_div.querySelector("base-component")) {
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
