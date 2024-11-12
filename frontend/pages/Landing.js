import Landing_Page_Footer from "../components/landing_page/landing_page_footer.js";

export default class Landing_Page extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/landing_page.css'));

		
		this.innerHTML = /*html*/`
			<div class="landing_page_container">
				<div class="landing_page_section">
					<img src="/assets/images/landing_page/landing_page_hero.png" alt="landing_page_image" class="landing_page_image">

					<div class="d-flex justify-content-center align-items-center flex-column cta_container">
						<h1 class="landing_page_header text-center">Play, Compete and Conquer!</h1>
						<span class="p1_bold text-center">
							Join the ultimate arcade experience. Battle friends, climb the
							leaderboards, and unlock achievements across classic games.
						</span>
						
						<div class="cta_buttons">
							<button-component data-text='GET STARTED' data-link="/signup/"> </button-component>
							<button-component data-text='I ALREADY HAVE AN ACCOUNT' data-type="no-bg" data-link="/login/"> </button-component>
						</div>

					</div>
					<img src="/assets/images/landing_page/arrow-down.gif" alt="arrow-down" class="landing_page_arrow_down">
				</div>

				<div class="features_section">
					<features-item
						data-header="Relive the Classic Pong 1972 Experience"
						data-subheader="Master the timeless table tennis game that started it all. Challenge your reflexes and compete against players from around the globe."
						data-image="/assets/images/landing_page/pong-video-game.gif"
						data-flip="true"
					></features-item>	




					<features-item
						data-header="Hit the Roads with Road Fighter 1984"
						data-subheader="Speed through traffic and dodge obstacles in this high-octane racing classic. Prove your skills and dominate the leaderboards."
						data-image="/assets/images/landing_page/pong-video-game-2.gif"
						data-flip="false"
					></features-item>	




					<features-item
						data-header="Defend the Galaxy in Space Invaders 1978"
						data-subheader="Take on waves of aliens in this legendary arcade shooter. Protect Earth and become the ultimate space defender."
						data-image="/assets/images/landing_page/pong-video-game-3.gif"
						data-flip="true"
					></features-item>	




					<features-item
						data-header="Compete in Exciting Tournaments"
						data-subheader="Join regular tournaments and special events to showcase your gaming prowess. Win big and earn exclusive rewards."
						data-image="/assets/images/landing_page/pong-video-game-4.png"
						data-flip="false"
					></features-item>	



					<features-item
						data-header="Connect and Compete with Friends"
						data-subheader="Chat, form teams, and challenge friends in head-to-head battles. Our platform fosters community and friendly competition."
						data-image="/assets/images/landing_page/pong-video-game-5.png"
						data-flip="true"
					></features-item>	




					<features-item
						data-header="Climb the Leaderboards"
						data-subheader="Prove your skills by rising through the ranks. Earn your place among the top players across all games."
						data-image="/assets/images/landing_page/pong-video-game-6.png"
						data-flip="false"
					></features-item>	
				</div>
				<landing-page-footer></landing-page-footer>
			</div>
		`;

		const cta_buttons = this.querySelector(".cta_buttons");
		cta_buttons.querySelectorAll("button-component").forEach((element) => {
			element.addEventListener("click", () => {
				GoTo(element.getAttribute("data-link"));
			});
		});
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("landing-page", Landing_Page);
