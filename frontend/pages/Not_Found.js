export default class Not_Found_Page extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/not_found_page.css'));

		let text_span = this.getAttribute("text_span");
		let text_button = this.getAttribute("text_button");
		let go_to = this.getAttribute("go_to");
		if(!text_span)
			text_span = "Page not found";
		if(!text_button)
			text_button = "Go to home";
		if(!go_to)
			go_to = "/"
		this.innerHTML = /* html */`
			<span class="header_h1">${text_span}</span>

			<button-component data-text="${text_button}" onclick="GoTo('${go_to}')"></button-component>
		`;
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("not-found-page", Not_Found_Page);
