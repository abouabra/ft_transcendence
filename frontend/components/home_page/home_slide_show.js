export default class Home_Slide_Show extends HTMLElement {
	constructor() {
		super();

		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink("/styles/home.css"));

		this.index = 0;

		this.data = [
			{ picture: "/assets/images/home_page/road-fighter-card.png", name: "Road Fighter 1984", description: "A retro racing arcade game where players must speed down highways, dodging traffic and obstacles to reach the finish line before running out of fuel." },
			{ picture: "/assets/images/home_page/pong-card.jpg", name: "Pong 1972", description: "A table tennis sports game featuring simple two-dimensional graphics, manufactured by Atari and released in 1972." },
			{ picture: "/assets/images/home_page/space-invaders-card.jpg", name: "Space Invaders 1978", description: "A fixed shooter in which the player controls a laser cannon by moving it horizontally across the bottom of the screen and firing at descending aliens." },
		];
		

		this.innerHTML = /*html*/ `
				<div class="blur platinum_40_color_border slide-show-mini-card right-card card-animation">
					<img src="${this.data[this.index % 3].picture}" alt="${this.data[this.index % 3].name}" class="slide-show-mini-card-image">
				</div>


				<div class="blur platinum_40_color_border slide-show-mini-card center-card">
					<img src="${this.data[(this.index + 1 ) % 3].picture}" alt="${this.data[(this.index + 1 ) % 3].name}" class="slide-show-mini-card-image">

					<div class="slide-show-three-dots">
						${[0, 1, 2].map((i) => `<div class="slide-show-three-dots-dot ${i === (this.index % 3) ? "slide-show-three-dots-dot-active" : ""}"> </div>`).join("")}
					</div>

					<div class="center-card-body">

						<div class="d-flex flex-column">
							<span class="p3_regular" >Game Name</span>
							<span class="header_h3">${this.data[(this.index + 1 ) % 3].name}</span>
						</div>
						
						<div class="d-flex flex-column" style="width: 300px;" >
							<span class="p3_regular">Game Description</span>
							<span class="p3_bold">${this.data[(this.index + 1 ) % 3].description}</span>
						</div>

						<div class="d-flex" style="width: 150px;">
							<button-component data-text="Play" onclick="GoTo('/play/')"></button-component>
						</div>

					</div>
				</div>

				<div class="blur platinum_40_color_border slide-show-mini-card left-card card-animation">
					<img src="${this.data[(this.index + 2 ) % 3].picture}" alt="${this.data[(this.index + 2 ) % 3].name}" class="slide-show-mini-card-image">
				</div>
		`;

		
		const home_slide_show = document.querySelector("home-slide-show");
		const home_slide_show_parent = home_slide_show.parentElement;

		window.addEventListener("resize", () => {
			const home_page = document.querySelector("home-page");

			if(home_page.clientWidth < 843) {
				const scale_ratio = home_page.clientWidth / 843;
				home_slide_show.style.scale = scale_ratio;
				home_slide_show_parent.style.height = `${home_slide_show.clientHeight * scale_ratio}px`;

			}
		});

		
		



		setInterval(() => {
			const first_div = this.querySelector(".left-card");
			const second_div = this.querySelector(".center-card");
			const third_div = this.querySelector(".right-card");

			let elem_swith = false;
			if (first_div.style.animationName === "left-card-animation")
			{
				first_div.style.animationName = "right-card-animation";
				elem_swith = true;
			}
			else
			{
				first_div.style.animationName = "left-card-animation";
			}



			if (third_div.style.animationName === "right-card-animation")
			{
				// elem_swith = true;

				third_div.style.animationName = "left-card-animation";
			}
			else
			{

				third_div.style.animationName = "right-card-animation";
			}

			



			setTimeout(() => {

				if(elem_swith)
				{
					let tmp = this.data[this.index % 3];
					this.data[this.index % 3] = this.data[(this.index + 2) % 3];
					this.data[(this.index + 2) % 3] = tmp
				}
				else
				{
					let tmp = this.data[this.index % 3];
					this.data[this.index % 3] = this.data[(this.index + 1) % 3];
					this.data[(this.index + 1) % 3] = tmp
				}
				this.index = (this.index + 1) % 3;


				
				this.update_data();
			}, 250);


			// second_div.classList.add("center-card-animation");
			second_div.querySelector("img").classList.add("center-card-animation");
			second_div.querySelector(".center-card-body").classList.add("center-card-animation");
			
			setTimeout(() => {
				// second_div.classList.remove("center-card-animation");
				second_div.querySelector("img").classList.remove("center-card-animation");
				second_div.querySelector(".center-card-body").classList.remove("center-card-animation");
			}, 400);
			

		}, 2000);
	}

	update_data()
	{
		const right_card = this.querySelector(".right-card");
		const center_card = this.querySelector(".center-card");
		const slide_show_three_dots = this.querySelector(".slide-show-three-dots");
		const left_card = this.querySelector(".left-card");

		right_card.querySelector("img").src = this.data[this.index].picture;
		right_card.querySelector("img").alt = this.data[this.index].name;

		center_card.querySelector("img").src = this.data[(this.index + 1) % 3].picture;
		center_card.querySelector("img").alt = this.data[(this.index + 1) % 3].name;

		slide_show_three_dots.innerHTML = [0, 1, 2].map((i) => `<div class="slide-show-three-dots-dot ${i === (this.index % 3) ? "slide-show-three-dots-dot-active" : ""}"> </div>`).join("");

		center_card.querySelector(".header_h3").innerText = this.data[(this.index + 1) % 3].name;
		center_card.querySelector(".p3_bold").innerText = this.data[(this.index + 1) % 3].description;

		left_card.querySelector("img").src = this.data[(this.index + 2) % 3].picture;
		left_card.querySelector("img").alt = this.data[(this.index + 2) % 3].name;

		console.log("index", this.index);
		

		
	}

	connectedCallback() {
		

	}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("home-slide-show", Home_Slide_Show);
