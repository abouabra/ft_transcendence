export default class Home_Slide_Show extends HTMLElement {
	constructor() {
		super();

		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink("/styles/home.css"));

		this.innerHTML = /*html*/ `
				<div class="blur platinum_40_color_border slide-show-mini-card right-card">
					<img src="/assets/images/home_page/road-fighter-card.png" alt="Pong Card" class="slide-show-mini-card-image">
				</div>


				<div class="blur platinum_40_color_border slide-show-mini-card position-relative center-card">
					<img src="/assets/images/home_page/pong-card.jpg" alt="Pong Card" class="slide-show-mini-card-image">

					<div class="slide-show-three-dots">
						<div class="slide-show-three-dots-dot"> </div>
						<div class="slide-show-three-dots-dot slide-show-three-dots-dot-active"> </div>
						<div class="slide-show-three-dots-dot"> </div>
					</div>

					<div class="d-flex flex-column justify-content-center" style="gap: 30px;">

						<div class="d-flex flex-column">
							<span class="p3_regular" >Game Name</span>
							<span class="header_h3">Road Fighter 1984</span>
						</div>
						
						<div class="d-flex flex-column" style="width: 300px;" >
							<span class="p3_regular">Game Description</span>
							<span class="p3_bold">A retro racing arcade game where players must speed down highways, dodging traffic and obstacles to reach the finish line before running out of fuel.</span>
						</div>

						<div class="d-flex" style="width: 150px;">
							<button-component data-text="Play" onclick="GoTo('/play/')"></button-component>
						</div>

					</div>
				</div>

				
				<div class="blur platinum_40_color_border slide-show-mini-card left-card ">
					<img src="/assets/images/home_page/space-invaders-card.jpg" alt="Pong Card" class="slide-show-mini-card-image">
				</div>

				
			
		`;

		
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("home-slide-show", Home_Slide_Show);
