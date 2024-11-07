export default class Not_Found_Page extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/not_found_page.css'));

		this.innerHTML = /* html */`
			<span class="header_h1">Page not found</span>

			<button-component data-text="Go to home" onclick="GoTo('/')"></button-component>
		`;
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("not-found-page", Not_Found_Page);
