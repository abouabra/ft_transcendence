
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

	set_n_elements(){
		const containerHeight = document.querySelector('friends-servers-bar').offsetHeight;
		const friendsBar = document.querySelector('friends-bar');
		const serversBar = document.querySelector('servers-bar');
		
		// 50% for friends-bar, 40% for servers-bar, and 10% space
		const friendsBarHeight = containerHeight * 0.5;
		const serversBarHeight = containerHeight * 0.4;
		

		const friendsElements = Math.floor(friendsBarHeight / 62);
		const serversElements = Math.floor(serversBarHeight / 62);
		
		friendsBar.style.setProperty('--n-elements', friendsElements);
		serversBar.style.setProperty('--n-elements', serversElements);

	}

	connectedCallback() {

		window.addEventListener("load", () => {
			this.set_n_elements();
		});

		window.addEventListener("resize", () => {
			this.set_n_elements();
		});
	}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {
	}

}

customElements.define("friends-servers-bar", Friends_Servers_Bar);
