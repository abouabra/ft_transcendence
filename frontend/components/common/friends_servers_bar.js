
export default class Friends_Servers_Bar extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/common.css'));


		this.innerHTML = /*html*/`
			<friends-bar></friends-bar>
			<servers-bar></servers-bar>
		`;
		this.intervalID = setInterval(() => {
			this.innerHTML = /*html*/`
				<friends-bar></friends-bar>
				<servers-bar></servers-bar>
			`;
		}, 1000 * 60 * 5); // 5 minutes
	}


	set_n_elements(){
		if(this.intervalID == null)
			return;

		const containerHeight = document.querySelector('friends-servers-bar').clientHeight;
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

		window.addEventListener("DOMContentLoaded", () => {
			this.set_n_elements();
		});

		window.addEventListener("resize", () => {
			this.set_n_elements();
		});
	}

	disconnectedCallback() {
		console.log("clearing interval");
		clearInterval(this.intervalID);
		this.intervalID = null;
	}

	attributeChangedCallback(name, oldValue, newValue) {
	}

}

customElements.define("friends-servers-bar", Friends_Servers_Bar);
