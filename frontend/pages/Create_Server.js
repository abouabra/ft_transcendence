
export default class Create_Server_Page extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/create_server_page.css'));

		this.innerHTML = /* html */`
			<h1> Create Chat Page </h1>
		`;
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("crate-server-page", Create_Server_Page);
