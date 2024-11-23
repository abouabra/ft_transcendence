export default class HeaderAuth extends HTMLElement{
    constructor() {
        super();
        const head = document.head || document.getElementsByTagName("head")[0];
        head.appendChild(createLink('/styles/headerauth.css'));

        const text_button = this.getAttribute("text_button");
        const url_button = this.getAttribute("url_button");
        const url_close = this.getAttribute("url_close");


        this.innerHTML = /* html */`
        <div class="header"> 
            <a onclick="GoTo('${url_close}')"><div class="close-icon"></div></a>
            <button-component class="register_button" data-text=${text_button} onclick="GoTo('${url_button}')"></button-component>
        </div>
        `
    };

    
    static get observedAttributes() {
		return ['text_button', 'url_button', 'url_close'];
	}
    connectedCallback() {
    }

    disconnectedCallback() {
    }

    attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("header-auth", HeaderAuth);