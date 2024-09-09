
export default class Profile_Page extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/profile_page.css'));

		const user_id = window.location.pathname.split("/")[2];

		this.innerHTML = /* html */`
			<h1> Profile Page ${user_id}</h1>
		`;
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("profile-page", Profile_Page);
