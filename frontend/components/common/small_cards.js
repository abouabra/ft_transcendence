export default class Small_Cards extends HTMLElement {
	constructor() {
		super();

		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink("/styles/common.css"));
       

        let type = this.getAttribute("data-type"); // join_game, waiting_for_game,              log_out, delete_server, leave_server, delete_account
        const server_id = this.getAttribute("data-server-id");
        
        if(type == null)
            type = "logout";

        this.headers = {
            "logout":         {head: "Log Out",        action_btn: "Log out" , action_type: "logout",         id: localStorage.getItem('id')},
            "delete_server":  {head: "Delete Server",  action_btn: "Delete" ,  action_type: "delete_server",  id: server_id},
            "leave_server":   {head: "Leave Server",   action_btn: "Leave" ,   action_type: "leave_server",   id: server_id},
            "delete_account": {head: "Delete Account", action_btn: "Delete" ,  action_type: "delete_account", id: localStorage.getItem('id')},
        };

        

        this.innerHTML = /*html*/ `
            <div class="small_card">
                <div class="d-flex flex-column align-items-center" style="gap: 10px; padding: 20px 0px">
                    <span class="header_h2"> ${this.headers[type].head} </span>
                    <span class="p2_regular"> Are you sure ? </span>
                </div>

                <div class="small_card_cta">
                    <button-component data-text="Cancel" data-type="no-bg" onclick="Delete_Small_Card()"></button-component>
                    <button-component data-text="${this.headers[type].action_btn}" onclick="handle_action('${this.headers[type].action_type}', ${this.headers[type].id})" ></button-component>
                </div>
            </div>
        `;

        
	}

    

	connectedCallback() {}

	disconnectedCallback() {}

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "data-type") {
            this.innerHTML = /*html*/ `
                <div class="small_card">
                    <div class="d-flex flex-column align-items-center" style="gap: 10px; padding: 20px 0px">
                        <span class="header_h2"> ${this.headers[newValue].head} </span>
                        <span class="p2_regular"> Are you sure ? </span>
                    </div>

                    <div class="small_card_cta">
                        <button-component data-text="Cancel" data-type="no-bg" onclick="Delete_Small_Card()"></button-component>
                        <button-component data-text="${this.headers[newValue].action_btn}" onclick="handle_action('${this.headers[newValue].action_type}', ${this.headers[newValue].id})" ></button-component>
                    </div>
                </div>
            `;
        }
		
	}

	static get observedAttributes() {
		return ["data-type"];
	}
}

customElements.define("small-cards", Small_Cards);
