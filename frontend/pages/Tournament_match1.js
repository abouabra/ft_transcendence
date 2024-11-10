import Tournament_Bracket from "../components/tournament/bracket.js";
export default class Tournament_Match1 extends HTMLElement {

    constructor() {
        super();
        const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/tournament_match.css'));

        this.innerHTML = /*html*/`
            <div class="match_main_container">
                <div class="parts_container d-flex flex-row">
                    <div class="Left_part">
                        <div class="match_brakets d-flex flex-row align-items-center justify-content-center">
                            <bracket-match direction="left"></bracket-match>
                            <span class="oneline"></span>
                        </div>
                    </div>
                    <div class="Middle_part d-flex flex-column align-items-center">
                        <span class="header_h1 final_text">SEMI-FINALS</span>
                        <div class="winner_content">
                            <span class="header_h2">WINNER</span>
                            <img src="/assets/images/tournament_avatars/haka.jpeg" class="winner_img">
                        </div>
                        <bracket-match direction="left"></bracket-match>
                        <div class="winner_description d-flex flex-column align-items-center justify-content-center">
                            <span class="p1_bold">WIN THE TOURNAMENT</span>
                            <span class="p1_bold">TO GET THIS ACHIEVEMENT</span>
                            <img src="/assets/images/winner_icon.jpg" class="winner_img" alt="winner_icone">
                        </div>
                    </div>

                    <div class="Right_part">
                        <div class="match_brakets d-flex flex-row align-items-center justify-content-center">
                            <span class="oneline"></span>
                            <bracket-match direction="right"></bracket-match>
                        </div>
                    </div>
                </div>
            </div>
        `
    }
    connectedCallback() {
	}

	disconnectedCallback() {
	}

	attributeChangedCallback(name, oldValue, newValue) {}

}

customElements.define("tournament-match1", Tournament_Match1);