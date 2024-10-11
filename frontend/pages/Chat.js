import ChatSideBar from "../components/chat/ChatSideBar.js";
import ChatBody from "../components/chat/ChatBody.js";


export default class Chat_Page extends HTMLElement {
	constructor() {
		super();

		
		const pathname = window.location.pathname;

		const head = document.head || document.getElementsByTagName("head")[0];




		head.appendChild(createLink('/styles/chat_page.css'));
		this.innerHTML = /* html */`
		<div class="w-100 h-100 d-flex align-items-center">
			<div class="d-flex w-100 platinum_40_color_border chat-container">
				<div class="side-message-container">
					<div class="d-flex flex-column justify-content-center align-items-center">
						<div class="search-input d-flex ">
							<img  class="images_chat" src="/assets/images/common/Iconly/Light/Search.svg">
							<input type="text" placeholder="Search" style="margin-right: 15px">
						</div>
					</div>
					<div class="select-party d-flex justify-content-center w-100">
							<span class="select-server p3_bold platinum_40_color" id="server-chat">Servers</span>
							<span class="select-direct p3_bold platinum_40_color" id="direct-chat">Direct</span>
					</div>
					<chat-side-bar type='' class="Bar"></chat-side-bar>
				</div>
				${ pathname == "/chat/" ?
				/* html*/ `
					<div class="message-container w-100 d-flex flex-column justify-content-center   align-items-center">
						<div>
							<span class="header_h3">it's nice to chat with someone</span>
							<span><br>Pick a person from the left menu<br> and start a conversation</span>
						</div>
						<div class="d-flex flex-column" style="gap:10px">
							<button-component data-text="Create Server" onclick="GoTo('/chat/create_server/')"></button-component>
							<button-component data-text="Browse Servers" data-type="no-bg" onclick="GoTo('/chat/browse_chat/')"></button-component>
						</div>
					</div>
				`
				: /* html*/ `
					<div class="message-container w-100">
						<chat-body></chat-body>
					</div>
				`}
			</div>
		</div>
		`;

		const Direct = this.getElementsByClassName("select-direct")[0];
		const Server = this.getElementsByClassName("select-server")[0];
		const Bar = this.getElementsByClassName("Bar")[0];


		Direct.addEventListener('click', ()=>{
			if (Bar.getAttribute('type') !== "Direct")
			{
				Bar.setAttribute('type', 'Direct')
			}
		})
		Server.addEventListener('click', ()=>{
			if (Bar.getAttribute('type') !== "Server")
				Bar.setAttribute('type', 'Server')
		})
		// const inputbr = document.querySelector('#send-msg-bar1');
		

		
	}

	connectedCallback() {
	}

	disconnectedCallback() {
		this.removeEventListener('click',()=>{})
		this.removeEventListener('change',()=>{})
	}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("chat-page", Chat_Page);

