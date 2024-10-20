
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
                user_data += /* html*/`
                <div class="server_content">
                    <div class="infoblock">
                        <img class="serverimage" src="${element.avatar}">
                        <div class="d-flex flex-column block1">
                            <span class="p1_bold">Name</span>
                            <span class="header_h3">${element.server_name}</span>
                        </div>
                        <div class="d-flex flex-column align-items-center block2">
                            <span class="p1_bold">member</span>
                            <span class="header_h3">${element.member.length}</span>
                        </div>
                        <div class="d-flex flex-column block3">
                            <span class="p1_bold">visibility</span>
                            <span class="header_h3">${element.visibility}</span>
                        </div>
                        <div>
                            <button-component class="join_server" data-text="join" id="${element.server_name}"></button-component>
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
            ${user_data}
            
            </div>
            </section>
            
            `
            let joinbtn = this.querySelectorAll(".join_server")
            joinbtn.addEventListener('click', ()=>{
                let body = {
                    "server_name":joinbtn.id,
                }
                if (data[i].visibility === "private")
                {
                    makeRequest('/api/chat/joined_servers/', 'POST', body)
                }
                else
                {
                    GoTo(`/chat/${data[i].server_name}`)
                }
            })
     })
	}
	connectedCallback() {
	}

	disconnectedCallback() {
	}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("chat-browse", Chat_Browse);

