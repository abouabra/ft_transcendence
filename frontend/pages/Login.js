export default class Login_Page extends HTMLElement {
    constructor() {
        super();
        const head = document.head || document.getElementsByTagName("head")[0];
        head.appendChild(createLink('/styles/user_management.css'));

        this.innerHTML = /* html */ `
        <header-auth text_button="Register" url_button="/signup/" url_close="/"></header-auth>
        <div class="main">
            <form id="login-form">
                <div class="title">
                    <span class="title_form header_h2 primary_color_color">Welcome</span>
                </div>
                <input-component type="text" placeholder="Username" name="username" required></input-component>
                <div class="pass">
                    <input type="password" placeholder="Password" name="password" id="Password" required>
                    <a id="toggle-password">
                        <img src="/assets/images/common/Iconly/Light/Show.svg" alt="eye" id="toggle-icon">
                    </a>
                </div>      
                <button-component class="login_button" data-text="Login"></button-component>
                <span class="psw p3_regular"><a onclick="GoTo('/forgot_password/')"> Forgot password?</a></span>
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
    }

    togglePasswordVisibility() {
        const passwordInput = this.querySelector('#Password');
        const toggleIcon = this.querySelector('#toggle-icon');
    
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.src = '/assets/images/common/Iconly/Light/Hide.svg';
        } else {
            passwordInput.type = 'password';
            toggleIcon.src = '/assets/images/common/Iconly/Light/Show.svg';
        }
    }

    handleLogin = async (event) => {
        event.preventDefault();

        const username = this.querySelector('input[name="username"]').value;
        const password = this.querySelector('input[name="password"]').value;

        if (!username) {
            console.log("Username is required");
            showToast("error", "Username is required");
            return;
        }
    
        if (!password) {
            console.log("Password is required");
            showToast("error", "Password is required");
            return;
        }

        const data = {
            username,
            password
        };

        try {
            const response = await makeRequest('/api/auth/login/', 'POST', data);
            console.log('Login successful:', response);
        } catch (error) {

            console.error('Error logging in:', error);
            showToast("error", "An error occurred during login. Please try again.");
        }
    };

    connectedCallback() {
        this.querySelector('#toggle-password').addEventListener('click', () => this.togglePasswordVisibility());
        this.querySelector('.login_button').addEventListener('click', this.handleLogin);
    }

    disconnectedCallback() {
        this.querySelector('#toggle-password').removeEventListener('click', this.togglePasswordVisibility);
        this.querySelector('.login_button').removeEventListener('click', this.handleLogin);
    }

    attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("login-page", Login_Page);
