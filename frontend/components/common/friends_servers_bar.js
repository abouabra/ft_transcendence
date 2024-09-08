
export default class Friends_Servers_Bar extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/common.css'));


		this.innerHTML = /*html*/`
			<friends-bar></friends-bar>
			<servers-bar></servers-bar>
		`;
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {
	}

}

customElements.define("friends-servers-bar", Friends_Servers_Bar);
