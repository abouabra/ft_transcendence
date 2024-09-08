export default class AboutUS_UserCard extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/aboutus_usercard.css'));

		const name = this.getAttribute("data-name");
		const expertise = this.getAttribute("data-expertise");
		const image = this.getAttribute("data-image");
		const github = this.getAttribute("data-github");
		const linkedin = this.getAttribute("data-linkedin");


		this.innerHTML = /*html*/`
			<img src="${image}" alt="user_image" class="user_image">

			<div class="d-flex flex-column user_card_container blur platinum_40_color_border ">
				<div class="d-flex flex-column" style="gap: 10px;">
					<span class="p4_regular platinum_40_color">Name</span>				
					<span class="p2_bold">${name}</span>
				</div>

				<div class="d-flex flex-column" style="gap: 10px;">
					<span class="p4_regular platinum_40_color">Expertise</span>				
					<span class="p2_bold">${expertise}</span>
				</div>

				<div class="d-flex flex-column w-100" style="gap: 10px;">
					<span class="p4_regular platinum_40_color">contacts</span>				
					
					<div class="d-flex flex-direction w-100 justify-content-around">
						<a href="${github}">
							<img src="/assets/images/about_us/github.png" alt="github" class="social_icon">
						</a>

						<a href="${linkedin}">
							<img src="/assets/images/about_us/linkedin.png" alt="linkedin" class="social_icon">
						</a>
					</div>
				</div>
			</div>
		`;
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {
	}

	static get observedAttributes() {
		return [""];
	}
}

customElements.define("aboutus-usercard", AboutUS_UserCard);
