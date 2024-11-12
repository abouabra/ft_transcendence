import {Tournament_leftBracket, Tournament_rightBracket} from "../components/tournament/bracket.js";
export default class Tournament_Match extends HTMLElement {

    constructor() {
        super();
        const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/tournament_match.css'));
        this.tournament_name = new URLSearchParams(location.search).get("tournament_name")
        
        makeRequest(`/api/tournaments/joinedusertournament/?tournament_name=${this.tournament_name}`, 'GET').then(data =>{
            console.log(data)
            let usersdata = data.users
            let semi_finals = data.data[data.data.current_round]
            let middle = semi_finals.length/2
            console.log(`length of semifinal ${semi_finals.length}`)
            let finals = data.data.finals
            this.innerHTML = /*html*/`
                <div class="match_main_container">
                    <div class="parts_container d-flex flex-row">
                        <div class="Left_part">
                            <div class="match_brakets d-flex flex-row align-items-center justify-content-center">
                                <div class="d-flex flex-column bracket_group">
                                    ${Tournament_leftBracket(semi_finals.slice(0,middle), usersdata)}
                                </div>
                                <span class="oneline"></span>
                            </div>
                        </div>
                        <div class="Middle_part d-flex flex-column align-items-center">
                            <span class="header_h1 final_text">SEMI-FINALS</span>
                            <div class="winner_content">
                                <span class="header_h2">WINNER</span>
                                <img src="/assets/images/tournament_avatars/haka.jpeg" class="winner_img">
                            </div>
                            ${Tournament_leftBracket(finals, usersdata)}
                            <div class="winner_description d-flex flex-column align-items-center justify-content-center">
                                <span class="p1_bold">WIN THE TOURNAMENT</span>
                                <span class="p1_bold">TO GET THIS ACHIEVEMENT</span>
                                <img src="/assets/images/winner_icon.jpg" class="winner_img" alt="winner_icone">
                            </div>
                        </div>

                        <div class="Right_part">
                            <div class="match_brakets d-flex flex-row align-items-center justify-content-center">
                                <span class="oneline"></span>
                                <div class="d-flex flex-column bracket_group">
                                    ${Tournament_rightBracket(semi_finals.slice(middle), usersdata)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
        })
        .catch(error => {
            this.innerHTML = /*html*/`
                <div class="error_container">
                    <span class="header_h1">Error</span>
                </div>`
        });
    }
    connectedCallback() {
	}

	disconnectedCallback() {
	}

	attributeChangedCallback(name, oldValue, newValue) {}

}

customElements.define("tournament-match", Tournament_Match);