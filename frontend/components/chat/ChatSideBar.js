export default class ChatSideBar extends HTMLElement {
	constructor() {
		super();
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/chat_page.css'));
	}
	render_page(data)
		{

			let servername = location.pathname.substring(6)
			this.innerHTML = /* html */`
				${ data.map((item) => {
						let name_dot = item.name
						if (item.name.length + 3 > 18)
							name_dot = item.name.slice(0, 15) + "..."
						if (item.latest_timestamp === '')
						{
							item.latest_timestamp = ''
						}
						let selectedchat = ''

						let messagetext = document.createElement('span')
						messagetext.classList.add('p3_regular')
						messagetext.classList.add('platinum_40_color')
						messagetext.classList.add('message_text')
						let newlinebr = item.latest_message.indexOf('\n')
						if (newlinebr !== -1)
							item.latest_message = item.latest_message.substring(0, newlinebr) + '...'
						messagetext.innerText = item.latest_message
						if (servername === item.server_name)
							selectedchat="selectedchat"
						let result =  /* html */ `
						<div  class="side-message-bar ${item.visibility} ${selectedchat}" id=${item.server_name}>
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
									<span class="p2_bold">${name_dot}</span>
									<span class="p4_regular platinum_40_color time-message">${item.latest_timestamp}</span>
								</div>
								${messagetext.outerHTML}
							</div>
						</div>
						`;
						return result
					}).join("")
				}
				`;
			const clicked_block = this.querySelectorAll(".side-message-bar");
			for (let i = 0; i < clicked_block.length; i++)
			{
				let targeted = clicked_block[i];
				targeted.addEventListener('click', ()=>{
					GoTo(`/chat/${targeted.id}`)
				})
			}
			const sidesearchbar = document.querySelector(".SidebarSearch")
			sidesearchbar.addEventListener("input", (e)=>{
				let server_block = this.querySelectorAll(".side-message-bar");
				let input_value = e.target.value.toLowerCase();
				server_block.forEach((element) => {
					let found_array = data.filter(item => item.server_name.toLowerCase() === element.id.toLowerCase())
					found_array = found_array.filter(item => item.name.toLowerCase().includes(input_value))
					element.classList.toggle("hides",!found_array.length)

				});
			})

		}


	connectedCallback() {}

	disconnectedCallback() {}
	async attributeChangedCallback(name, oldValue, newValue) {

		let data = []
		makeRequest('/api/chat/get_server_data/').then((body)=>{
			
			
			if (name === 'type')
			{
				if (newValue === "Direct")
				{
					for(let i = 0; i < body.length; i++)
					{
						if (body[i].visibility === "protected")
						{
							if (body[i].latest_timestamp)
							{
								let time_now = new Date(body[i].latest_timestamp)
								body[i].latest_timestamp = `${time_now.getHours()}:${time_now.getMinutes()}${time_now.getHours() > 12 ? ' PM' : ' AM'}`
							}
							data.push(body[i])
						}
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
							if (body[i].latest_timestamp)
							{
								let time_now = new Date(body[i].latest_timestamp)
								body[i].latest_timestamp = `${time_now.getHours()}:${time_now.getMinutes()}${time_now.getHours() > 12 ? ' PM' : ' AM'}`
							}
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
