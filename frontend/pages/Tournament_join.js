export default class Join_Tournament extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/tournament_join.css'));

        let queryparam = new URLSearchParams(location.search)
        const tournament_name = queryparam.get("room_name")
        this.socket = new WebSocket(`ws://127.0.0.1:8000/tournament/${tournament_name}`);

        console.log(tournament_name)

        makeRequest(`/api/tournaments/tournament_rooms/?tournament_name=${tournament_name}`).then(data=> {
            let name_dot = tournament_name
            if (name_dot.length + 3 > 15)
                name_dot = name_dot.slice(0, 12) + "..."
            this.innerHTML = /*html*/`
                <div class="join_main_container">
                    <div class="join_container">
                        <div class="join_header">
                            <span class="header_h2">Join Tournament</span>
                            <img src="${data.avatar}" class="join_server_img" alt="${name_dot}">
                            <span class="join_msg">You've been invited to join:</span>
                            <span class="header_h3">${name_dot}</span>
                            <div class="joined_data_container">
                                <div class="joined_data">
                                    <span class="p2_bold">Spots ${data.members} / ${data.room_size}</span>
                                </div>
                                <div class="join_passworddv">
                                    <input class="join_password" type="password" placeholder="password">
                                </div>
                                <button-component data-text="Join" class="join_button"></button-component>
                                <button-component data-type="no-bg" data-text="Back" onclick="GoTo('/tournament/')"></button-component>
                            </div>
                        </div>
                    </div>
                </div>
            `
            let join_password = this.querySelector(".join_password")
            let join_passdd = this.querySelector(".join_passworddv")
            let join_btn = this.querySelector(".join_button")
            if (data.visibility === "private")
                join_passdd.style.display = "block";
            join_btn.addEventListener("click", () => {
            if (!(data.visibility === "private" && join_password.value === ""))
            {
                makeRequest(`/api/tournaments/tournament_rooms/`, "POST", {'tournament_name':tournament_name, 'password':join_password.value}).then((data) => {                    
                    this.socket.send(JSON.stringify({"sender_id": localStorage.getItem("id")}))
                    GoTo(`/tournament/?tournament_name=${data.tournament_name}`)
                    }).catch(error => {
                        // fixe this  after editing makeRequest
                        console.log(error)
                        if (error == "Error: Error: user already joined the tournament")
                        {
                            this.innerHTML = /* html */`
                                <div class="w-100 h-100 d-flex justify-content-center align-items-center flex-column">
		            	            <div class="d-flex justify-content-center align-items-center flex-column" style="gap: 50px">
		            	    	        <span class="header_h1">Already Joined</span>
		            	    	        <button-component   data-text="View Tournament" onclick="GoTo('/tournament/match/?tournament_name=${tournament_name}')"> </button-component>
                                </div>
                            </div>
                            `;
                        }
                        else
                            showToast("error", error)
                    })
            }
        })
        }).catch(error => {
			this.innerHTML = /* html */`
            <div class="w-100 h-100 d-flex justify-content-center align-items-center flex-column">
				<div class="d-flex justify-content-center align-items-center flex-column" style="gap: 50px">
					<span class="header_h1"> error.error </span>
					<button-component data-text="Go back to tournament" onclick="GoTo('/tournament/')"> </button-component>
                </div>
            </div>
			`;
		});
 
    }


    connectedCallback() {}

    disconnectedCallback() {
        // this.socket.close()
    }

    attributeChangedCallback(name, oldValue, newValue) {}

}

customElements.define("join-tournament", Join_Tournament);

