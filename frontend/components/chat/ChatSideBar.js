export default class ChatSideBar extends HTMLElement {
	constructor() {
		super();

		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/chat_page.css'));
		
		this.data = [
			{type: "", server_name: "1_11", user_id: 1, username: "baanni", avatar: "/assets/images/avatars/default.jpg", status: "online", latest_message: "wa fin a sa7bi", latest_timestamp: "12:06 PM" },
			{type: "", server_name: "2_11", user_id: 2, username: "simo", avatar: "/assets/images/avatars/default.jpg", status: "offline", latest_message: "wa ssss a sa7bi", latest_timestamp: "12:06 PM" },
			{type: "", server_name: "3_11", user_id: 3, username: "lferda", avatar: "/assets/images/avatars/default.jpg", status: "offline", latest_message: "aaaaaa", latest_timestamp: "1:06 PM" },
			{type: "", server_name: "4_11", user_id: 4, username: "s7aybi", avatar: "/assets/images/avatars/default.jpg", status: "offline", latest_message: "wa jawb", latest_timestamp: "12:06 PM" },
			{type: "", server_name: "5_11", user_id: 5, username: "abu bakr", avatar: "/assets/images/avatars/default.jpg", status: "offline", latest_message: "ggggg", latest_timestamp: "2:06 AM" },
			{type: "", server_name: "6_11", user_id: 6, username: "omar", avatar: "/assets/images/avatars/default.jpg", status: "online", latest_message: "ccccc", latest_timestamp: "12:06 PM" },
			{type: "", server_name: "7_11", user_id: 7, username: "othman", avatar: "/assets/images/avatars/default.jpg", status: "online", latest_message: "cxcxcxcxcxcxcxcxcxlslslslssllsmkkv kv djv djv djv djv jdv jdv djv djv jdv djv jd vdjv jdv jd jvd jvd jv djvd jv djv j", latest_timestamp: "12:06 PM" },
			{type: "", server_name: "8_11", user_id: 8, username: "ali", avatar: "/assets/images/avatars/default.jpg", status: "online", latest_message: "q", latest_timestamp: "1:47 AM" },
			{type: "", server_name: "8_11", user_id: 8, username: "ali", avatar: "/assets/images/avatars/default.jpg", status: "online", latest_message: "q", latest_timestamp: "1:47 AM" },
			{type: "", server_name: "8_11", user_id: 8, username: "ali", avatar: "/assets/images/avatars/default.jpg", status: "online", latest_message: "q", latest_timestamp: "1:47 AM" },
			{type: "", server_name: "8_11", user_id: 8, username: "ali", avatar: "/assets/images/avatars/default.jpg", status: "online", latest_message: "q", latest_timestamp: "1:47 AM" },
			{type: "", server_name: "8_11", user_id: 8, username: "ali", avatar: "/assets/images/avatars/default.jpg", status: "online", latest_message: "q", latest_timestamp: "1:47 AM" },
			{type: "", server_name: "8_11", user_id: 8, username: "ali", avatar: "/assets/images/avatars/default.jpg", status: "online", latest_message: "q", latest_timestamp: "1:47 AM" },
			{type: "", server_name: "8_11", user_id: 8, username: "ali", avatar: "/assets/images/avatars/default.jpg", status: "online", latest_message: "q", latest_timestamp: "1:47 AM" },
		];
			
		this.render_page();
	}

	render_page()
		{
			this.innerHTML = /* html */`
				${ this.data.map((item) => {
						return /* html */ `
						<div  class="d-flex flex-row side-message-bar align-items-center">
							<div class="position-relative">
								${
									item.status === "online" ? /* html */`
										<div class="user_search_bar_item_icon_status online_status" style="top:unset; bottom:0"></div>
										` : /* html */`
										<div class="user_search_bar_item_icon_status offline_status" style="top:unset; bottom:0"></div>
									`
								}
								<img class="rounded-circle" style="width: 48px; height: 48px;"
								alt="${item.username}" src="${item.avatar}">
							</div>
							<div class="d-flex flex-column">
								<div class="d-flex flex-row justify-content-between">
									<span class="p2_bold">${item.username}</span>
									<span class="p4_regular platinum_40_color time-message">${item.latest_timestamp}</span>
								</div>
								<span class="p3_regular platinum_40_color message_text">${item.latest_message}</span>
							</div>
						</div>
						`;
					}).join("")
				}
				`;
		}


	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {
	}
}

customElements.define("chat-side-bar", ChatSideBar);
