import Landing_Page from "./Landing_Page.js";
import Not_Found_Page from "./Not_Found_Page.js";
import Button_Component from "../components/common/button.js";
import Features_Item from "../components/landing_page/features_item.js";
import AboutUs_Page from "./AboutUs_Page.js";
import Side_Bar from "../components/common/side_bar.js";
import Base_Page from "./Base.js";
import Friends_Servers_Bar from "../components/common/friends_servers_bar.js";
import Friends_Bar from "../components/common/friends_bar.js";
import Servers_Bar from "../components/common/servers_bar.js";

export default class Root_Page extends HTMLElement {
	constructor() {
		super();

		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/Root.css'));

		this.innerHTML = `

		`;
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("root-page", Root_Page);
