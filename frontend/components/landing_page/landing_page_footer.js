export default class Landing_Page_Footer extends HTMLElement {
	constructor() {
		super();

		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink("/styles/landing_page.css"));
		let text_span = this.getAttribute("text_span");
		if(!text_span)
			text_span = "GET STARTED";
		this.innerHTML = /*html*/ `
		<div class="d-flex w-100 justify-content-center" style="padding: 20px 0px">
			<div class="d-flex flex-column justify-content-center align-items-center" style="gap: 100px; width: max-content" >
				
				<div class="d-flex flex-wrap justify-content-center" style="gap: 20px" >
					<span class="header_h2 text-center">Play, Compete, and Conquer!</span>

					<button-component data-text='${text_span}' data-type="no-bg" > </button-component>
				</div>
				
				<div class="d-flex w-100 justify-content-between">
					<div class="d-flex flex-column" style="gap: 10px">
						<span class="p1_bold">
							Social
						</span>

						<div class="d-flex flex-column platinum_40_color" style="gap: 10px">
							<a class="p3_bold footer_sub_elements" href="https://github.com/abouabra/"> @abouabra </a>
							<a class="p3_bold footer_sub_elements" href="https://github.com/belkdioui/" > @bel-kdio </a>
							<a class="p3_bold footer_sub_elements" href="https://github.com/mbaanni"> @mbaanni </a>
						
						</div>
					
					</div>


					<div class="d-flex flex-column" style="gap: 10px">
						<span class="p1_bold">
							Privacy and terms
						</span>

						<div class="d-flex flex-column platinum_40_color" style="gap: 10px">
							<span class="p3_bold footer_sub_elements" data-link="/privacy/"> Privacy </span>
						</div>
					
					</div>


					<div class="d-flex flex-column" style="gap: 10px">
						<span class="p1_bold">
							About us
						</span>

						<div class="d-flex flex-column platinum_40_color" style="gap: 10px">
							<span class="p3_bold footer_sub_elements" data-link="/about_us/"> About us </span>					
						</div>
					
					</div>
				</div>
			</div>
		</div>
		`;

		this.querySelectorAll(".footer_sub_elements").forEach((element) => {
			element.addEventListener("click", () => {
				GoTo(element.getAttribute("data-link"));
			});
		});

		const get_started_button = this.querySelector("button-component");
		get_started_button.addEventListener("click", () => {
			GoTo("/signup/");
		});

	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === "data-text") {
			const text = this.getAttribute("data-text");
			this.querySelector("span").innerText = text;
		}
		if (name === "data-type") {
			const type = this.getAttribute("data-type");
			if (type === "no-bg") {
				this.querySelector("button").classList.add("no-bg");
			}
		}
	}
}

customElements.define("landing-page-footer", Landing_Page_Footer);
