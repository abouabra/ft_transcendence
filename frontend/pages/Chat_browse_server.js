
export default class Chat_Browse extends HTMLElement {
	constructor() {
		super();
        const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/chat_browse.css'));



        let user_data = ''
        makeRequest(`/api/chat/get_serverlist/`, 'GET')
        .then(data =>{
            for(let i =0; i < data.length;i++)
            {
                user_data += /* html*/`
                <div class="server_content">
                <div class="infoblock">
                    <img src="/assets/images/server_avatars/f1.jpeg">
                    <div class="d-flex flex-column block1">
                        <span class="p1_bold">Name</span>
                        <span class="header_h3">${data[i].server_name}</span>
                    </div>
                    <div class="d-flex flex-column align-items-center block2">
                        <span class="p1_bold">member</span>
                        <span class="header_h3">${data[i].member.length}</span>
                    </div>
                    <div class="d-flex flex-column block3">
                        <span class="p1_bold">visibility</span>
                        <span class="header_h3">${data[i].visibility}</span>
                    </div>
                    <div>
                        <button-component data-text="join" onclick="GoTo('/chat/${data[i].server_name}')"></button-component>
                    </div>
                </div>
            </div>
                `
            }


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
     })
	}
	connectedCallback() {
	}

	disconnectedCallback() {
	}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("chat-browse", Chat_Browse);

