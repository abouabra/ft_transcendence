import AboutUS_TechCard from "../components/chat/chatblock.js";

export default class Chat_Page extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/chat_page.css'));

		this.innerHTML = /* html */`
			<div class="d-flex w-100 h-100 platinum_40_color_border chat-container">
				<div class="friend-message-container  platinum_40_color_border">
					<div class="search-bar">
						<div class="search-input">
							<img src="/assets/images/common/Iconly/Light/Search_2.svg">
							<input type="text" value="Search">
						</div>
					</div>
					<div class="select-party d-flex justify-content-center w-100">
							<span class="select-server p2_regular platinum_40_color">Servers</span>
							<span class="select-direct p2_regular platinum_40_color">Direct</span>
					</div>
				<friend-side-msg></friend-side-msg>
				</div>
				<div class="message-container w-100 ">
					<div class="server-info">
						<h2>it's nice to chat with someone</h2>
						<p>pick a person from the left menu</p>
						<p>and start a conversation</p>
						<button-component id="create-button" data-text="Create Server"></button-component>
						<button-component data-text="Browse Servers" data-type="no-bg"></button-component>
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

