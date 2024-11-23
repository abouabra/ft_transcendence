export default class TwoFactorAuth extends HTMLElement{
    constructor(){
        super();
        const head = document.head || document.getElementsByName("head")[0];
        head.appendChild(createLink('/styles/user_management.css'));

        this.innerHTML = /* html */`
            <header-auth text_button="Login" url_button="/login/" url_close="/login/"></header-auth>
            <div class="main main_2fa">
            <form>
                <div class="title">
                    <span class="title_form header_h2 primary_color_color">Two Factor Authentication</span>
                </div>
                <div class="inputs_2fa">
                    <input type="text" class="header_h3 input_2fa" maxlength="1">
                    <input type="text" class="header_h3 input_2fa" maxlength="1">
                    <input type="text" class="header_h3 input_2fa" maxlength="1">
                    <input type="text" class="header_h3 input_2fa" maxlength="1">
                    <input type="text" class="header_h3 input_2fa" maxlength="1">
                    <input type="text" class="header_h3 input_2fa" maxlength="1">
                </div>
             
                <button-component class="login_button" data-text="Submit" id="submit"></button-component>
            </form>
        </div>
        `;

       
        
    }
    connectedCallback() {
        const butt = document.querySelector("#submit").addEventListener("click",(e) => {
            makeRequest('/api/auth/2fa/', 'GET');
        })
    };

    disconnectedCallback() {};

    attributeChangedCallback(name, oldValue, newValue) {};
}

customElements.define("two-factor-authentication", TwoFactorAuth);