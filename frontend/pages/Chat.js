import ChatSideBar from "../components/chat/ChatSideBar.js";
import ChatBody from "../components/chat/ChatBody.js";



export default class Chat_Page extends HTMLElement {
	constructor() {
		super();

		
		const pathname = window.location.pathname;
		const servername = pathname.substring(6)
		if (servername)
			window.chat_socket = new WebSocket(`ws://${window.location.hostname}:8000/ws/chat/${servername}`);
			window.userpermition_socket = new WebSocket(`ws://${window.location.hostname}:8000/ws/chat/userpermition/${servername}`)
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/chat_page.css'));
		let ChatType= ''
		if (pathname == "/chat/")
			ChatType = 'Direct'

		let path = '/api/chat/server_info/'

		if (servername)
			path = `/api/chat/server_info/?server=${servername}`
		makeRequest(path).then(data=> {
			this.innerHTML = /* html */`
				<div class="w-100 h-100 d-flex align-items-center">
					<div class="d-flex w-100 platinum_40_color_border chat-container">
						<div class="side-message-container">
							<div class="d-flex flex-column justify-content-center align-items-center">
								<div class="search-input d-flex ">
									<img  class="images_chat" src="/assets/images/common/Iconly/Light/Search.svg">
									<input type="text" placeholder="Search" class="SidebarSearch" style="margin-right: 15px">
								</div>
							</div>
							<div class="select-party d-flex justify-content-center w-100">
								<span class="select-server p3_bold platinum_40_color" id="server-chat">Servers</span>
								<span class="select-direct p3_bold platinum_40_color" id="direct-chat">Direct</span>
							</div>
							<chat-side-bar class="Bar" type="${ChatType}"></chat-side-bar>
						</div>

						${ pathname == "/chat/" ?
						/* html*/ `
						<div class="message-container w-100 d-flex flex-column justify-content-center align-items-center">
							<div>
								<span class="header_h3">it's nice to chat with someone</span>
								<span><br>Pick a person from the left menu<br> and start a conversation</span>
							</div>
							<div class="d-flex flex-column" style="gap:10px">
								<button-component data-text="Create Server" onclick="GoTo('/chat/create_server/')"></button-component>
								<button-component data-text="Browse Servers" data-type="no-bg" onclick="GoTo('/chat/browse_chat/')"></button-component>
							</div>
						</div>
						` : /* html*/ `
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

			if (ChatType === "Direct")
			{
				Bar.setAttribute('type', 'Direct')
				Direct.classList.add("activedirection")
				Server.classList.remove("activedirection")
			}

			if (data.visibility === 'protected')
			{
				Bar.setAttribute('type', 'Direct')
				Direct.classList.add("activedirection")
				Server.classList.remove("activedirection")
			}
			else if (data.visibility === 'private' || data.visibility === 'public')
			{
				Bar.setAttribute('type', 'Server')
				Server.classList.add("activedirection")
				Direct.classList.remove("activedirection")
			}

			Direct.addEventListener('click', ()=>{
				if (Bar.getAttribute('type') !== "Direct")
				{
					Bar.setAttribute('type', 'Direct')
					Direct.classList.add("activedirection")
					Server.classList.remove("activedirection")
				}
			})
			Server.addEventListener('click', ()=>{
				if (Bar.getAttribute('type') !== "Server")
				{
					Bar.setAttribute('type', 'Server')
					Server.classList.add("activedirection")
					Direct.classList.remove("activedirection")
				}
			})
		
		}).catch(error => {
			console.log("channel not found");
			this.innerHTML = /* html */`
				<div class="d-flex justify-content-center align-items-center flex-column" style="gap: 50px">
					<span class="header_h1"> Channel does not exist </span>
					<button-component data-text="Go back to chat" onclick="GoTo('/chat/')"> </button-component>
				</div>
			`;
		});
	}

	connectedCallback() {
	}

	disconnectedCallback() {
		// this.removeEventListener('click',()=>{})
		// this.removeEventListener('change',()=>{})
		if (window.chat_socket && window.chat_socket.readyState !== Window.CLOSED)
			window.chat_socket.close()
		if (window.userpermition_socket && window.userpermition_socket.readyState !== Window.CLOSED)
			window.userpermition_socket.close()
		window.userpermition_socket = 0
		window.chat_socket = 0
	}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("chat-page", Chat_Page);

