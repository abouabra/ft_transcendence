import {Tournament_leftBracket, Tournament_rightBracket, display_tournaments} from "../components/tournament/bracket.js";
export default class Tournament_Match extends HTMLElement {

    constructor() {
        super();
        const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/tournament_match.css'));
        this.tournament_name = new URLSearchParams(location.search).get("tournament_name")
        this.socket = new WebSocket(`ws://127.0.0.1:8000/tournament/${this.tournament_name}`);

        this.renderpage()

        this.socket.onmessage = (event) => {
            const datamessage = JSON.parse(event.data)
            console.log(datamessage)
            this.renderpage()
            // makeRequest(`/api/auth/user/${datamessage.sender_id}/`, 'GET').then(data => {
            //     const bracketelements = this.querySelector(`.bracket_container[data-id='${data.user}']`)
            //     bracketelements[datamessage.sender_id].querySelector(".bracket_player_img").src = data.avatar
            //     bracketelements[datamessage.sender_id].querySelector("span").innerText = data.username
            // })
        }
    }

    renderpage() {
        makeRequest(`/api/tournaments/joinedusertournament/?tournament_name=${this.tournament_name}`, 'GET').then(data =>{
            let usersdata = data.users
            let semi_finals = data.data[data.data.current_round]
            let middle = semi_finals.length/2
            let finals = data.data.finals
            let Left_side;
            
            this.innerHTML = /*html*/`
                <div class="match_main_container">
                    <div class="parts_container d-flex flex-row">
                        <div class="Left_part">
                            <div class="match_brakets d-flex flex-row align-items-center justify-content-center">
                                ${display_tournaments(usersdata, data.data, "left")}
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
                                ${display_tournaments(usersdata, data.data, "right")}
                            </div>
                        </div>
                    </div>
                    <div class="playing2 h-100 w-100">Playing</div>
                </div>
            `
            let play = document.querySelector(".playing2");
        console.log(play)
        play.addEventListener("click", () => {
            console.log("trying to start playing")
            makeRequest(`/api/tournaments/testplaying/?tournament_name=${this.tournament_name}`, 'GET').then(data =>{
                console.log("started playing awla la")
            })
        })
        })
        .catch(error => {
            this.innerHTML = /*html*/`
                <div class="error_container">
                    <span class="header_h1">Error</span>
                </div>`
        });
        
    }

    connectedCallback() {
        // this.socket.close()
	}

	disconnectedCallback() {

	}

	attributeChangedCallback(name, oldValue, newValue) {}

}

customElements.define("tournament-match", Tournament_Match);