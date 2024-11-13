
export default class Small_Cards extends HTMLElement {
	constructor() {
		super();

		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink("/styles/common.css"));
       

        let type = this.getAttribute("data-type"); // join_game, waiting_for_accept_game,              log_out, delete_server, leave_server, delete_account
        const server_id = this.getAttribute("data-server-id");
        

        const id_who_invited_you = this.getAttribute("data-id_who_invited_you");
        const username_who_invited_you = this.getAttribute("data-username_who_invited_you");
        const avatar_who_invited_you = this.getAttribute("data-avatar_who_invited_you");

        const game_name = this.getAttribute("data-game-name");
        this.game_names_enum = {
            "Pong": "pong",
            "Space Invaders": "space_invaders",
            "Road Fighter": "road_fighter",
        };

        this.db_game_name = null;

        for (const key in this.game_names_enum) {
            if (this.game_names_enum[key] == game_name || key == game_name) {
                this.db_game_name = this.game_names_enum[key];
                break;
            }
        }
        
        this.extra_data = {
            game_name: this.db_game_name,
            opponent_id: id_who_invited_you,
        };

        const game_id = this.getAttribute("game-id");
        const id_waiting_for = this.getAttribute("data-id_waiting_for");
        const username_waiting_for = this.getAttribute("data-username_waiting_for");
        const avatar_waiting_for = this.getAttribute("data-avatar_waiting_for");

        this.extra_data["game_id"] = game_id;

        console.log("game_name: ", game_name, " game_names_enum", this.extra_data);
        console.log("extra_data: ", JSON.stringify(this.extra_data));

        if(type == null)
            type = "logout";

        this.headers = {
            "logout":         {head: "Log Out",        action_btn: "Log out" , action_type: "logout_confirmed",         id: localStorage.getItem('id')},
            "delete_server":  {head: "Delete Server",  action_btn: "Delete" ,  action_type: "delete_server",  id: server_id},
            "leave_server":   {head: "Leave Server",   action_btn: "Leave" ,   action_type: "leave_server",   id: server_id},
            "delete_account": {head: "Delete Account", action_btn: "Delete" ,  action_type: "delete_account", id: localStorage.getItem('id')},


            "join_game":      {head: "Join Game ?",      action_btn: "Join" ,    action_type: "join_game",      id: 0},
            "tournament_join_game":      {head: "Join Tournament Game ?",      action_btn: "Join" ,    action_type: "join_tournament_game",      id: 0},
            
            "waiting_for_accept_game": {head: "Waiting for", action_btn: "Cancel" , action_type: "cancel_game_invitation", id: 0},
            
        };

        console.log("type: ", type);
        console.log("username_waiting_for: ", username_waiting_for);
        console.log("avatar_waiting_for: ", avatar_waiting_for);


        let subheader_body = "";
        if (type == "waiting_for_accept_game") {
            subheader_body = /*html*/ `
                <div class="d-flex flex-column align-items-center" style="gap: 10px;">
                    <span class="p2_regular"> <span class="p2_bold primary_color_color"> ${username_waiting_for} </span> to accept invitation </span>
                    <span class="p2_regular"> to play  <span class="p2_bold primary_color_color"> ${game_name} </span> </span>
                </div>
            `;
        }
        else if (type == "join_game" || type == "tournament_join_game") {
            subheader_body = /*html*/ `
                <div class="d-flex flex-column align-items-center" style="gap: 10px;">
                    <span class="p2_regular"> <span class="p2_bold primary_color_color"> ${username_who_invited_you} </span> has just invited you </span>
                    <span class="p2_regular"> to play  <span class="p2_bold primary_color_color"> ${game_name} </span> </span>
                </div>
            `;
        }
        else {
            subheader_body = /*html*/ `
                <span class="p2_regular"> Are you sure ? </span>
            `;
        }

        let slider_body = "";
        if(type == "join_game" || type == "waiting_for_accept_game" || type == "tournament_join_game") {
            slider_body = /*html*/ `
                <div class="small_card_slider">
                    <div class="d-flex w-100 platinum_40_color_bg small_cards_large_bar">
                        <div class="d-flex w-100 primary_color_bg small_cards_small_bar"></div>    
                    </div>

                    <div class="small_cards_profile_pic_container">
                        <img src=${(type == "join_game" || type == "tournament_join_game") ? avatar_who_invited_you : avatar_waiting_for} alt="profile_pic" class="small_cards_profile_pic">
                    </div>
                </div>
            `;
        }

        this.innerHTML = /*html*/ `
            <div class="small_card">
                <div class="d-flex flex-column align-items-center" style="gap: 10px; padding: 20px 0px">
                    <span class="header_h2"> ${this.headers[type].head} </span>
                    
                    ${subheader_body}
                </div>


                ${slider_body}

                <div class="small_card_cta">
                    ${type == "waiting_for_accept_game" ? "" : /*html*/ `
                        <button-component data-text="Cancel" data-type="no-bg" onclick="Delete_Small_Card()"></button-component>
                    `}
                    <button-component data-text="${this.headers[type].action_btn}" onclick="handle_action('${this.headers[type].action_type}', ${this.headers[type].id}, '${JSON.stringify(this.extra_data).replace(/'/g, "\\'").replace(/"/g, '&quot;')}')">
                </div>
            </div>
        `;

        const small_card_slider = this.querySelector(".small_card_slider");
        if(small_card_slider != null) {
            const small_cards_small_bar = small_card_slider.querySelector(".small_cards_small_bar");
            small_cards_small_bar.addEventListener("animationend", () => {
                Delete_Small_Card();
            });
        }

        const cancel_btn = this.querySelector("button-component[data-text='Cancel']");
        if(cancel_btn != null) {
            cancel_btn.addEventListener("click", () => {
                // sendNotification("cancel_game_invitation", this.headers[type].id);
                const logged_in_user_id = localStorage.getItem("id");
                console.log("logged_in_user_id: ", logged_in_user_id);
                console.log("id_who_invited_you: ", id_who_invited_you);
                console.log("id_waiting_for: ", id_waiting_for);
                // const type = id_who_invited_you == logged_in_user_id ? "join_game" : "waiting_for_accept_game";
                console.log("type: ", type);

                if (type == "join_game")
                    sendNotification("cancel_game_invitation", id_who_invited_you, {game_id: this.headers[type].id});
                else if (type == "waiting_for_accept_game")
                    sendNotification("cancel_game_invitation", id_waiting_for, {game_id: this.headers[type].id});
                // else if (type == "tournament_join_game")
                //     sendNotification("cancel_tournament_game_invitation", id_who_invited_you, {game_id: this.headers[type].id});
                
                Delete_Small_Card();
            });
        }
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

	// static get observedAttributes() {
	// 	return ["data-type"];
	// }
}

customElements.define("small-cards", Small_Cards);
