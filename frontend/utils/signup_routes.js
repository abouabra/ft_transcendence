import Signup1_Page from '../pages/Signup_1.js';
import Signup2_Page from '../pages/Signup_2.js';

export default class Signup_Routes extends HTMLElement{
    constructor(){
        super();
        this.query = window.location.search;
        if (this.query) {
            this.wait_resp();
        } else {
            const signup1 = new Signup1_Page();
            this.replaceChildren(signup1);
        }
    }

    async wait_resp(){
        try {
            let resp = await makeRequest(`/api/auth/signup/${this.query}`, 'GET');
            const signup2 = new Signup2_Page();
            this.replaceChildren(signup2);
        } catch (error) {

            console.log('Error logging in:', error);
            showToast("error", error.message);
        }
    }
}

customElements.define("signup-routes", Signup_Routes);