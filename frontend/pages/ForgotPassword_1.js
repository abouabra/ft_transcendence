export default class Forgot_Password_1 extends HTMLElement {
    constructor() {
        super();
        const head = document.head || document.getElementsByTagName("head")[0];
        head.appendChild(createLink('/styles/user_management.css'));

        this.innerHTML = /* html */`
            <header-auth text_button="Login" url_button="/login/" url_close="/login/"></header-auth>
            <div class="main">
                <form id="forgot-password-form">
                    <div class="title">
                        <span class="title_form header_h2 primary_color_color">Forgot password</span>
                    </div>
                    <div id="displaay">
                        <div class="privacy_policy">
                            <span>We will send you instructions on how to reset your password by email.</span>
                        </div>
                        <input-component type="email" placeholder="Email" name="email" required></input-component>
                        <button-component class="login_button" data-text="Submit" id="login_button"></button-component>
                    </div>
                    <div id="displaaay">
                        <div class="privacy_policy">
                            <span>We have sent you instructions by email to reset your password.</span>
                        </div>
                    </div>
                </form>
            </div>
        `;
    }

    change_display() {
        const display_1 = document.querySelector("#displaay");
        const display_2 = document.querySelector("#displaaay");

        display_1.style.display = "none";
        display_2.style.display = "block";
    }

    connectedCallback() {
        const emailInput = this.querySelector('#forgot-password-form input[type="email"]');

        this.querySelector('#login_button').addEventListener('click', (event) => {
            event.preventDefault();
            

            if (emailInput.checkValidity()) {
                this.change_display();
            } else {
                emailInput.reportValidity();
            }
        });
    }

    disconnectedCallback() {
        this.querySelector('#login_button').removeEventListener('click', this.change_display);
    }

    attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("forgot-password-1", Forgot_Password_1);
