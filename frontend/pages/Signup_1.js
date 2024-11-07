export default class Signup1_Page extends HTMLElement {
    constructor(){
        super();
        const head = document.head || document.getElementsByName("head")[0];
        head.appendChild(createLink('/styles/user_management.css'));

        this.innerHTML = /* html */`
            <header-auth text_button="Login" url_button="/login/" url_close="/login/"></header-auth>
            <div class="main">
                <div id="displaay">
                    <form>
                        <div class="title">
                            <span class="title_form header_h2 primary_color_color">Create your profile</span>
                        </div>
                        <input-component type="text" placeholder="email" name="email"></input-component>
                        <button-component class="login_button" data-text="Continue"></button-component>
                    </form>

                    <div class="divider">
                        <hr> <span class="or">OR</span> <hr>
                    </div>

                    <div class="sso">
                        <button class="sso_buttons" onclick="handleLoginIntra(event)"><img src="/assets/images/user_management/42.svg" alt="42" width="21" height="21">Intra</button>
                        <button class="sso_buttons" onclick="handleLoginGoogle(event)"><img src="/assets/images/user_management/google.svg" alt="42" width="21" height="21">Google</button>
                    </div>

                    <div class="privacy_policy">
                        <span>By logging in, you agree to our <a onclick="GoTo('/privacy/')">Privacy Policy</a>.</span>
                    </div>

                </div>
                <div id="displaaay">
                    <div class="display_html">
                        <div class="title">
                                <span class="title_form header_h2 primary_color_color">Verify Your Email</span>
                        </div>
                        <div class="privacy_policy">
                            <span>Please check your email for a link to verify your email address.</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    };

    connectedCallback() {
        const loginButton = this.querySelector('.login_button');
        loginButton.addEventListener('click', handle_first_one("signup", this));
    };

    disconnectedCallback() {
        const loginButton = this.querySelector('.login_button');
        loginButton.removeEventListener('click', handle_first_one("signup", this));
    };

    attributeChangedCallback(name, oldValue, newValue) {};
}

customElements.define("signup1-page", Signup1_Page);