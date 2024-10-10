
export default class Notifications_Page extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/notifications_page.css'));

		this.innerHTML = /* html */`
			<h1> Notifications Page </h1>
		`;
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("notifications-page", Notifications_Page);
