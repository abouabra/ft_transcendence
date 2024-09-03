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

	// "/register/": "register-page",
	// "/login/": "login-page",

	"/": "landing-page",
	"/about_us/": "aboutus-page",
	"/home/": "home-page",
	"/base/": "base-page",
	// "/about/": "about-page",
	// "/contact/": "contact-page",
};

const arr = ["/", "/about_us/", "/home/", "/base/"];

async function handleLocationChange() {
	let path = window.location.pathname;
	const component = routes[path] || routes[404];

	if (arr.includes(path)) {
		const root_div = document.getElementById("root_div");
		root_div.innerHTML = `<${component}></${component}>`;
		return;
	}


	const response = await makeRequest("/api/auth/is_authenticated/");
	const isAuthenticated = response.response_code === 200;

	if (!isAuthenticated && path !== ("/") && component !== routes[404])
	{
		GoTo("/");
	}

	if (path === "/logout/") {
		await makeRequest("/api/logout/", "POST");
		GoTo("/");
	}


	const root_div = document.getElementById("root_div");

	if (isAuthenticated) {
		if (!root_div.querySelector("side-bar")) {
			root_div.innerHTML = `<side-bar></side-bar><${component}></${component}>`;
		} else {
			let root_div_children = root_div.children;
			root_div_children[1].outerHTML = `<${component}></${component}>`;
		}
	} else {
		root_div.innerHTML = `<${component}></${component}>`;
	}
}

window.onpopstate = handleLocationChange;

window.addEventListener("load", () => {
	handleLocationChange();
});
