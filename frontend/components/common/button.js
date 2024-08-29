export default class Button_Component extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/common.css'));

		const text = this.getAttribute("data-text");


		this.innerHTML = /*html*/`
			<button class="button_component blur">
				<span class="p3_bold"> 
					${text}
				</span>	
			</button>
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
		return ["data-text", "data-type"];
	}
}

customElements.define("button-component", Button_Component);
