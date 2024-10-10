export default class Signup1_Page extends HTMLElement{
    constructor(){
        super();
        const head = document.head || document.getElementsByName("head")[0];
        head.appendChild(createLink('/styles/user_management.css'));

        this.innerHTML = /* html */`
            <header-auth text_button="Login" url_button="/login/" url_close="/login/"></header-auth>
            <div class="main">
            <form>
                <div class="title">
                    <span class="title_form header_h2 primary_color_color">Create your profile</span>
                </div>
                <input-component type="text" placeholder="email" name="email"></input-component>
                <button-component class="login_button" data-text="Continue" ></button-component>
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

    handleLogin = async (event) => {
        event.preventDefault();

        const email = this.querySelector('input[name="email"]').value;
        const type = "forgot";
        if (!email) {
            console.log("email is required");
            showToast("error", "email is required");
            return;
        }

        const data = {
            email,
            type
        };

        try {
            const response = await makeRequest('/api/auth/verification_email/', 'POST', data);
            const response2 = await makeRequest('/api/auth/send-email/', 'POST', data);
        } catch (error) {
            showToast("error", error);
        }
    };

    connectedCallback() {
        this.querySelector('.login_button').addEventListener('click', this.handleLogin);
    };

    disconnectedCallback() {
        this.querySelector('.login_button').removeEventListener('click', this.handleLogin);
    };

    attributeChangedCallback(name, oldValue, newValue) {};
}

customElements.define("signup1-page", Signup1_Page);