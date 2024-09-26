
export default class ChatBody extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/Chat_Server.css'));

		this.innerHTML = /* html */`
			<div class="chatbody-container">
				<div class="server-description">
					<img src="/assets/images/avatars/default.jpg">
					<div class="d-flex flex-column align-items-start">
						<span class="p1_bold">Server_name</span>
						<span class="p3_regular platinum_40_color">total_member</span>
					</div>
				</div>
				<div class="more-dots">
					<span class="dot-point"></span>
					<span class="dot-point"></span>
					<span class="dot-point"></span>
				</div>
			</div>
			
			<div class="message-body">
				<div class="message-text-container">
					<div>
						<img src="/assets/images/avatars/default.jpg">
					</div>
					<div class="d-flex flex-column">
						<div class="d-flex flex-row name-time">
							<span class="p2_bold">name</span>
							<span class="p4_regular platinum_40_color">timestamp</span>
						</div>
						<div class="message-block">
							<span class="p3_regular platinum_40_color">Waiting for your reply. As I have to go back soon. I have to travel long distance.Waiting for your reply. As I have to go back soon. I have to travel long distance.</span>
						</div>
					</div>
				</div>
			</div>
			<div class="send-msg-bar">
				<input type="text" placeholder="Type a message">
			</div>
		`;

	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("chat-body", ChatBody);
