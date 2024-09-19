import AboutUS_TechCard from "../components/chat/chatblock.js";

export default class Chat_Page extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/chat_page.css'));
		this.innerHTML = /* html */`
			<div class="w-100 h-100 d-flex align-items-center">
			<div class="d-flex w-100 platinum_40_color_border chat-container">
				<div class="friend-message-container">
					<div class="search-bar d-flex flex-column justify-content-center align-items-center">
						<div class="search-input d-flex ">
							<img src="/assets/images/common/Iconly/Light/Search_2.svg">
							<input type="text" placeholder="Search">
						</div>
					</div>
					<div class="select-party d-flex justify-content-center w-100">
							<span class="select-server p3_bold platinum_40_color">Servers</span>
							<span class="select-direct p3_bold platinum_40_color">Direct</span>
					</div>
					<friend-side-msg></friend-side-msg>
				</div>
				<div class="message-container w-100 d-flex flex-column justify-content-center   align-items-center">
					<div >
						<span class="header_h3">it's nice to chat with someone</span>
						<span><br>Pick a person from the left menu<br> and start a conversation</span>
					</div>
					<div class="d-flex flex-column" style="gap:10px">
						<button-component data-text="Create Server" onclick="GoTo('/chat/create_server/')"></button-component>
						<button-component data-text="Browse Servers" data-type="no-bg"></button-component>
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

customElements.define("chat-page", Chat_Page);

