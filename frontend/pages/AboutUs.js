import Landing_Page_Footer from "../components/landing_page/landing_page_footer.js";
import AboutUS_UserCard from "../components/about_us/AboutUS_UserCard.js";
import AboutUS_TechCard from "../components/about_us/AboutUS_TechCard.js";


export default class AboutUs_Page extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/about_us.css'));
		makeRequest("/api/auth/is_authenticated/", "GET")
		.then(response => {
			if(response.response_code == 200)
				this.render_data("Back To Home");
			else
				this.render_data("GET STARTED");
		})
		.catch(error => this.render_data("GET STARTED"));
	}

	render_data(text_if_auth)
	{
	this.innerHTML = /* html */`
	<div class="landing_page_container">
		<div class="landing_page_section">
			<div class="d-flex flex-column" style="gap:20px; width:75%">
				<h1 class="landing_page_header primary_color_color">ft_transcendence</h1>
				<span class="p1_bold">
					ft_transcendence is an innovative online multiplayer arcade platform that brings classic games like Pong 1972, Road Fighter 1984, and Space Invaders 1978 into a modern gaming experience. Our platform offers an engaging environment where players can compete, chat, and climb leaderboards while enjoying seamless gameplay powered by cutting-edge technologies like Django, Redis, Kubernetes, and WebSockets. Designed by a passionate team of three developers, ft_transcendence blends nostalgia with modern tech to create a unique gaming community.
				</span>
			</div>
			<div class="d-flex flex-column justify-content-around align-items-center" style="gap: 150px;margin: 150px 0px;">
				<div class="d-flex flex-column justify-content-around flex-wrap">
					<h1 class="landing_page_header primary_color_color">Meet the Team</h1>
					<span class="p1_bold">
						Our platform is crafted by a dedicated team of three passionate developers, each bringing unique skills and experiences to the table. We are united by our love for retro games and our mission to create a nostalgic yet modern gaming experience for players around the world.
					</span>
				</div>

				<div class="d-flex w-100 justify-content-around flex-wrap" style="gap: 150px;">

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
			<img src="/assets/images/landing_page/arrow-down.gif" alt="arrow-down" class="landing_page_arrow_down">
		</div>

		<div class="d-flex flex-column technologies_used" style="gap: 50px;">
			<h1 class="landing_page_header primary_color_color">Technologies used</h1>
			<div class="d-flex w-100 justify-content-center" >
				<div class="d-flex flex-column" style="gap: 50px;width: fit-content" >
					<div class="d-flex flex-wrap" style="gap: 50px;width: fit-content" id="technologies_used_row">
						<div class="d-flex flex-column justify-content-between" style="gap: 50px;">
							<div class="d-flex flex-column blur platinum_40_color_border technologies_used_container" style="width: fit-content;">
								<span class="header_h2">
									Web Frameworks & Languages
								</span>
			
								<div class="d-flex flex-wrap justify-content-around" style="gap: 100px;">
									<aboutus-techcard 
										data-name="Django"
										data-desciption="Backend web framework for building the API."
										data-image="/assets/images/about_us/django.png"
										>
									</aboutus-techcard>
									<aboutus-techcard 
										data-name="HTML / CSS / JS"
										data-desciption="Frontend languages for building the user interface."
										data-image="/assets/images/about_us/html_css_js.png"
										>
									</aboutus-techcard>
								</div>
							</div>
							<div class="d-flex flex-column blur platinum_40_color_border technologies_used_container" style="width: fit-content;">
								<span class="header_h2">
									Database & Caching
								</span>
			
								<div class="d-flex flex-wrap justify-content-around" style="gap: 100px;">
									<aboutus-techcard 
										data-name="PostgreSQL"
										data-desciption="Database management system for storing user, game, and authentication data."
										data-image="/assets/images/about_us/postgresql.png"
										>
									</aboutus-techcard>
									<aboutus-techcard 
										data-name="Redis"
										data-desciption="In-memory data store for caching and managing sessions."
										data-image="/assets/images/about_us/redis.png"
										>
									</aboutus-techcard>
								</div>
							</div>
							<div class="d-flex flex-column blur platinum_40_color_border technologies_used_container" style="width: fit-content;">
								<span class="header_h2">
									Containerization & Orchestration
								</span>
			
								<div class="d-flex flex-wrap justify-content-around" style="gap: 100px;">
									<aboutus-techcard 
										data-name="Docker"
										data-desciption="Containerization platform to package the services."
										data-image="/assets/images/about_us/docker.png"
										>
									</aboutus-techcard>
								</div>
							</div>
							<div class="d-flex flex-column blur platinum_40_color_border technologies_used_container" style="width: fit-content;">
								<span class="header_h2">
									Security & Secrets Management
								</span>
			
								<div class="d-flex flex-wrap justify-content-around" style="gap: 100px;">
									<aboutus-techcard 
										data-name="HashiCorp Vault"
										data-desciption="Tool for managing secrets and protecting sensitive data."
										data-image="/assets/images/about_us/hashicorp_vault.png"
										>
									</aboutus-techcard>
									<aboutus-techcard 
										data-name="ModSecurity"
										data-desciption="Web application firewall for providing additional security."
										data-image="/assets/images/about_us/modsecurity.png"
										>
									</aboutus-techcard>
								</div>
							</div>
						</div>




						<div class="d-flex flex-column blur platinum_40_color_border technologies_used_container" style="height: 1085px;">
							<span class="header_h2">
								Monitoring & Logging
							</span>

							<div class="d-flex flex-column flex-wrap justify-content-center align-items-center h-100 justify-content-between" style="gap: 150px;">
								<aboutus-techcard 
									data-name="Prometheus"
									data-desciption="Monitoring system for collecting and analyzing metrics."
									data-image="/assets/images/about_us/prometheus.png"
									>
								</aboutus-techcard>
								<aboutus-techcard 
									data-name="Grafana"
									data-desciption="Visualization tool for displaying the metrics collected by Prometheus."
									data-image="/assets/images/about_us/grafana.png"
									>
								</aboutus-techcard>
							</div>
						</div>



					</div>
					<div class="d-flex flex-column blur platinum_40_color_border technologies_used_container">
						<span class="header_h2">
							Hosting & Deployment
						</span>

						<div class="d-flex flex-wrap justify-content-around" style="gap: 150px;">
							<aboutus-techcard 
								data-name="Azure Kubernetes Service (AKS)"
								data-desciption="Managed Kubernetes service for deploying the application."
								data-image="/assets/images/about_us/aks.png"
								>
							</aboutus-techcard>
							<aboutus-techcard 
								data-name="GitHub"
								data-desciption="Version control system for managing the source code."
								data-image="/assets/images/about_us/github_big.png"
								>
							</aboutus-techcard>
							<aboutus-techcard 
								data-name="Nginx"
								data-desciption="Web server and load balancer for handling frontend requests."
								data-image="/assets/images/about_us/nginx.png"
								>
							</aboutus-techcard>
						</div>
					</div>
				</div>
			</div>
		</div>
		<landing-page-footer text_span="${text_if_auth}"></landing-page-footer>
	</div>
	`;

	const technologies_used_row = document.getElementById('technologies_used_row');
	const resizeObserver2 = new ResizeObserver(() => checkFlexWrap(technologies_used_row));
	resizeObserver2.observe(technologies_used_row);
	const arrowdown = this.querySelector(".landing_page_arrow_down")
	arrowdown.addEventListener("click",()=>{
		console.log("5daaa")
		const targetSection = document.querySelector(".technologies_used");
  		targetSection.scrollIntoView({ behavior: "smooth" });
	})
	};

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("aboutus-page", AboutUs_Page);
