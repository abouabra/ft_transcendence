import Side_Bar_Item from "./side_bar_item.js";

export default class Side_Bar extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/common.css'));


		this.innerHTML = /*html*/`
				<side-bar-item
					class="active_side_bar_item"
					data-icon="Light/Home.svg"
					data-text="Home"
					data-link="/home/" >
				</side-bar-item>
				<side-bar-item
					data-icon="Light/Game.svg"
					data-text="Play a Game"
					data-link="/play/" >
				</side-bar-item>
				<side-bar-item
					data-icon="Light/3 User.svg"
					data-text="Enroll in Tournament"
					data-link="/tournament/" >
				</side-bar-item>
				<side-bar-item
					data-icon="Light/Message.svg"
					data-text="Chat with friends"
					data-link="/chat/" >
				</side-bar-item>
				<side-bar-item
					data-icon="Light/Chart.svg"
					data-text="Leaderboard"
					data-link="/leaderboard/" >
				</side-bar-item>
				<side-bar-item
					data-icon="Light/Bag 3.svg"
					data-text="Shop"
					data-link="/shop/" >
				</side-bar-item>
		`;

		const elements = this.querySelectorAll("side-bar-item");
		const current_path = window.location.pathname;

		elements.forEach((element) => {
			if (current_path.includes(element.getAttribute("data-link")))
			{
				elements.forEach((element) => {
					element.classList.remove("active_side_bar_item");
				});
				element.classList.add("active_side_bar_item");
			}


			element.addEventListener("click", () => {
				elements.forEach((element) => {
					element.classList.remove("active_side_bar_item");
				});
				element.classList.add("active_side_bar_item");
				GoTo(element.getAttribute("data-link"));
			});

			// fix hover wont change if active
			element.addEventListener("mouseover", () => {
				if (!element.classList.contains("active_side_bar_item")) {
					element.classList.add("hover_side_bar_item");
				}
			});

			element.addEventListener("mouseout", () => {
				element.classList.remove("hover_side_bar_item");
			});
		});
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {
	}

	static get observedAttributes() {
		return [""];
	}
}

customElements.define("side-bar", Side_Bar);
