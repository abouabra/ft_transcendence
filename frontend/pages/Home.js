
export default class Home_Page extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/home.css'));

		this.innerHTML = /* html */`
			<h1> Home Page </h1>

			<div class="d-flex w-100">
				<div class="d-flex">
					<home-slide-show></home-slide-show>
				</div>
			</div>
		`;
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("home-page", Home_Page);
