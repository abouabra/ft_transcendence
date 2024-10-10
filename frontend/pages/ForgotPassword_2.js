export default class Forgot_Password_2 extends HTMLElement{
    constructor(){
        super();
        const head = document.head || document.getElementsByName("head")[0];
        head.appendChild(createLink('/styles/user_management.css'));

        this.innerHTML = /* html */`
            <header-auth text_button="Login" url_button="/login/" url_close="/login/"></header-auth>
            <div class="main">
            <form>
                <div class="title">
                    <span class="title_form header_h2 primary_color_color">Forgot password</span>
                </div>
                <input-component type="text" placeholder="email" name="email"></input-component>
                <div class="pass">
                    <input type="password" placeholder="Password" name="psw" id="Password-1" required>
                    <a id="toggle-password-1">
                        <img src="/assets/images/common/Iconly/Light/Show.svg" alt="eye" id="toggle-icon-1">
                    </a>
                </div>      
                <div class="pass">
                    <input type="password" placeholder="Password Confirmation" name="psw" id="Password-2" required>
                    <a id="toggle-password-2">
                        <img src="/assets/images/common/Iconly/Light/Show.svg" alt="eye" id="toggle-icon-2">
                    </a>
                </div>      
                <button-component class="login_button" data-text="Update Password" onclick="GoTo('/signup/')"></button-component>
            </form>

        </div>
        `;
    };

    togglePasswordVisibility(pass, icon) {
        const passwordInput = document.querySelector(pass);
        const toggleIcon = document.querySelector(icon);
    
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.src = '/assets/images/common/Iconly/Light/Hide.svg';
        } else {
            passwordInput.type = 'password';
            toggleIcon.src = '/assets/images/common/Iconly/Light/Show.svg';
        }
    }
    connectedCallback() {
        this.querySelector('#toggle-password-1').addEventListener('click', () => this.togglePasswordVisibility('#Password-1', '#toggle-icon-1'));
        this.querySelector('#toggle-password-2').addEventListener('click', () => this.togglePasswordVisibility('#Password-2', '#toggle-icon-2'));
        
    }

    disconnectedCallback() {
        this.querySelector('#toggle-password-1').removeEventListener('click', this.togglePasswordVisibility('#Password-1', '#toggle-icon-1'));
        this.querySelector('#toggle-password-2').removeEventListener('click', this.togglePasswordVisibility('#Password-2', '#toggle-icon-2'));
        
    }
    attributeChangedCallback(name, oldValue, newValue) {};
}

customElements.define("forgot-password-2", Forgot_Password_2);