
export default class Servers_Bar extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/common.css'));


		makeRequest("/api/chat/joined_servers/")
		.then((data) => {
			this.render_data(data);
		})
		.catch((error) => {
			showToast("error", error);
		});		
	}

	render_data(data)
	{
		this.innerHTML = /*html*/`
		${
			data.map((item) => {
					return /*html*/`
						<div class="servers_bar_item" data-link="/chat/${item.name}">
							<img src="${item.avatar}" class="servers_bar_item_icon"/>
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
