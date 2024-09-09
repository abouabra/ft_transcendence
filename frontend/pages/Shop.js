
export default class Shop_Page extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/shop_page.css'));

		this.innerHTML = /* html */`
			<h1> Shop Page </h1>
		`;
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("shop-page", Shop_Page);
