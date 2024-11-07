export default class User_Bar extends HTMLElement {
	constructor() {
		super();

		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink("/styles/common.css"));


		const user_id = this.getAttribute("data-userid");
		const avatar = this.getAttribute("data-avatar");

		this.innerHTML = /*html*/ `
			<img src=${avatar} alt="user" class="user-bar-icon">

			<div class="user-bar-options">
				<span class="user-bar-option-items" onclick='handle_action("goto_profile", ${user_id})'>View my profile</span>
				<span class="user-bar-option-items" onclick='handle_action("goto_settings", ${user_id})'>Settings</span>
				<span class="user-bar-option-items" onclick='handle_action("logout", ${user_id})'>Log out</span>
			</div>
		`;

		const user_bar_icon = this.querySelector(".user-bar-icon");
		const user_bar_options = this.querySelector(".user-bar-options");

		user_bar_icon.addEventListener("click", () => {
			user_bar_options.classList.toggle("show");
			navbar_check_only_one_active("user-bar-options");
		});

		const user_bar_option_items = this.querySelectorAll(".user-bar-option-items");
		user_bar_option_items.forEach(item => {
			item.addEventListener("click", () => {
				user_bar_options.classList.remove("show");
			});
		});

		document.addEventListener('click', (event) => {
			if (!user_bar_options.contains(event.target) && !user_bar_icon.contains(event.target))
			{
				user_bar_options.classList.remove("show");
			}
		});
	}


	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("user-bar", User_Bar);
