export default class Home_Time_Played extends HTMLElement {
	constructor() {
		super();

		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink("/styles/home.css"));

		makeRequest("/api/game/home_total_time/")
		.then((data) => {
			this.innerHTML = /*html*/ `
				<div class="d-flex flex-wrap align-items-center justify-content-center position-relative home-total-time-container">
					<img src="/assets/images/home_page/sss.gif" alt="Total Time Played" class="home-total-time-image">
					<div class="d-flex flex-column align-items-center justify-content-center">
					<span class="p2_regular">Total Hours</span>
					<span class="header_h2">${data["total_time"]}h</span>
					
					</div>
				</div>
				
			
			
			
				<div class="d-flex w-100 flex-wrap align-items-center justify-content-between" style="gap: 10px;">
					<div class="d-flex flex-column justify-content-center align-items-center" style="gap: 20px;">
						<img src="/assets/images/home_page/pong-card.jpg" alt="Pong 1972" class="home-time-played-image">
						<span class="p4_bold">${data["pong"]}h</span>
					</div>
	
					<div class="d-flex flex-column justify-content-center align-items-center" style="gap: 20px;">
						<img src="/assets/images/home_page/road-fighter-card.png" alt="Road Fighter 1984" class="home-time-played-image">
						<span class="p4_bold">${data["road_fighter"]}h</span>
					</div>
	
					<div class="d-flex flex-column justify-content-center align-items-center" style="gap: 20px;">
						<img src="/assets/images/home_page/space-invaders-card.jpg" alt="Space Invaders 1978" class="home-time-played-image">
						<span class="p4_bold">${data["space_invaders"]}h</span>
					</div>
				</div>
			`;
			
	
		});


		

	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("home-time-played", Home_Time_Played);
