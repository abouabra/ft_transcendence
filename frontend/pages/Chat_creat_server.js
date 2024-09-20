export default class Create_Server_page extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/chat_create_server.css'));
		this.innerHTML = /* html */`
			<div class="w-100 h-100 d-flex align-items-center">
				<div class="creation-container d-flex w-100 justify-content-center align-items-center platinum_40_color_border">
					<div class="cards platinum_40_color_border d-flex flex-column justify-content-center align-items-center">
						<span class="header_h2">Rules</span>
						<span class="p3_regular">. Visibility Options:</span>
						<span class="rol_text p3_regular">. Public: Anyone can join the Server without restrictions.</span>
						<span class="rol_text p3_regular">. Private: member must enter the server’s password to join.</span>
					</div>
					<div class="cards_1 d-flex flex-column">
						<div class="avatar_change d-flex flex-column justify-content-center align-items-center platinum_40_color_border">
							<span>Click to change</span>
							<span>Server avatar</span>
							<span>150x150 image required</span>
						</div>
						<div class="server_name platinum_40_color_border  d-flex flex-column justify-content-center align-items-center">
							<input type="text" placeholder="Name">
						</div>
						<div class="server_visibility platinum_40_color_border ">
							<select class="form-select1">
  								<option value="1">Public</option>
  								<option value="2">Private</option>
							</select>
						</div>
						<div class="server_password platinum_40_color_border  d-flex flex-column justify-content-center align-items-center">
							<input type="text" placeholder="Password">
						</div>
						<button-component data-text="Create Server" onclick="GoTo('/chat/create_server/')"></button-component>
					</div>
					<div class="cards_2 platinum_40_color_border d-flex flex-column align-items-center ">
						<span class="header_h2 ">Invite Link</span>
						<div class="qr_code"></div>
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