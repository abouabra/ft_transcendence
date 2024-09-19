export default class Create_Server_page extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/chat_create_server.css'));
		this.innerHTML = /* html */`
			<div class="w-100 h-100 d-flex align-items-center">
				<div class="creation-container d-flex w-100 platinum_40_color_border justify-content-center align-items-center">
					<div class="rules platinum_40_color_border d-flex flex-column justify-content-center align-items-center">
						<span class="header_h2">Rules</span>
						<span class="p2_regular ">Visibility Options:</span>
						<span class="p2_regular ">Public: Anyone can join the Server without restrictions.</span>
						<span class="p2_regular ">Private: member must enter the server’s password to join.</span>
					</div>
					<div class="rules platinum_40_color_border">
						<div class="d-flex flex-column justify-content-center align-items-center platinum_40_color_border">
							<span>Click to change</span>
							<span>Server avatar</span>
							<span>150x150 image required</span>
						</div>
						<div >
							<span class="p2_regular">Name</span>
						</div>
					</div>
					<div class="rules platinum_40_color_border">
					</div>
				</div>
			</div>
		`;
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("create-server-page", Create_Server_page);