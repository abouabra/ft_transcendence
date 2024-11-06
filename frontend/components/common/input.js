export default class Input_Component extends HTMLElement {
	constructor() {
		super();

		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/common.css'));
        const type = this.getAttribute("type") || "text";
        const placeholder = this.getAttribute("placeholder") || "";
        const namee = this.getAttribute("name") || "";
        this.innerHTML = /*html*/`
            <input class="p3_regular platinum_color" 
                   type="${type}" 
                   placeholder="${placeholder}" 
                   name="${namee}" 
                   required>
		`;
    }
    static get observedAttributes() {
		return ['type', 'placeholder', 'name'];
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}

}

customElements.define("input-component", Input_Component);
