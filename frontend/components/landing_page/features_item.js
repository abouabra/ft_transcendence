export default class Features_Item extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/landing_page.css'));

		const header = this.getAttribute("data-header");
		const subheader = this.getAttribute("data-subheader");
		const image = this.getAttribute("data-image");
		const flip = this.getAttribute("data-flip");

		this.innerHTML = /*html*/`
		<div class="d-flex justify-content-between align-items-center w-100 flex-wrap">

			${flip === "true" ? `
				<div class="d-flex justify-content-center align-items-center flex-column cta_container">
					<h1 class="header_h1 primary_color_color">${header}</h1>
					<span class="p2_regular">
						${subheader}
					</span>
				</div>

				<img src="${image}" alt="landing_page_feature_image" class="">
			` : `
				<img src="${image}" alt="landing_page_feature_image" class="">

				<div class="d-flex justify-content-center align-items-center flex-column cta_container">
					<h1 class="header_h1 primary_color_color">${header}</h1>
					<span class="p2_regular">
						${subheader}
					</span>
				</div>
			`}
		</div>
		`;
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === "data-text") {
			const text = this.getAttribute("data-text");
			this.querySelector("span").innerText = text;
		}
		if(name === "data-type"){
			const type = this.getAttribute("data-type");
			if(type === "no-bg"){
				this.querySelector("button").classList.add("no-bg");
			}
		}
	}

	static get observedAttributes() {
		return ["data-header", "data-subheader", "data-image"];
	}
}

customElements.define("features-item", Features_Item);
