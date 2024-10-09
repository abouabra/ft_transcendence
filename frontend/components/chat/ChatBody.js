
export default class ChatBody extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/Chat_Server.css'));
		this.innerHTML = /* html */`
				<div class="chatbody-container">
					<div class="server-description">
						<img class="images_chat" src="/assets/images/avatars/default.jpg">
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
		`;
	}
		render_page(data)
		{
			if (data.visibility !== "protected")
				document.getElementsByClassName("Bar")[0].setAttribute('type', 'Server')
			data.map((data)=>{
				
				this.innerHTML += /* html */ `
				<div class="message-body">
					<div class="message-text-container">
						<div>
							<img class="images_chat" src=${data.avatar}>
						</div>
						<div class="d-flex flex-column">
							<div class="d-flex flex-row name-time">
								<span class="p2_bold">${data.username}</span>
								<span class="p4_regular platinum_40_color">${data.timestamp}</span>
							</div>
							<div class="message-block">
								<span class="p3_regular platinum_40_color">${data.content}</span>
							</div>
						</div>
					</div>
				</div>
			`;
			})
		}
	append_message(data)
	{
		this.innerHTML += /* html */ `
				<div class="message-body">
					<div class="message-text-container">
						<div>
							<img class="images_chat" src=${data.avatar}>
						</div>
						<div class="d-flex flex-column">
							<div class="d-flex flex-row name-time">
								<span class="p2_bold">${data.username}</span>
								<span class="p4_regular platinum_40_color">${data.timestamp}</span>
							</div>
							<div class="message-block">
								<span class="p3_regular platinum_40_color">${data.content}</span>
							</div>
						</div>
					</div>
				</div>`
	}
	connectedCallback() {
		let query_param = window.location.pathname.substring('/chat/').substring(13);
		if (query_param != undefined)
			makeRequest(`/api/chat/get_message_data/?chat=${query_param}`, 'GET')
			.then(data =>{
				if (data != null)
					this.render_page(data);
				// <chat-side-bar type='Direct' class="Bar"></chat-side-bar>
			})
	}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("chat-body", ChatBody);

