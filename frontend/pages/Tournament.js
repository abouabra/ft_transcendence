
export default class Tournament_Page extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/tournament_page.css'));

		this.innerHTML = /* html */`
			<h1> Tournament Page </h1>
		`;
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("tournament-page", Tournament_Page);
