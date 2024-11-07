export default class Signup2_Page extends HTMLElement{
    firstvalue;
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
                    <span class="title_form header_h2 primary_color_color">Create your profile</span>
                </div>
                <input-component type="text" placeholder="Username" name="uname"></input-component>
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
                <button-component class="login_button" data-text="Register" id="register_button"></button-component>
            </form>

            <div class="divider">
                <hr> <span class="or">OR</span> <hr>
            </div>

            <div class="sso">
                <button class="sso_buttons" onclick="GoTo('/signup/')"><img src="/assets/images/user_management/42.svg" alt="42" width="21" height="21">Intra</button>
                <button class="sso_buttons" onclick="GoTo('/signup/')"><img src="/assets/images/user_management/google.svg" alt="42" width="21" height="21">Google</button>
            </div>

            <div class="privacy_policy">
                <span>By logging in, you agree to our <a onclick="GoTo('/privacy/')">Privacy Policy</a>.</span>
            </div>
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

    handelsignup = async (event) => {
        event.preventDefault();
        const email = this.firstvalue;
        const username = this.querySelector('input[name="uname"]').value;
        const password = this.querySelector('#Password-1').value;
        const password_confirm = this.querySelector('#Password-2').value;

        if (!username || !password || !password_confirm) {
            showToast("error", "Please fill up All Fields");
            return;
        }
        else{
            const data = {
                email,
                username,
                password,
                password_confirm
    
            };
            try {
                const response1 = await makeRequest('/api/auth/signup/', 'POST', data);
                GoTo('/login/')
                showToast("success", "Account created! Ready to level up? Log in now!");
            } catch (error) {
                showToast("error", error.message);
            }
        }
    };
    connectedCallback() {
        const emailInput = document.querySelector('input[name="email"]');
        emailInput.removeAttribute('required');
        emailInput.disabled = true;
        this.querySelector('#toggle-password-1').addEventListener('click', () => this.togglePasswordVisibility('#Password-1', '#toggle-icon-1'));
        this.querySelector('#toggle-password-2').addEventListener('click', () => this.togglePasswordVisibility('#Password-2', '#toggle-icon-2'));
        this.querySelector('#register_button').addEventListener('click', (event) => this.handelsignup(event))
    }

    disconnectedCallback() {
        this.querySelector('#toggle-password-1').removeEventListener('click', () => this.togglePasswordVisibility('#Password-1', '#toggle-icon-1'));
        this.querySelector('#toggle-password-2').removeEventListener('click', () => this.togglePasswordVisibility('#Password-2', '#toggle-icon-2'));
        this.querySelector('#register_button').removeEventListener('click', this.handelsignup);
        
    }
    attributeChangedCallback(name, oldValue, newValue) {};
}

customElements.define("signup2-page", Signup2_Page);