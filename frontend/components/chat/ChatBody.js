
export default class ChatBody extends HTMLElement {
	constructor() {
		super();

		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/Chat_Server.css'));
	}

	async fetch_bar_data() {
		let result_data = '5awi'
		let server_name = location.pathname.split('/').pop()


		await makeRequest(`/api/chat/get_server_data/?server=${server_name}`, 'GET').then(data => {
			console.log(`data == = ${data[0].server_name}`)
			for (let i = 0; i < data.length; i++) {
				if (data[i].server_name === server_name) {
					result_data = data[i]
					break;
				}
			}
		})
		this.innerHTML = /* html */`
		<div class="chatbody-container">
		<div class="server-description">
		<img class="images_chat" src=${result_data.avatar}>
		<div class="d-flex flex-column align-items-start">
		<span class="p1_bold">${result_data.name}</span>
		<span class="p3_regular platinum_40_color">Total member: ${result_data.member.length}</span>
		</div>
		</div>
		<div class="more-dots">
		<span class="dot-point"></span>
		<span class="dot-point"></span>
		<span class="dot-point"></span>
		</div>
		</div>
		<div class="message_input">
		<input id="send-msg-bar1" placeholder="Text message">
		<img class="send_icone" src="/assets/images/common/Iconly/Bold/Send.svg">
		<div>
		`;
		let more_dot = this.querySelector(".more-dots")
		more_dot.addEventListener('click', ()=>{
			console.log("okokookokoko")
		})
	}
	render_page(data) {
		if (data.visibility !== "protected")
			document.getElementsByClassName("Bar")[0].setAttribute('type', 'Server')
		let result = ''
		data.map((data) => {

			result +=  /* html */ `
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
		this.innerHTML += result
	}
	append_message(data) {
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
	async connectedCallback() {

		const socket = new WebSocket('ws://localhost:8000/chat/f1');
		this.socket = socket
		await this.fetch_bar_data()
		const inputbr = this.querySelector('#send-msg-bar1');
		const inputicon = this.querySelector('.send_icone');

		inputicon.addEventListener('click', () => {
			// inputicon.dispatchEvent(new Event('change'));
			console.log("ccccccccllll")
		})
		inputbr.addEventListener('change', () => {
			const d = new Date();
			let date = ` ${d.getHours()}:${d.getMinutes()}${d.getHours() >= 12 ? 'PM' : 'AM'}`
			let data = {
				"avatar": localStorage.getItem('avatar'),
				"username": localStorage.getItem('username'),
				"content": inputbr.value,
				"timestamp": date
			}
			this.socket.send(JSON.stringify({
				"message": inputbr.value,
				"user_id": localStorage.getItem("id"),
				"server_name": window.location.pathname.substring(6)
			}))
			inputbr.value = ''
			document.querySelector("chat-body").append_message(data)
		});
		let query_param = window.location.pathname.split('/').pop();
		if (query_param != undefined) {
			await makeRequest(`/api/chat/get_message_data/?chat=${query_param}`, 'GET')
				.then(data => {
					if (data != null)
						this.render_page(data);
				})
		}
	}

	disconnectedCallback() { }

	attributeChangedCallback(name, oldValue, newValue) { }
}

customElements.define("chat-body", ChatBody);

