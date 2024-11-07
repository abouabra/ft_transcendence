import Tournament_Browse from "./Tournament_search.js";

export default class Tournament_Page extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/tournament_page.css'));

		this.innerHTML = /* html */`
			<tournament-browse></tournament-browse>
		`;
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("tournament-page", Tournament_Page);
