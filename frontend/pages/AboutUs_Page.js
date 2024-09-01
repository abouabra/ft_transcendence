import Landing_Page_Footer from "../components/landing_page/landing_page_footer.js";
import AboutUS_UserCard from "../components/about_us/AboutUS_UserCard.js";

export default class AboutUs_Page extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/about_us.css'));

		// <div class="cta_buttons">
		// 	<button-component data-text='GET STARTED' > </button-component>
		// 	<button-component data-text='I ALREADY HAVE AN ACCOUNT' data-type="no-bg" > </button-component>
		// </div>	

		this.innerHTML = /* html */`
		<div class="landing_page_container">
			<div class="landing_page_section">
				<div class="d-flex flex-column cta_container">
					<h1 class="landing_page_header primary_color_color">ft_transcendence</h1>
					<span class="p1_bold">
						ft_transcendence is an innovative online multiplayer arcade platform that brings classic games like Pong 1972, Road Fighter 1984, and Space Invaders 1978 into a modern gaming experience. Our platform offers an engaging environment where players can compete, chat, and climb leaderboards while enjoying seamless gameplay powered by cutting-edge technologies like Django, Redis, Kubernetes, and WebSockets. Designed by a passionate team of three developers, ft_transcendence blends nostalgia with modern tech to create a unique gaming community.
					</span>
					

				</div>
				<img src="/assets/images/landing_page/arrow-down.gif" alt="arrow-down" class="landing_page_arrow_down">
			</div>

			<div class="d-flex flex-column h-100 justify-content-around
			 align-items-center">
				<div class="d-flex flex-column justify-content-around flex-wrap">
					<h1 class="landing_page_header primary_color_color">Meet the Team</h1>
					<span class="p1_bold">
						Our platform is crafted by a dedicated team of three passionate developers, each bringing unique skills and experiences to the table. We are united by our love for retro games and our mission to create a nostalgic yet modern gaming experience for players around the world.
					</span>
				</div>

				<div class="d-flex w-100 justify-content-around flex-wrap">
					
					<aboutus-usercard 
						data-name="AYMAN BOUABRA"
						data-expertise="Backend Developer"
						data-image="/assets/images/about_us/abouabra.png"
						data-github="https://github.com/abouabra/"
						data-linkedin="https://www.linkedin.com/in/ayman-bouabra-72629b17a/"
						>
					</aboutus-usercard>


					<aboutus-usercard 
						data-name="MOHAMED BAANNI"
						data-expertise="DevOps Engineer"
						data-image="/assets/images/about_us/mbaanni.png"
						data-github="https://github.com/mbaanni"
						data-linkedin="https://www.linkedin.com/in/mohamed-baanni-2aa4bb252/"
						>
					</aboutus-usercard>


					<aboutus-usercard 
						data-name="BADRE EL KDIOUI"
						data-expertise="Backend Developer"
						data-image="/assets/images/about_us/bel-kdio.png"
						data-github="https://github.com/belkdioui"
						data-linkedin="https://www.linkedin.com/in/badre-el-kdioui-1a88471b1/"
						>
					</aboutus-usercard>

				
				</div>
			</div>

			
			<landing-page-footer></landing-page-footer>
		</div>
		`;
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("aboutus-page", AboutUs_Page);
