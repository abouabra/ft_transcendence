
export default class Servers_Bar extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/common.css'));

		

		const data = [
			{ "name": "Server 1", "icon": "/assets/images/about_us/bel-kdio.png", "link": "/chat/server/server1" },
			{ "name": "Server 2", "icon": "/assets/images/about_us/bel-kdio.png", "link": "/chat/server/server2" },
			{ "name": "Server 3", "icon": "/assets/images/about_us/bel-kdio.png", "link": "/chat/server/server3" },
			{ "name": "Server 4", "icon": "/assets/images/about_us/bel-kdio.png", "link": "/chat/server/server4" },
			{ "name": "Server 5", "icon": "/assets/images/about_us/bel-kdio.png", "link": "/chat/server/server5" },
			{ "name": "Server 6", "icon": "/assets/images/about_us/bel-kdio.png", "link": "/chat/server/server6" },
			{ "name": "Server 7", "icon": "/assets/images/about_us/bel-kdio.png", "link": "/chat/server/server7" },
			{ "name": "Server 8", "icon": "/assets/images/about_us/bel-kdio.png", "link": "/chat/server/server8" },
			{ "name": "Server 9", "icon": "/assets/images/about_us/bel-kdio.png", "link": "/chat/server/server9" },
			{ "name": "Server 10", "icon": "/assets/images/about_us/bel-kdio.png", "link": "/chat/server/server10" },
			{ "name": "Server 11", "icon": "/assets/images/about_us/bel-kdio.png", "link": "/chat/server/server11" },
			{ "name": "Server 12", "icon": "/assets/images/about_us/bel-kdio.png", "link": "/chat/server/server11" },
			{ "name": "Server 13", "icon": "/assets/images/about_us/bel-kdio.png", "link": "/chat/server/server11" },

		];
		

		this.innerHTML = /*html*/`
			${
				data.map((item) => {
					return /*html*/`
						<div class="servers_bar_item" data-link="${item.link}">
							<img src="${item.icon}" class="servers_bar_item_icon"/>
							<span class="p2_bold" style="white-space: nowrap;">${item.name}</span>
						</div>
					`;
				}).join('')
			}
		`;

		const items = this.querySelectorAll(".servers_bar_item");
		items.forEach((item) => {
			item.addEventListener('click', () => {
				GoTo(item.getAttribute('data-link'));
			}
		)});

		this.addEventListener('mouseleave', () => {
			this.scrollTop = 0;
		});
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {
	}

}

customElements.define("servers-bar", Servers_Bar);
