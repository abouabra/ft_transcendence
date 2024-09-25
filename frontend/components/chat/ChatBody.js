
export default class Chat_Server extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/Chat_Server.css'));

		this.innerHTML = /* html */`
		<div class="w-100 h-100 d-flex align-items-center">
			<div class="d-flex w-100 platinum_40_color_border chat-container">
				<div class="side-message-container">
					<div class="d-flex flex-column justify-content-center align-items-center">
						<div class="search-input d-flex ">
							<img src="/assets/images/common/Iconly/Light/Search.svg">
							<input type="text" placeholder="Search" style="margin-right: 15px">
						</div>
					</div>
					<div class="select-party d-flex justify-content-center w-100">
							<span class="select-server p3_bold platinum_40_color" id="server-chat" name="Server">Servers</span>
							<span class="select-direct p3_bold platinum_40_color" id="direct-chat" name="Direct">Direct</span>
					</div>
					<chat-side-bar type="Direct" class="Bar"></chat-side-bar>
				</div>
				<div class="message-container w-100">
					<div class="chat-header d-flex flex-row justify-content-between">
						<div>
							<img src="/assets/images/avatars/default.jpg">
							<div class="d-flex flex-column">
								<span>server name</span>
								<span>total member online</span>
							</div>
							</div>
						<div class="option-button">
							<span>...</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		`;

	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("chat-server", Chat_Server);
