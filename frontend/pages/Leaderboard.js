
export default class Leaderboard_Page extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/leaderboard_page.css'));

		this.innerHTML = /* html */`
			<h1> Leaderboard Page </h1>
		`;
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("leaderboard-page", Leaderboard_Page);
