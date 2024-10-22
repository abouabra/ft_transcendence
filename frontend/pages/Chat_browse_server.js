
export default class Chat_Browse extends HTMLElement {
	constructor() {
		super();
        const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/chat_browse.css'));



        let user_data = ''
        makeRequest(`/api/chat/get_serverlist/`, 'GET')
        .then(data =>{
            data.forEach(element =>
            {
                if (element.server_name.length > 15)
                    element.server_name = element.server_name.slice(0, 15) + "..."
                user_data += /* html*/`
                <div class="server_content">
                    <div class="infoblock">
                        <div class="serverimage">
                            <img src="${element.avatar}">
                        </div>
                        <div class="specific_info">
                            <div class="d-flex flex-column block1">
                                <span class="p1_bold platinum_40_color">Name</span>
                                <span class="header_h3">${element.server_name}</span>
                            </div>
                            <div class="d-flex flex-column align-items-center">
                                <span class="p1_bold platinum_40_color">member</span>
                                <span class="header_h3">${element.member.length}</span>
                            </div>
                            <div class="d-flex flex-column">
                                <span class="p1_bold platinum_40_color">visibility</span>
                                <span class="header_h3">${element.visibility}</span>
                            </div>
                        </div>
                        <div class="join_server">
                            <button-component data-text="join" data-id="${element.visibility} ${element.server_name}" id="${element.server_name}" onclick="GoTo('/chat/join_server/${element.server_name}/')"></button-component>
                        </div>
                    </div>
                </div>
                `
            })


            this.innerHTML = /* html */`
            
            <section class="browse-container">
                <div class="server_description">
                    <div class="d-flex flex-row justify-content-between">
                        <div class="searchserver">
                            <input type="text" placeholder="Search for Server" class="searchinput">
                            <img  class="search_logo" src="/assets/images/common/Iconly/Light/Search.svg">
                        </div>
                        <button-component data-text="Create" onclick="GoTo('/chat/create_server/')"></button-component>
                    </div>
                    <div class="join_lists">
                        ${user_data}
                    </div>
                </div>
            </section>
            
            `
            let joinbtn = this.querySelectorAll(".join_server")
            joinbtn.forEach((joinbtn, i) => {
                joinbtn.addEventListener('click', ()=>{
                if (data[i].visibility === "private")
                    {
                        makeRequest('/api/chat/joined_servers/', 'POST', {"server_name":joinbtn.id})
                    }
                    else
                    {
                        GoTo(`/chat/${data[i].server_name}`)
                    }
                })
            }
     })
	}
	connectedCallback() {
	}

	disconnectedCallback() {
	}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("chat-browse", Chat_Browse);

