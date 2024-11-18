import AboutUs_Page from "./AboutUs.js";
import Base_Page from "./Base.js";
import Button_Component from "../components/common/button.js";
import Chat_Browse from "./Chat_browse_server.js";
import Chat_join_server from "./Chat_join_server.js";
import Chat_Page from "./Chat.js";
import Create_Server_page from "./Chat_creat_server.js";
import Edit_Server_page from "./Chat_edit_server.js";
import Expanded_Home_Active_Games from "../components/home_page/expanded_home_active_games.js";
import Expanded_Home_Active_Tournaments from "../components/home_page/expanded_home_active_tournaments.js";
import Features_Item from "../components/landing_page/features_item.js";
import Forgot_Routes from "../utils/Forgot_routes.js";
import Friends_Bar from "../components/common/friends_bar.js";
import Friends_Servers_Bar from "../components/common/friends_servers_bar.js";
import Game_Page from "./Game.js";
import HeaderAuth from "../components/auth/HeaderAuth.js";
import Home_Active_Games from "../components/home_page/home_active_games.js";
import Home_Active_Tournaments from "../components/home_page/home_active_tournaments.js";
import Home_Leaderboard from "../components/home_page/home_leaderboard.js";
import Home_Page from "./Home.js";
import Home_Slide_Show from "../components/home_page/home_slide_show.js";
import Home_Time_Played from "../components/home_page/home_time_played.js";
import Input_Component from "../components/common/input.js";
import Landing_Page from "./Landing.js";
import Leaderboard_Page from "./Leaderboard.js";
import Login_Page from "./Login.js";
import Nav_Header from "../components/common/nav_header.js";
import Notifications_Bar from "../components/common/notifications_bar.js";
import Notifications_Page from "./Notifications.js";
import Not_Found_Page from "./Not_Found.js";
import Play_Page from "./Play.js";
import Privacy_Page from "./Privacy.js";
import Profile_Page from "./Profile.js";
import Search_Bar from "../components/common/search_bar.js";
import Servers_Bar from "../components/common/servers_bar.js";
import Settings_Page from "./Settings.js";
import Side_Bar from "../components/common/side_bar.js";
import Signup_Routes from "../utils/signup_routes.js";
import Small_Cards from "../components/common/small_cards.js";
import Tournament_Page from "./Tournament.js";
import Tournament_Create from "./Tournament_create.js";
import Join_Tournament from "./Tournament_join.js";
import Tournament_Match from "./Tournament_match.js";
import TwoFactorAuth from "./TwoFactorAuth.js"
import User_Bar from "../components/common/user_bar.js";

export default class Root_Page extends HTMLElement {
	constructor() {
		super();

		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/root.css'));

		this.innerHTML = /*html*/`
			<!-- <base-page></base-page> -->
		`;
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {
		
	}
}

customElements.define("root-page", Root_Page);
