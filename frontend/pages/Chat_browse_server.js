
export default class Chat_Browse extends HTMLElement {
	constructor() {
		super();
        const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/chat_browse.css'));
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
                <div class="server_content">
                    <div class="infoblock">
                        <img src="/assets/images/server_avatars/f1.jpeg">
                        <div class="d-flex flex-column block1">
                            <span class="p1_bold">Name</span>
                            <span class="header_h3">server Maghribi</span>
                        </div>
                        <div class="d-flex flex-column align-items-center block2">
                            <span class="p1_bold">member</span>
                            <span class="header_h3">32</span>
                        </div>
                        <div class="d-flex flex-column block3">
                            <span class="p1_bold">visibility</span>
                            <span class="header_h3">Public</span>
                        </div>
                        <div>
                            <button-component data-text="join" onclick="GoTo('/chat/f1/')"></button-component>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        `
	}

	connectedCallback() {
	}

	disconnectedCallback() {
	}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("chat-browse", Chat_Browse);

