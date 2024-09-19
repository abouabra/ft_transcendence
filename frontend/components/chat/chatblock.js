export default class FriendSideMsg extends HTMLElement {
	constructor() {
		super();

		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/common.css'));
		head.appendChild(createLink('/styles/common.css'));

		const html_text = /*html*/`
		<div  class="d-flex flex-row friend-message-bar w-100 justify-content-center align-items-center">
			<div style="position: relative; margin: 0.5em 0.5em 0.5em 0.5em;">
				<div class="friends_bar_item_icon_status" style="top:auto; bottom:10px"></div>
				<img class="img-fluid rounded-circle mb-2" style="width: 48px; height: 48px;"
				alt="profile-message" src="/assets/images/avatars/default.jpg">
			</div>
			<div class="d-flex flex-column">
				<div class="d-flex flex-row justify-content-between">
					<span class="p2_bold">Name</span>
					<span class="p4_regular platinum_40_color time-message">12:42 PM</span>
				</div>
				<span class="p3_regular platinum_40_color">This is the freind message</span>
			</div>
		</div>
		`;
		for (let i = 0; i < 5; i++)
			this.innerHTML += html_text;
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {
	}
}

customElements.define("friend-side-msg", FriendSideMsg);
