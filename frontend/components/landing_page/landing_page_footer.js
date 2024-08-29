export default class Landing_Page_Footer extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/landing_page.css'));

		this.innerHTML = /*html*/`
		<div class="d-flex w-100 justify-content-center" style="padding: 20px 0px">
		<div class="d-flex flex-column justify-content-center align-items-center" style="gap: 100px; width: max-content" >
			
			<div class="d-flex flex-wrap" style="gap: 20px" >
				<span class="header_h2">Play, Compete, and Conquer!</span>

				<button-component data-text='GET STARTED' data-type="no-bg" > </button-component>
			</div>
			
			<div class="d-flex w-100 justify-content-between">
				<div class="d-flex flex-column" style="gap: 10px">
					<span class="p1_bold">
						Social
					</span>

					<div class="d-flex flex-column platinum_40_color" style="gap: 10px">
						<span class="p3_bold"> @abouabra </span>
						<span class="p3_bold"> @bel-kdio </span>
						<span class="p3_bold"> @mbaanni </span>
					
					</div>
				
				</div>


				<div class="d-flex flex-column" style="gap: 10px">
					<span class="p1_bold">
						Privacy and terms
					</span>

					<div class="d-flex flex-column platinum_40_color" style="gap: 10px">
						<span class="p3_bold"> Privacy </span>
					</div>
				
				</div>


				<div class="d-flex flex-column" style="gap: 10px">
					<span class="p1_bold">
						About us
					</span>

					<div class="d-flex flex-column platinum_40_color" style="gap: 10px">
						<span class="p3_bold"> About us </span>					
					</div>
				
				</div>
			</div>
		</div>
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

}

customElements.define("landing-page-footer", Landing_Page_Footer);
