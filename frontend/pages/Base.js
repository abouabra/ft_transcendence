
export default class Base_Page extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/base.css'));

		this.innerHTML = /* html */`
			<side-bar></side-bar>
		
			<div class="center-part" >
				
				<nav-header></nav-header>
				<friends-servers-bar></friends-servers-bar>
				<div class="d-flex w-100 h-100" style="overflow-x: auto;">
					<div style=" width: 100%; height: 10000px;margin-bottom: 80px;" id="base_page">
						<h1> Base Page </h1>
					</div>
				</div>
					
			
			</div>
		`;



		const center_part = document.querySelector('.center-part');
		const resizeObserver1 = new ResizeObserver(() => checkFlexWrap(center_part));
		resizeObserver1.observe(center_part);



	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("base-page", Base_Page);
