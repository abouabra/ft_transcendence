export default class ChatSideBar extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/chat_page.css'));
		
	}
	render_page(data)
		{
			this.innerHTML = /* html */`
				${ data.map((item) => {
						return /* html */ `
						<div  class="d-flex flex-row side-message-bar align-items-center ${item.visibility}" id=${item.server_name}>
							<div class="position-relative">
								${
									item.status === "online" ? /* html */`
										<div class="user_search_bar_item_icon_status online_status" style="top:unset; bottom:0"></div>
										` :``
								}
								${
									item.status === "offline" ? /* html */`
										<div class="user_search_bar_item_icon_status offline_status" style="top:unset; bottom:0"></div>
									`:
									``
								}
								<img class="rounded-circle" style="width: 48px; height: 48px;"
								alt="${item.name}" src="${item.avatar}">
							</div>
							<div class="d-flex flex-column">
								<div class="d-flex flex-row justify-content-between">
									<span class="p2_bold">${item.name}</span>
									<span class="p4_regular platinum_40_color time-message">${item.latest_timestamp}</span>
								</div>
								<span class="p3_regular platinum_40_color message_text">${item.latest_message}</span>
							</div>
						</div>
						`;
					}).join("")
				}
				`;
			const clicked_block = this.getElementsByClassName("side-message-bar");
			for (let i = 0; i < clicked_block.length; i++)
			{
				let targeted = clicked_block[i];
				console.log(`target = ${targeted}`)
				targeted.addEventListener('click', ()=>{
					if(targeted.className.includes('protected'))
						GoTo(`/chat/direct/${targeted.id}`)
					else
						GoTo(`/chat/server/${targeted.id}`)
				})
			}

		}


	connectedCallback() {}

	disconnectedCallback() {}
	attributeChangedCallback(name, oldValue, newValue) {
		console.log(`name: ${name}\nold: ${oldValue}\n new: ${newValue}`)

		makeRequest('/api/chat/get_server_data/').then((body)=>{
			let data = []
			if (name === 'type')
			{
				if (newValue === "Direct")
				{
					for(let i = 0; i < body.length; i++)
					{
						if (body[i].visibility === "protected")
							data.push(body[i])
					}
					this.render_page(data);
				}
				else if (newValue === "Server")
				{
					for(let i = 0; i < body.length; i++)
					{
						if (body[i].visibility !== "protected")
						{
							body[i].status = "none"
							data.push(body[i])
						}
					}
					this.render_page(data);
				}
			}
		})
	}
	static get observedAttributes() {
		return ["type"];
	}
}

customElements.define("chat-side-bar", ChatSideBar);
