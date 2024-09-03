
export default class Base_Page extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/base.css'));

		this.innerHTML = /* html */`
			<side-bar></side-bar>

				<div style="
					width: 200px;
					height: 400px;
					background-color: red;">
					
					<h1> Base Page </h1>
				
				</div>

			<friends-servers-bar></friends-servers-bar>
		`;
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("base-page", Base_Page);
