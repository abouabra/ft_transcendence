export default class Search_Bar extends HTMLElement {
	constructor() {
		super();

		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink("/styles/common.css"));

		this.innerHTML = /*html*/ `
			<div class="d-flex justify-content-center">
				<input type="text" class="search_bar_input" placeholder="Search ...">
				<img src="/assets/images/common/Iconly/Light/Search_2.svg" alt="search" style="padding: 10px;">
			</div>
			
			<div class="search-user-bar-option">
				<div class="search-user-bar-option-items">
					<span class="p4_bold">type to search</span>
				</div>
			</div>
		`;

		const search_bar_input = this.querySelector(".search_bar_input");
		const search_user_bar_option = this.querySelector(".search-user-bar-option");

		search_bar_input.addEventListener("focus", () => {
			navbar_check_only_one_active("search-user-bar-option");
			search_user_bar_option.classList.add("show");

		});
		
		document.addEventListener('click', (event) => {
			if (!search_user_bar_option.contains(event.target) && !search_bar_input.contains(event.target))
			{
				search_user_bar_option.classList.remove("show");
			}
		});
		
		
		search_bar_input.addEventListener("input", (e) => {
			if (e.target.value == "") {
				search_user_bar_option.classList.remove("show");
				return;
			}
			console.log("Search Bar: " , e.target.value);

			makeRequest("/api/auth/search/", "POST", {"search_query": e.target.value})
			.then((data) => {

				search_user_bar_option.innerHTML = "";
				search_user_bar_option.classList.add("show");

				if (data.length == 0) {
					search_user_bar_option.innerHTML = /*html*/ `
						<div class="search-user-bar-option-items">
							<span class="p4_bold">No results found</span>
						</div>
					`;
					return;
				}

				search_user_bar_option.innerHTML = data.map((item) => {
					return /*html*/ `
						<div class="search-user-bar-option-items" data-userid=${item.id}>
							<div style="position: relative">
								<img src="${item.avatar}" class="friends_bar_item_icon"/>
								
								${item.status == "online" ?
								 	/* html */`<div class="user_search_bar_item_icon_status online_status"></div>` :
									/* html */`<div class="user_search_bar_item_icon_status offline_status"></div>`
								}
							
							</div>


							<div class="d-flex align-items-center" style="gap: 2px">
								<div class="d-flex flex-column"> 
									<span class="p4_bold">${item.username}</span>
								</div>
							</div>
						</div>
						`
					}).join("")
				const all_search_user_bar_option_items = document.querySelectorAll(".search-user-bar-option-items");
				all_search_user_bar_option_items.forEach((item) => {
					item.addEventListener("click", () => {
						search_user_bar_option.classList.remove("show");
						
						const userid= item.getAttribute("data-userid");
						GoTo(`/profile/${userid}`);
					})
				});
			}).catch(error => {
				showToast("error", error);
			});
		});
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("search-bar", Search_Bar);
