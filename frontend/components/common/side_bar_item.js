export default class Side_Bar_Item extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/common.css'));

		// 

		const icon = '/assets/images/common/Iconly/' + this.getAttribute("data-icon");
		const text = this.getAttribute('data-text');
		const link = this.getAttribute('data-link');

		this.innerHTML = /*html*/`
			<div class="side_bar_item_icon_container">
				<img src="${icon}" class="side_bar_item_icon"/>
			</div>

			<span class="p2_bold" style="white-space: nowrap;">${text}</span>
		`;
		this.addEventListener("click", () => {
			GoTo(link);
		});

	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {
	}

	static get observedAttributes() {
		return [""];
	}
}

customElements.define("side-bar-item", Side_Bar_Item);
