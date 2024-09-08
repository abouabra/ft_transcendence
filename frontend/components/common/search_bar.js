export default class Search_Bar extends HTMLElement {
	constructor() {
		super();

		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink("/styles/common.css"));

		const data = [
			{"user_id": 1, "user_name": "user 1", "user_status": "online", "user_avatar":  "/assets/images/about_us/abouabra.png"},
			{"user_id": 2, "user_name": "user 2", "user_status": "offline", "user_avatar":  "/assets/images/about_us/abouabra.png"},
			{"user_id": 3, "user_name": "user 3", "user_status": "online", "user_avatar":  "/assets/images/about_us/abouabra.png"},
			{"user_id": 4, "user_name": "user 4", "user_status": "offline", "user_avatar":  "/assets/images/about_us/abouabra.png"},
			{"user_id": 5, "user_name": "user 5", "user_status": "offline", "user_avatar":  "/assets/images/about_us/abouabra.png"},
		]

		this.innerHTML = /*html*/ `
			
			<div class="d-flex justify-content-center">
				<input type="text" class="search_bar_input" placeholder="Search ...">
				<img src="/assets/images/common/Iconly/Light/Search_2.svg" alt="search" style="padding: 10px;">
			</div>
			
			<div class="search-user-bar-option">
				${data.map((item) => {
					return /*html*/ `
						<div class="search-user-bar-option-items">
							<div style="position: relative">
								<img src="${item.user_avatar}" class="friends_bar_item_icon"/>
								

								${item.user_status == "online" ?
								 	/* html */`<div class="user_search_bar_item_icon_status online_status"></div>` :
									/* html */`<div class="user_search_bar_item_icon_status offline_status"></div>`
								}
							
							</div>


							<div class="d-flex align-items-center" style="gap: 2px">
								<div class="d-flex flex-column"> 
									<span class="p4_bold">${item.user_name}</span>
								</div>
							</div>
						</div>
						`
					}).join("")
				}
			</div>

		`;

		const search_bar_input = this.querySelector(".search_bar_input");
		const search_user_bar_option = this.querySelector(".search-user-bar-option");

		// call this function when the user types in the search bar
		search_bar_input.addEventListener("input", (e) => {
			if (e.target.value == "") {
				search_user_bar_option.classList.remove("show");
				return;
			}
			search_user_bar_option.classList.add("show");
			console.log("Search Bar: " , e.target.value);
		});
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("search-bar", Search_Bar);
