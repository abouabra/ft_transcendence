export default class Privacy_Page extends HTMLElement {
	constructor() {
		super();

		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink("/styles/privacy.css"));

		this.innerHTML = /*html*/ `
		<div class="privacy_page_container blur platinum_40_color_border">
			<div class="d-flex flex-column align-items-center" style="margin-bottom: 50px">
				<span class="header_h1">Privacy Policy</span>
				<span class="p1_regular">Last Updated: October 28, 2024</span&>
			</div>

				<div class="privacy_page_section">
					<span class="header_h2"> Introduction</span>
					<span class="p2_regular"> 
						This Privacy Policy explains how we handle information when you use our
						multiplayer game platform. We collect and store specific data to provide
						you with a personalized gaming, social, and competitive experience. By using our services, you
						agree to the terms outlined in this policy.
					</span>
				</div>
		
				<div class="privacy_page_section">
					<span class="header_h2"> Information We Collect</span>
		
					<span class="header_h3"> Account Information</span> 
					<ul>
						<li class="p2_regular"> Username and password</li>
						<li class="p2_regular"> Email address (for account recovery)</li>
						<li class="p2_regular"> Profile avatar and banner</li>
						<li class="p2_regular"> Two-factor authentication status</li>
						<li class="p2_regular"> Online/offline status</li>
					</ul>
		
					<span class="header_h3"> Profile & Social Features</span> 
					<ul>
						<li class="p2_regular"> Friends list</li>
						<li class="p2_regular"> Player statistics and rankings (ELO rating)</li>
						<li class="p2_regular"> Current and peak ELO ratings</li>
						<li class="p2_regular"> Tournament participation records</li>
						<li class="p2_regular"> Leaderboard positions</li>
					</ul>
		
					<span class="header_h3"> Communication Data</span> 
					<ul>
						<li class="p2_regular"> Chat messages in servers</li>
						<li class="p2_regular"> Direct messages between players</li>
						<li class="p2_regular"> Server memberships</li>
						<li class="p2_regular"> Notification preferences and history</li>
					</ul>
		
					<span class="header_h3"> Game Statistics</span> 
					<span class="p2_regular"> We track the following game-related information:</span>
					<ul>
						<li class="p2_regular"> Total games played</li>
						<li class="p2_regular"> Games won/lost/drawn</li>
						<li class="p2_regular"> Total score</li>
						<li class="p2_regular"> Playing time</li>
						<li class="p2_regular"> Game type preferences</li>
						<li class="p2_regular"> Current and historical ELO ratings</li>
					</ul>
				</div>
		
				<div class="privacy_page_section">
					<span class="header_h2"> How We Use Your Information</span>
					<span class="p2_regular"> We use this information to:</span>
					<ul>
						<li class="p2_regular"> Manage your game account and authentication</li>
						<li class="p2_regular"> Display your profile to other players</li>
						<li class="p2_regular"> Calculate and show rankings on leaderboards</li>
						<li class="p2_regular"> Match you with appropriate opponents</li>
						<li class="p2_regular"> Enable communication with other players</li>
						<li class="p2_regular"> Track tournament progress</li>
						<li class="p2_regular"> Show your gaming history and statistics</li>
						<li class="p2_regular"> Provide the friend system functionality</li>
						<li class="p2_regular"> Send relevant notifications</li>
						<li class="p2_regular"> Maintain game integrity and fair play</li>
					</ul>
				</div>
		
				<div class="privacy_page_section">
					<span class="header_h2"> Chat & Communication Features</span>
					<span class="p2_regular"> Our platform includes chat features:</span>
					<ul>
						<li class="p2_regular"> Server chat rooms</li>
						<li class="p2_regular"> Direct messaging between players</li>
						<li class="p2_regular"> Messages are stored to maintain chat history</li>
						<li class="p2_regular"> Chat access is limited to registered users</li>
						<li class="p2_regular"> We may moderate content if necessary</li>
					</ul>
				</div>
		
				<div class="privacy_page_section">
					<span class="header_h2"> Data Display</span>
					<span class="p2_regular"> Some of your information is publicly visible to other players:</span>
					<ul>
						<li class="p2_regular"> Username and avatar</li>
						<li class="p2_regular"> Game statistics and ELO rating</li>
						<li class="p2_regular"> Tournament performance</li>
						<li class="p2_regular"> Online status</li>
						<li class="p2_regular"> Leaderboard position</li>
					</ul>
				</div>
		
				<div class="privacy_page_section">
					<span class="header_h2"> Data Security</span>
					<span class="p2_regular"> 
						We implement reasonable security measures to protect your information.
						However, no internet transmission is 100% secure.
					</span>
				</div>
		
				<div class="privacy_page_section">
					<span class="header_h2"> Data Retention</span>
					<ul>
						<li class="p2_regular"> Account data is kept while your account is active</li>
						<li class="p2_regular"> Game statistics are maintained for historical accuracy</li>
						<li class="p2_regular"> Chat logs may be retained for moderation purposes</li>
						<li class="p2_regular"> You can request account deletion at any time</li>
					</ul>
				</div>
		
				<div class="privacy_page_section">
					<span class="header_h2"> Contact</span>
					<span class="p2_regular"> 
						Questions about your privacy? Contact us at <strong>fesablanca@gmail.com</strong>
					</span>
				</div>
		
				<div class="privacy_page_section">
					<span class="header_h2"> Changes</span>
					<span class="p2_regular"> We may update this policy occasionally. Check back for changes.</span>
				</div>
			
		</div>
		<landing-page-footer></landing-page-footer>
	
		`;
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("privacy-page", Privacy_Page);
