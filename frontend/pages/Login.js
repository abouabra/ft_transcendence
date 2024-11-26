export default class Login_Page extends HTMLElement {
    constructor() {
        super();
        const head = document.head || document.getElementsByTagName("head")[0];
        head.appendChild(createLink('/styles/user_management.css'));

        this.innerHTML = /* html */ `
        <div id="displaay">
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
                    <button class="sso_buttons" id="intra" onclick="handleLoginIntra(event)"><img src="/assets/images/user_management/42.svg" alt="42" width="21" height="21">Intra</button>
                    <button class="sso_buttons" id="google" onclick="handleLoginGoogle(event)"><img src="/assets/images/user_management/google.svg" alt="42" width="21" height="21">Google</button>
                </div>

                <div class="privacy_policy">
                    <span>By logging in, you agree to our <a onclick="GoTo('/privacy/')">Privacy Policy</a>.</span>
                </div>
            </div>
        </div>
        <div id="displaaay">
        <div class="main main_2fa">
            <form>
                <div class="title">
                    <span class="title_form header_h2 primary_color_color">Two Factor Authentication</span>
                </div>
                <div class="inputs_2fa">
                    <input type="text" class="header_h3 input_2fa" maxlength="1" id="input1">
                    <input type="text" class="header_h3 input_2fa" maxlength="1" id="input2">
                    <input type="text" class="header_h3 input_2fa" maxlength="1" id="input3">
                    <input type="text" class="header_h3 input_2fa" maxlength="1" id="input4">
                    <input type="text" class="header_h3 input_2fa" maxlength="1" id="input5">
                    <input type="text" class="header_h3 input_2fa" maxlength="1" id="input6">
                </div>
            
                <button-component class="login_button" data-text="Submit" id="submit"></button-component>
            </form>
            </div>
        </div>
        `;

        const inputs = document.querySelectorAll(".input_2fa");
        inputs.forEach((input, index) => {
            input.addEventListener("input", (e) => {
                const nextInput = inputs[index + 1];
                if(input.value.length === 1 && nextInput && !nextInput.value.length) nextInput.focus();
            })
            input.addEventListener("keydown", (e) => {
                if (e.key === "Backspace" && input.value === "") {
                  const prevInput = inputs[index - 1];
                  if (prevInput) prevInput.focus();
                }
              });
        })
    }

    
    get2FACode = () => {
        const inputs = document.querySelectorAll('.input_2fa');
        let code = '';
    
        inputs.forEach(input => {
            code += input.value;
        });
        if(code.length != 6)
            code = 0;
        return code;
    };
    


    handleLogin = async (event) => {
        event.preventDefault();

        const username = this.querySelector('input[name="username"]').value;
        const password = this.querySelector('input[name="password"]').value;
        
        if (!username) {
            showToast("error", "Username is required");
            return;
        }
        if (!password) {
            showToast("error", "Password is required");
            return;
        }
        const from_login = true;
        const data = {
            username,
            password,
            from_login
        };
        try {
            const response = await makeRequest('/api/auth/login/', 'POST', data);
            if(response.response_code == 404)
                throw new Error("")
            if (response.user_is_auth){
                change_display("#displaay", "#displaaay");
                const submitButton = document.querySelector('#submit').addEventListener('click',async (e)=> {
                    e.preventDefault();
                    data.otp = this.get2FACode();
                    if (!data.otp){
                        showToast("error", "fill all feild");
                        return;
                    }
                    try{
                        const response = await makeRequest('/api/auth/verify_2fa/', 'POST', data);
                        console.log(response);
                        GoTo("/home/")
                    }catch{
                        showToast("error", "code incorrect. Please check you app auth.");
                    } 
                })
            }
            else{
                GoTo("/home/")
            }
        } catch (error) {
            showToast("error", "username or password incorrect. Please try again.");
        }
    };
    

    connectedCallback() {
        this.querySelector('#toggle-password').addEventListener('click', () => togglePasswordVisibility("#Password", "#toggle-icon"));
        this.querySelector('.login_button').addEventListener('click', this.handleLogin);
    }
    
    disconnectedCallback() {
        // this.querySelector('#toggle-password').removeEventListener('click', () => togglePasswordVisibility("#Password", "#toggle-icon"));
        // this.querySelector('.login_button').removeEventListener('click', this.handleLogin);
    }

    attributeChangedCallback(name, oldValue, newValue) {}
}
customElements.define("login-page", Login_Page);
