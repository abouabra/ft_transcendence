import {Tournament_leftBracket, Tournament_rightBracket, display_tournaments} from "../components/tournament/bracket.js";
export default class Tournament_Match extends HTMLElement {

    constructor() {
        super();
        const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/tournament_match.css'));
        this.tournament_name = new URLSearchParams(location.search).get("tournament_name")
        this.socket = new WebSocket(`wss://${window.location.hostname}/tournament/${this.tournament_name}`);

        this.renderpage()

        this.socket.onmessage = (event) => {
            const datamessage = JSON.parse(event.data)
            console.log(datamessage)
            this.renderpage()
        }
    }

    renderpage() {
        makeRequest(`/api/tournaments/joinedusertournament/?tournament_name=${this.tournament_name}`, 'GET').then(data =>{
            let usersdata = data.users
            let semi_finals = data.data[data.data.current_round]
            let middle = semi_finals.length/2
            let finals = data.data.finals
            let Left_side;
            let winner = 0
            if (data.winner != 0)
                winner = usersdata[data.winner]
            const winner_block = `<span class="header_h3 text-center">${winner.username}</span>`
            this.innerHTML = /*html*/`
                <div class="match_main_container">
                    <div class="parts_container d-flex flex-row">
                        <div class="Left_part">
                            <div class="match_brakets d-flex flex-row align-items-center justify-content-center">
                                ${display_tournaments(usersdata, data.data, "left", data.avatar)}
                            </div>
                        </div>
                        <div class="Middle_part d-flex flex-column align-items-center">
                            <span class="header_h1 final_text">FINALS</span>
                            <div class="winner_content">
                                <span class="header_h2">WINNER</span>
                                <div class="d-flex flex-column winner_block">
                                    <img src="${winner !== 0 ? winner.avatar : data.avatar}" class="winner_img">
                                    ${winner !== 0 ?winner_block:''}
                                </div>
                            </div>
                            <div class="d-flex flex-column align-items-center justify-content-center">
                                ${Tournament_leftBracket(finals, usersdata, data.avatar)}
                            </div>
                            <div class="winner_description d-flex flex-column align-items-center justify-content-center">
                                <span class="p1_bold">WIN THE TOURNAMENT</span>
                                <span class="p1_bold">CHAMPION</span>
                                <img src="/assets/images/winner_icon.jpg" class="winner_img" alt="winner_icone">
                            </div>
                            ${(localStorage.getItem('id') == data.owner && data.status == "Waiting for players") ? '<div class="playing2 p3_bold">Start Tournament</div>': ''}
                        </div>

                        <div class="Right_part">
                            <div class="match_brakets d-flex flex-row align-items-center justify-content-center">
                                ${display_tournaments(usersdata, data.data, "right", data.avatar)}
                            </div>
                        </div>
                    </div>
                </div>
            `
            if (winner !== 0)
                this.querySelector(".winner_img").classList.add("winner_styling");
            let play = document.querySelector(".playing2");
            const keys= Object.keys(data.data)

            const bracketsets = this.querySelectorAll(".bracket_container")

            bracketsets.forEach(element => {
                const nameline = element.querySelector(".bracket_username");
                nameline.addEventListener("click", () => {
                    if (element.getAttribute("data-id") != 0)
                        GoTo(`/profile/${element.getAttribute("data-id")}`)
                })
            })

            if (keys.length == 5)
            {

                const brackets = this.querySelectorAll(".bracket_container")
                const bracketsgap = this.querySelectorAll(".match_brakets")
                const round16 = this.querySelectorAll(".bracket_round_of_16")
                const quarterfinals = this.querySelectorAll(".bracket_quarterfinals")
                round16.forEach(element => {element.style.gap = "40px";})
                quarterfinals.forEach(element => {element.style.gap = "150px";})
                
                bracketsgap.forEach(element => {
                    element.style.gap = "10px";
                })
                brackets.forEach(element => {
                    element.style.width = "145px";
                });
            }
            else if (keys.length == 4)
            {
                const brackets = this.querySelectorAll(".bracket_container")
                const bracketsgap = this.querySelectorAll(".match_brakets")
                const quarterfinals = this.querySelectorAll(".bracket_quarterfinals")
                this.querySelector(".Left_part").style.width = "35%"
                this.querySelector(".Right_part").style.width = "35%"

                quarterfinals.forEach(element => {element.style.gap = "50px";})
                
                bracketsgap.forEach(element => {
                    element.style.gap = "5px";
                })
                brackets.forEach(element => {
                    element.style.width = "250px";
                });
            }
            if (play)
            {
                play.addEventListener("click", () => {
                    makeRequest(`/api/tournaments/testplaying/?tournament_name=${this.tournament_name}`).then(data =>{
                    }).catch(error =>{
                        showToast("error", error.message)
                    })
                })
            }
        })
        .catch(error => {
            this.innerHTML = /* html */`
            <not-found-page text_span="${error.message}" text_button="Go back to tournament" go_to="/tournament/"></not-found-page>
			`;
		});
        
    }

    connectedCallback() {
	}

	disconnectedCallback() {
        this.socket.close()
	}

	attributeChangedCallback(name, oldValue, newValue) {}

}

customElements.define("tournament-match", Tournament_Match);