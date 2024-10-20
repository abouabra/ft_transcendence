
export default class ChatBody extends HTMLElement {
	constructor() {
		super();

		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/chat_server.css'));

		const socket = new WebSocket('ws://localhost:8000/chat/f1');
		this.socket = socket

		let result_data = ''
		this.server_name = location.pathname.split('/').pop()


		makeRequest(`/api/chat/get_server_data/?server=${this.server_name}`, 'GET').then(data => {
			console.log(`data == = ${data[0].server_name}`)
			for (let i = 0; i < data.length; i++) {
				if (data[i].server_name === this.server_name) {
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
				<div class="messagebar_input">
					<textarea class="message_input" id="send-msg-bar1" placeholder="Type a message"></textarea>
					<img class="send_icone" src="/assets/images/common/Iconly/Bold/Send.svg">
				</div>
			</div>
			`;

			this.messagecontainer = document.querySelector(".messagetext");
			this.inputbr = this.querySelector('#send-msg-bar1');
			//dot more block
			let more_dot = this.querySelector(".more-dots")
			more_dot.addEventListener('click', ()=>{
				console.log("okokookokoko")
			})

			const inputicon = this.querySelector('.send_icone');
			function send_message_event(text, socket)
			{
				if (text)
				{
					socket.send(JSON.stringify({
						"avatar":localStorage.getItem('avatar'),
						"username": localStorage.getItem('username'),
						"content": text,
						"user_id": localStorage.getItem("id"),
						"server_name": window.location.pathname.substring(6)
					}))
				}
			}
			inputicon.addEventListener('click', () => {
				send_message_event(this.inputbr.value.trim(), this.socket)
				this.inputbr.value = ''
				this.inputbr.style.height = "44px"
			})
			this.inputbr.addEventListener('input', (event) => {
				this.textAreaAdjust();
			});

			this.inputbr.addEventListener('keydown', (event) => {
				if (event.key === 'Enter' && !event.shiftKey)
				{
					event.preventDefault();
					send_message_event(this.inputbr.value.trim(), this.socket)
					this.inputbr.value = ""
					this.textAreaAdjust();
				}
			});

			let query_param = window.location.pathname.split('/').pop();
			if (query_param != undefined) {
				makeRequest(`/api/chat/get_message_data/?chat=${query_param}`, 'GET')
				.then(data => {
					if (data != null)
					{
						this.render_page(data);
				 		this.messagecontainer.scrollTop = this.messagecontainer.scrollHeight
					}
			})
		}
		socket.onmessage = (event)=>{
			console.log(`message received = ${event.data}`)
			this.append_message(JSON.parse(event.data))
			let sidechat = document.querySelector("chat-side-bar")
			sidechat.setAttribute('type', sidechat.getAttribute('type'))
			this.messagecontainer.scrollTop = this.messagecontainer.scrollHeight
		}
	})

	}
	
	textAreaAdjust() {
		this.inputbr.style.height = "44px";
		this.inputbr.style.height = (this.inputbr.scrollHeight)+"px";
		this.messagecontainer.scrollTop = this.messagecontainer.scrollHeight
	}

	render_page(data) {
		data.map((data) => {
			this.render_messageblock(data)
		})
		this.textAreaAdjust();	
	}
	append_message(data) {
		console.log(`message send = ${data.content}`)
		this.render_messageblock(data)
	}


	render_messageblock(data, index)
	{
		const dateObject = new Date(data.timestamp);
		const hour_past = new Date() - dateObject;
		const hoursDifference = hour_past / (1000 * 60 * 60);
		let divmessage_body = document.createElement('div')
		let message_time = epochToLocalTimeString(parseInt(data.timestamp))
		divmessage_body.classList.add('message-body')

		divmessage_body.innerHTML = /* html */ `
				<div class="message-text-container" id="message_${data.message_id}">
					<div>
						<img class="images_chat" src=${data.avatar}>
					</div>
					<div class="d-flex flex-column w-100 message_cnt">
						<div class="d-flex flex-row name-time">
							<span class="p2_bold message_name">${data.username}</span>
							<span class="p4_regular platinum_40_color">${message_time}</span>
							<div class="message_option">
								<div class="message_dot">
									<span class="dot_option"></span>
									<span class="dot_option"></span>
									<span class="dot_option"></span>
								</div>
							</div>
						</div>
						<div class="message-block">
							<div>
								<span class="p3_regular messageblockcontent"></span>
							</div>
						</div>
						<div class="delete_message">
							<div class="delete_f ${data.message_id}" id="delete_for_me">
								<div class="msg_bin">
									<img src="/assets/images/common/Iconly/Bold/Delete.svg">
									<span>Delete for me</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				`

			let content_element = divmessage_body.querySelector(".messageblockcontent")
			let delete_msg = divmessage_body.querySelector(".delete_message");

			if (data.username == localStorage.getItem("username"))
			{
				if (hoursDifference <= 1)
				{
					let delete_f_div = document.createElement('div')
					delete_f_div.classList.add('delete_f')
					delete_f_div.classList.add(data.message_id)
					delete_f_div.innerHTML = `
								<div class="msg_bin" id="delete_for_everyone">
									<img src="/assets/images/common/Iconly/Bold/Delete.svg">
									<span>Delete for everyone</span>
								</div>`
					divmessage_body.querySelector(".delete_message").appendChild(delete_f_div)
					delete_msg.style.height = "88px"
					let delete_foreveryone = divmessage_body.querySelector("#delete_for_everyone");
					delete_foreveryone.addEventListener('click', ()=>{
						delete_le_message(divmessage_body, this.server_name, "for_everyone", data.message_id)
					})
				}

				// divmessage_body.querySelector(".images_chat").parentNode.style.display = "none"
				// divmessage_body.querySelector(".message_name").innerText = ''
			}


			content_element.innerText = data.content
			document.querySelector(".messagetext").appendChild(divmessage_body)
			let delete_forme = divmessage_body.querySelector("#delete_for_me");

			
			delete_forme.addEventListener('click', ()=>{
				delete_le_message(divmessage_body, this.server_name, "for_me", data.message_id)
			})
			
			divmessage_body.querySelector(".message_dot").addEventListener('click', ()=>{
				if (delete_msg.style.display == "none")
				delete_msg.style.display = "flex"
			else if (delete_msg.style.display == "flex")
			delete_msg.style.display = "none"
		else
		delete_msg.style.display = "flex"
	this.messagecontainer.scrollTop = this.messagecontainer.scrollHeight;
})

divmessage_body.querySelector(".message_cnt").addEventListener('mouseleave', ()=>{
	delete_msg.style.display = "none"
})
}


connectedCallback() {}

disconnectedCallback() { }

attributeChangedCallback(name, oldValue, newValue) { }
}

customElements.define("chat-body", ChatBody);


function epochToLocalTimeString(epochTime) {
	// epochTime to time zone in string
	let time = new Date(epochTime);
	return `${time.getHours()}:${time.getMinutes()}${time.getHours() >= 12 ? 'PM' : 'AM'}`
}

function delete_le_message(tag , server_name, delete_type, id)
{
	let msg_id = id

	let element_todel = tag.querySelector(`#message_${msg_id}`)
	let parent = element_todel.parentNode;
	parent.removeChild(element_todel);
	makeRequest('/api/chat/get_message_data/', 'POST', {'message_id':msg_id, 'server_name':server_name, 'delete_type':delete_type})
}