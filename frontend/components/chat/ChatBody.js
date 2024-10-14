
export default class ChatBody extends HTMLElement {
	constructor() {
		super();

		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/chat_server.css'));

		const socket = new WebSocket('ws://localhost:8000/chat/f1');
		this.socket = socket

		let result_data = '5awi'
		let server_name = location.pathname.split('/').pop()


		makeRequest(`/api/chat/get_server_data/?server=${server_name}`, 'GET').then(data => {
			console.log(`data == = ${data[0].server_name}`)
			for (let i = 0; i < data.length; i++) {
				if (data[i].server_name === server_name) {
					result_data = data[i]
					break;
				}
			}
			this.innerHTML = /* html */`
			<div class="chatbodymain">
				<div class="chatbody-container">
					<div class="server-description">
						<img class="images_chat" src=${result_data.avatar}>
						<div class="d-flex flex-column align-items-start">
							<span class="p1_bold">${result_data.name}</span>
							${ result_data.visibility === "protected" ? `<span class="p3_regular platinum_40_color">${result_data.status}</span>`
								: `<span class="p3_regular platinum_40_color">Total member: ${result_data.member.length+1}</span>`
							}
						</div>
					</div>
					<div class="more-dots">
						<span class="dot-point"></span>
						<span class="dot-point"></span>
						<span class="dot-point"></span>
					</div>
				</div>
				<div class="messagetext"></div>
				<div class="message_input">
					<input id="send-msg-bar1" placeholder="Text message">
					<img class="send_icone" src="/assets/images/common/Iconly/Bold/Send.svg">
				</div>
			</div>
			`;
			let more_dot = this.querySelector(".more-dots")
			more_dot.addEventListener('click', ()=>{
				console.log("okokookokoko")
			})
			const inputbr = this.querySelector('#send-msg-bar1');
			const inputicon = this.querySelector('.send_icone');
			inputicon.addEventListener('click', () => {
				inputicon.dispatchEvent(new Event('change'));
			})
			inputbr.addEventListener('change', () => {
				this.socket.send(JSON.stringify({
					"avatar":localStorage.getItem('avatar'),
					"username": localStorage.getItem('username'),
					"message": inputbr.value,
					"user_id": localStorage.getItem("id"),
					"server_name": window.location.pathname.substring(6)
				}))
				inputbr.value = ''
			});
			let query_param = window.location.pathname.split('/').pop();
			if (query_param != undefined) {
				makeRequest(`/api/chat/get_message_data/?chat=${query_param}`, 'GET')
				.then(data => {
					if (data != null)
					this.render_page(data);
			})
		}
		const messagecontainer = document.querySelector(".messagetext")
		socket.onmessage = (event)=>{
			this.append_message(JSON.parse(event.data))
			messagecontainer.scrollTop = messagecontainer.scrollHeight
		}
	})

	}


	render_page(data) {
		if (data.visibility !== "protected")
			document.getElementsByClassName("Bar")[0].setAttribute('type', 'Server')
		let result = ''
		data.map((data) => {

		let divmessage_body = document.createElement('div')
		divmessage_body.classList.add('message-body')
		divmessage_body.innerHTML = /* html */ `
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
		`

			document.querySelector(".messagetext").appendChild(divmessage_body)
			let messagecontainer = document.querySelector(".messagetext")
			messagecontainer.scrollTop = messagecontainer.scrollHeight
		})
	}
	append_message(data) {
		let divmessage_body = document.createElement('div')
		divmessage_body.classList.add('message-body')
		
		divmessage_body.innerHTML = /* html */ `
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
							<span class="p3_regular platinum_40_color">${data.message}</span>
						</div>
					</div>
				</div>
		`
			document.querySelector(".messagetext").appendChild(divmessage_body)
	}
	connectedCallback() {}

	disconnectedCallback() { }

	attributeChangedCallback(name, oldValue, newValue) { }
}

customElements.define("chat-body", ChatBody);

