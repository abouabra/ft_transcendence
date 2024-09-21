
export default class Home_Page extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/home.css'));

		this.innerHTML = /* html */`
			<div class="d-flex w-100 flex-wrap overflow-hidden">
				<div class="d-flex">
					<home-slide-show></home-slide-show>
				</div>

				<div class="d-flex" style="width: 200px; height: 300px; background-color: chocolate;">
				</div>
			</div>
		`;

		
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("home-page", Home_Page);
