export default class ChatBody extends HTMLElement {
	constructor() {
		super();
        const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/chat_server.css'));
        this.innerHTML = /* html */`
        <div>
            <p>Chat Body</p>
            <p>Chat Body</p>
            <p>Chat Body</p>
            <p>Chat Body</p>
            <p>Chat Body</p>
            <p>Chat Body</p>
            <p>Chat Body</p>
            <p>Chat Body</p>
            <p>Chat Body</p>
        </div>`;
    }

    connectedCallback() {}

    disconnectedCallback() {
    }

    attributeChangedCallback(name, oldValue, newValue) { }

}

customElements.define("pannel-component", Pannel);
