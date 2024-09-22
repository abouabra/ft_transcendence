import Landing_Page from "./Landing.js";
import Privacy_Page from "./Privacy.js";
import Not_Found_Page from "./Not_Found.js";
import Button_Component from "../components/common/button.js";
import Features_Item from "../components/landing_page/features_item.js";
import AboutUs_Page from "./AboutUs.js";
import Side_Bar from "../components/common/side_bar.js";
import Base_Page from "./Base.js";
import Friends_Servers_Bar from "../components/common/friends_servers_bar.js";
import Friends_Bar from "../components/common/friends_bar.js";
import Servers_Bar from "../components/common/servers_bar.js";
import Nav_Header from "../components/common/nav_header.js";
import Search_Bar from "../components/common/search_bar.js";
import Notifications_Bar from "../components/common/notifications_bar.js";
import User_Bar from "../components/common/user_bar.js";
import Play_Page from "./Play.js";
import Home_Page from "./Home.js";
import Tournament_Page from "./Tournament.js";
import Chat_Page from "./Chat.js";
import Leaderboard_Page from "./Leaderboard.js";
import Shop_Page from "./Shop.js";
import Notifications_Page from "./Notifications.js";
import Profile_Page from "./Profile.js";
import Settings_Page from "./Settings.js";
import Small_Cards from "../components/common/small_cards.js";
import Create_Server_page from "./Chat_creat_server.js";
import Home_Slide_Show from "../components/home_page/home_slide_show.js";
import Home_Leaderboard from "../components/home_page/home_leaderboard.js";
import Home_Time_Played from "../components/home_page/home_time_played.js";
import Home_Active_Games from "../components/home_page/home_active_games.js";


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

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("root-page", Root_Page);
