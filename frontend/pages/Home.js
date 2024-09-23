
export default class Home_Page extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/home.css'));

		this.innerHTML = /* html */`
			<div class="d-flex w-100 flex-wrap overflow-hidden align-items-center home-page-main-container">
				<div class="d-flex">
					<home-slide-show></home-slide-show>
				</div>
				<home-leaderboard></home-leaderboard>
				<home-active-games></home-active-games>
				<home-active-tournaments></home-active-tournaments>
				<home-time-played></home-time-played>
			</div>

			
		`;	
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("home-page", Home_Page);
