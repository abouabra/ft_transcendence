export default class Tournament_Browse extends HTMLElement {
	constructor() {
		super();
        const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/tournament_search.css'));



        let user_data = ''
        makeRequest(`/api/tournaments/getTournamentsData/`, 'GET')
        .then(data =>{
            data.forEach(element =>
            {
                let name_dt = element.name
                if (name_dt.length > 15)
                    name_dt = name_dt.slice(0, 15) + "..."
                user_data += /* html*/`
                <div class="server_content" data-id="${element.name}">
                    <div class="infoblock">
                        <div class="serverimage">
                            <img src="${element.avatar}">
                        </div>
                        <div class="specific_info">
                            <div class="d-flex flex-column block1">
                                <span class="p1_bold platinum_40_color">Name</span>
                                <span class="header_h3">${name_dt}</span>
                            </div>
                            <div class="d-flex flex-column align-items-center">
                                <span class="p1_bold platinum_40_color">Spots</span>
                                <span class="header_h3">${element.members.length}</span>
                            </div>
                        </div>
                        <div class="join_server" data-id="${element.name}">
                            <div class="server_visibility_lock">
                                ${element.visibility === "private" ? `<img src="/assets/images/common/Iconly/Bold/Lock.svg" class="icon_lock">`: `<img src="/assets/images/common/Iconly/Bold/Unlock.svg" class="icon_lock">`}
                                <button-component data-text="join" id="${element.name}"></button-component>
                            </div>
                        </div>
                    </div>
                </div>
                `
            })


            this.innerHTML = /* html */`
            
            <section class="browse-container">
                <div class="server_description">
                    <div class="d-flex flex-row justify-content-between">
                        <div class="searchserver">
                            <input type="text" placeholder="Search for Server" class="searchinput">
                            <img  class="search_logo" src="/assets/images/common/Iconly/Light/Search.svg">
                        </div>
                        <button-component data-text="Create" onclick="GoTo('/chat/create_server/')"></button-component>
                    </div>
                    <div class="join_lists">
                        ${user_data}
                    </div>
                </div>
            </section>
            
            `
            let joinbtn = this.querySelectorAll(".join_server")
            joinbtn.forEach((element, i) => {
                element.addEventListener('click', ()=>{
                    GoTo(`/tournament/join_tournament/?tourname_name=${element.getAttribute('data-id')}`)
                })
            })
            let join_lists = this.querySelectorAll(".server_content");
            let serversearch = this.querySelector(".searchinput");
            serversearch.addEventListener("input", (e)=>{
				let input_value = e.target.value.toLowerCase();
				join_lists.forEach((element) => {
					let found_array = data.filter(item => item.server_name.toLowerCase() === element.getAttribute('data-id').toLowerCase())
					found_array = found_array.filter(item => item.server_name.toLowerCase().includes(input_value))
					element.classList.toggle("hides",!found_array.length)

				});
			})
     })
	}
	connectedCallback() {
	}

	disconnectedCallback() {
	}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("tournament-browse", Tournament_Browse);

