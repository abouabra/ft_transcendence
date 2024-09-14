
export default class Home_Page extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/home.css'));

		this.innerHTML = /* html */`
			<h1> Home Page </h1>
			
			<!-- <small-cards data-type="join_game" data-username_who_invited_you="abouabra" data-avatar_who_invited_you="/assets/images/avatars/abouabra.png" data-game-name="Pong" data-game-id="1"></small-cards> -->
			
			
			<!-- <small-cards data-type="waiting_for_accept_game" data-username_waiting_for="default" data-avatar_waiting_for="/assets/images/avatars/default.jpg" data-game-name="Pong" data-game-id="1"></small-cards> -->



		`;
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("home-page", Home_Page);
