export default class AboutUS_TechCard extends HTMLElement {
	constructor() {
		super();

		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/about_us.css'));

		const name = this.getAttribute("data-name");
		const desciption = this.getAttribute("data-desciption");
		const image = this.getAttribute("data-image");


		this.innerHTML = /*html*/`
			<img src="${image}" alt="tech_image" class="tech_image">

			<div class="d-flex flex-column tech_card_container blur platinum_40_color_border ">
				<div class="d-flex flex-column" style="gap: 10px;">
					<span class="p4_regular platinum_40_color">Name</span>				
					<span class="p2_bold">${name}</span>
				</div>

				<div class="d-flex flex-column" style="gap: 10px;">
					<span class="p4_regular platinum_40_color"> Description </span>				
					<span class="p2_bold">${desciption}</span>
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

customElements.define("aboutus-techcard", AboutUS_TechCard);
