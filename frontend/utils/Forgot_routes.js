import Forgot_Password_1 from '../pages/ForgotPassword_1.js';
import Forgot_Password_2 from '../pages/ForgotPassword_2.js';

export default class Forgot_Routes extends HTMLElement{
    constructor(){
        super();
        this.query = window.location.search;
        if (this.query) {
            this.wait_resp();
        } else {
            const forgot1 = new Forgot_Password_1();
            this.replaceChildren(forgot1);
        }
    }
    async wait_resp(){
        try {
            let resp = await makeRequest(`/api/auth/signup/${this.query}`, 'GET');
            const forgot2 = new Forgot_Password_2();
            this.replaceChildren(forgot2);
        } catch (error) {

            console.log('Error logging in:', error);
            showToast("error", error.message);
        }
    }
}

customElements.define("forgot-routes", Forgot_Routes);