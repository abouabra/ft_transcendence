export default class Nav_Header extends HTMLElement {
	constructor() {
		super();

		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink("/styles/common.css"));
		
		makeRequest("/api/auth/me/")
		.then((user) => {
			console.log(user);	

			this.innerHTML = /*html*/ `
				<div class="d-flex align-items-end" style="gap: 2px; flex-wrap: wrap;" id="welcome_back_user">
					<span class="header_h4">welcome back, </span>
					<span class="header_h1 primary_color_color" style="line-height: 1">${user.username}</span>
				</div>

				<div class="d-flex align-items-end" style="gap: 14px; z-index: 4">
					<search-bar></search-bar>
					<notifications-bar></notifications-bar>
					<user-bar data-userid=${user.id}   data-avatar=${user.avatar}></user-bar>
				</div>
			`;


			const nav_header = document.querySelector('nav-header');
			const resizeObserver = new ResizeObserver(() => checkFlexWrap(nav_header));
			resizeObserver.observe(nav_header);
		
			const welcome_back_user = document.querySelector('#welcome_back_user');
			const resizeObserver2 = new ResizeObserver(() => checkFlexWrap(welcome_back_user));
			resizeObserver2.observe(welcome_back_user);
		
			}).catch(error => {
			showToast("error", error);
		});
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("nav-header", Nav_Header);
