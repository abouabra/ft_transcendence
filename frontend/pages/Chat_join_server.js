export default class Join_Server extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/chat_join_server.css'));
        const server_name = window.location.pathname.substring(18, window.location.pathname.length-1)
        console.log(server_name)
        console.log(server_name)
        console.log(server_name)
        console.log(server_name)
        console.log(server_name)
        console.log(server_name)
        console.log(server_name)
        console.log("sdf")
        console.log(server_name)
        makeRequest(`/api/chat/server_JoinedData/${server_name}/`).then(data=> {
            let name_dot = server_name
            if (name_dot.length + 3 > 15)
                name_dot = name_dot.slice(0, 12) + "..."
            this.innerHTML = /*html*/`
                <div class="join_main_container">
                    <div class="join_container">
                        <div class="join_header">
                            <span class="header_h2">Join Server</span>
                            <img src="${data.avatar}" class="join_server_img">
                            <span class="join_msg">You've been invited to join:</span>
                            <span class="header_h3">${name_dot}</span>
                            <div class="joined_data_container">
                                <div class="joined_data">
                                    <span>${data.members} Members</span>
                                </div>
                                <div class="join_passworddv">
                                    <input class="join_password" type="password" placeholder="password">
                                </div>
                                <button-component data-text="Join" class="join_button"></button-component>
                                <button-component data-type="no-bg" data-text="Back" onclick="GoTo('/chat/')"></button-component>
                            </div>
                        </div>
                    </div>
                </div>
            
            `
            let join_password = this.querySelector(".join_password")
            let joinbtn = this.querySelector(".join_button")
            
            joinbtn.addEventListener("click", () => {
                makeRequest(`/api/chat/server_JoinedData/${server_name}/`, "POST", {'server_name':server_name}).then((data0) => {
                    GoTo(`/chat/${data0.server_name}`)
                    }).catch(error => {
                        this.innerHTML = /* html */`
                            <div class="w-100 h-100 d-flex justify-content-center align-items-center flex-column">
		    	    	        <div class="d-flex justify-content-center align-items-center flex-column" style="gap: 50px">
		    	    		        <span class="header_h1">Already Joined</span>
		    	    		        <button-component   data-text="Go back to chat" onclick="GoTo('/chat/')"> </button-component>
                            </div>
                        </div>
                        `;
                    })
                })
            
        }).catch(error => {
			this.innerHTML = /* html */`
            <div class="w-100 h-100 d-flex justify-content-center align-items-center flex-column">
				<div class="d-flex justify-content-center align-items-center flex-column" style="gap: 50px">
					<span class="header_h1"> Channel does not exist </span>
					<button-component data-text="Go back to chat" onclick="GoTo('/chat/')"> </button-component>
                </div>
            </div>
			`;
		});
 
    }


    connectedCallback() {}

    disconnectedCallback() {}

    attributeChangedCallback(name, oldValue, newValue) {}

}

customElements.define("join-server", Join_Server);

