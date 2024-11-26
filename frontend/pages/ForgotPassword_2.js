export default class Forgot_Password_2 extends HTMLElement{
    constructor(){
        super();
        const head = document.head || document.getElementsByName("head")[0];
        head.appendChild(createLink('/styles/user_management.css'));
        let queryParams = new URLSearchParams(window.location.search);
        this.firstvalue = queryParams.values().next().value;

        this.innerHTML = /* html */`
            <header-auth text_button="Login" url_button="/login/" url_close="/login/"></header-auth>
            <div class="main">
            <form>
                <div class="title">
                    <span class="title_form header_h2 primary_color_color">Forgot password</span>
                </div>
                <input-component type="text" placeholder="${this.firstvalue}" name="email"></input-component>
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
                <button-component class="login_button" data-text="Update Password" id="forgot_button"></button-component>
            </form>

        </div>
        `;
    };


    handelforgot = async (event) => {
        event.preventDefault();
        const email = this.firstvalue;
        const password = this.querySelector('#Password-1').value;
        const password_confirm = this.querySelector('#Password-2').value;
        const data = {
            email,
            password,
            password_confirm

        };
        try {
            const response1 = await makeRequest('/api/auth/forgot_password/', 'POST', data);
            GoTo('/login/')
            showToast("success", "Password changed! Your password has been changed successfully!");
        } catch (error) {
            showToast("error", error.message);
        }
    };

    connectedCallback() {
        const emailInput = document.querySelector('input[name="email"]');
        emailInput.removeAttribute('required');
        emailInput.disabled = true;
        this.querySelector('#toggle-password-1').addEventListener('click', () => togglePasswordVisibility('#Password-1', '#toggle-icon-1'));
        this.querySelector('#toggle-password-2').addEventListener('click', () => togglePasswordVisibility('#Password-2', '#toggle-icon-2'));
        this.querySelector('#forgot_button').addEventListener('click',(event) => this.handelforgot(event))
    }

    disconnectedCallback() {
        this.querySelector('#toggle-password-1').removeEventListener('click', () => togglePasswordVisibility('#Password-1', '#toggle-icon-1'));
        this.querySelector('#toggle-password-2').removeEventListener('click', () => togglePasswordVisibility('#Password-2', '#toggle-icon-2'));
        this.querySelector('#forgot_button').removeEventListener('click',(event) => this.handelforgot(event))
        
    }
    attributeChangedCallback(name, oldValue, newValue) {};
}

customElements.define("forgot-password-2", Forgot_Password_2);