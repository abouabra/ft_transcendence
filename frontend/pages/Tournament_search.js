export default class Tournament_Browse extends HTMLElement {
	constructor() {
		super();
        const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/tournament_search.css'));



        let user_data = ''
        console.log("soooo")
        makeRequest(`/api/tournaments/TournamentsData/`, 'GET')
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
                                <span class="p1_bold platinum_40_color">${element.game_name}</span>
                                <span class="header_h3">${name_dt}</span>
                            </div>
                            <div class="d-flex flex-column align-items-center">
                                <span class="p1_bold platinum_40_color">Spots</span>
                                <span class="header_h3">${element.members.length} / ${element.room_size}</span>
                            </div>
                        </div>
                        <div class="join_server" data-id="${element.name}">
                            <div class="server_visibility_lock">
                                ${element.members.includes(parseInt(localStorage.getItem("id"))) ? `<button-component data-text="View Tournament" id="${element.name}"></button-component>`
                                    :  (element.members.length === element.room_size ? (`<button-component data-text="Room Full" id="${element.name}"></button-component>`) : (element.visibility === "private" ? `<img src="/assets/images/common/Iconly/Bold/Lock.svg" class="icon_lock"><button-component data-text="join" id="${element.name}"></button-component>`: `<img src="/assets/images/common/Iconly/Bold/Unlock.svg" class="icon_lock">
                                        <button-component data-text="join" id="${element.name}"></button-component>`))
                                }
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
                        <button-component data-text="Create" onclick="GoTo('/tournament/create_tournament/')"></button-component>
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
                    if(data[i].members.includes(parseInt(localStorage.getItem("id"))))
                    {
                        GoTo(`/tournament/match/?tournament_name=${element.getAttribute('data-id')}`)
                    }
                    else
                    {
                        if (data[i].members.length >= data[i].room_size)
                        {
                            if (element.disabled != true)
                                showToast("error", "Room is full")
                            element.disabled = true
                        }
                        else
                            GoTo(`/tournament/join_tournament/?room_name=${element.getAttribute('data-id')}`)
                    }
                })
            })
            let join_lists = this.querySelectorAll(".server_content");
            let serversearch = this.querySelector(".searchinput");
            serversearch.addEventListener("input", (e)=>{
				let input_value = e.target.value.toLowerCase();
				join_lists.forEach((element) => {
					let found_array = data.filter(item => item.name.toLowerCase() === element.getAttribute('data-id').toLowerCase())
					found_array = found_array.filter(item => item.name.toLowerCase().includes(input_value))
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

