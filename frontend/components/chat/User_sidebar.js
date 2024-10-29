
export default class UserSideBar extends HTMLElement
{
    constructor()
    {
        super();


        this.server_name = location.pathname.split('/').pop()
    }

    renderPannels(title, data, server_result)
    {
        this.innerHTML = /* html */`

            <div class="header_right_side_bar">
                <span class="p1_bold leave_pannel">X</span>
                <span class="p1_bold">${title}</span>
            </div>
            <div class="user_info_right_side_bar">
                <img src="${server_result.avatar}" alt="avatar" class="sliding_elementimg hidden">
                <span class="header_h3 sliding_elementtext hidden">${server_result.server_name}</span>
            </div>
            <div class="pannel_tag">
                ${ data.map((item) => {
                    let pannel_red = "pannel_red"
                    if (item.red === false)
                        pannel_red = ""
                    return /* html */ `
                        <div class="${item.pannel} pannel_block ${pannel_red}">
                            <div>
                                <img src="${item.icon}">
                            </div>
                            <span class="p2_regular">${item.text}</span>
                        </div>
                    `
                }).join("")
            }
            </div>`
            data.map((item) => {
                if (item.onclick !== '')
                {
                    const pannel = this.querySelector(`.${item.pannel}`)
                    if (pannel)
                    {
                        pannel.addEventListener('click', ()=>{
                             item.onclick(item.args)
                        })
                    }
                }
            })
           
        // pannelclick(this.server_name)
        const shrink = this.querySelector(".leave_pannel")
        shrink.addEventListener('click', ()=>{
            this.parentElement.style.width = 0;
            document.querySelector(".more-dots").style.display = "flex";
            this.querySelector(".sliding_elementimg").classList.add("hidden")
            this.querySelector(".sliding_elementtext").classList.add("hidden")
            document.querySelector(".more-dots").style.display = "flex"
        })
    }

    get data() {
        return this._data;
      }
      set data(newVal) {
        this._data = newVal;
      }

    connectedCallback() {}

    disconnectedCallback() {}

    static get observedAttributes() { return ['type']; }
    attributeChangedCallback(name, oldValue, newValue) {

        if (name === 'type') {
            if (newValue === 'groupsettings' && oldValue) {
                let server_item = [
                    {"pannel": "pannel_edit" ,"icon": "/assets/images/common/Iconly/Bold/Edit.svg", "text": "Edit", "red": false, "onclick": EditPanel, 'args': this._data.server_name},
                    {"pannel": "pannel_share" ,"icon": "/assets/images/common/Iconly/Bold/Scan.svg", "text": "Share", "red": false, "onclick": Qr_codedisplay, 'args': this._data.qr_code},
                    {"pannel": "pannel_leave" ,"icon": "/assets/images/common/Iconly/Bold/Logout.svg", "text": "Leave Server", "red": true, "onclick": LeavePanel, 'args': this._data.server_name}]
                if (this._data.staffs.includes(parseInt(localStorage.getItem("id"))))
                {
                    server_item.push({"pannel": "pannel_delete" ,"icon": "/assets/images/common/Iconly/Bold/Delete.svg", "text": "Delete Server", "red": true, "onclick": DeletePanel, 'args': this._data.server_name})
                }
                let title = "Server info"
                this.renderPannels(title, server_item, this._data)
            }
            else if (newValue === 'usersettings')
            {

                let title = "User info"
                let user_server_item = [{"pannel": "pannel_view" ,"icon": "/assets/images/common/Iconly/Bold/Profile.svg", "text": "View profile", "red": false, "onclick":''},
                {"pannel": "pannel_game" ,"icon": "/assets/images/common/Iconly/Bold/Game.svg", "text": "Invite to game", "red": false, "onclick":''},
                {"pannel": "pannel_message" ,"icon": "/assets/images/common/Iconly/Bold/Message.svg", "text": "Message", "red": false, "onclick":''},
                {"pannel": "pannel_invite" ,"icon": "/assets/images/common/Iconly/Bold/Add User.svg", "text": "Add to friend list", "red": false, "onclick":''},
                {"pannel": "pannel_adminprev" ,"icon": "/assets/images/common/Iconly/Bold/Tick Square.svg", "text": "Give administrator privileges", "red": false, "onclick":''},
                {"pannel": "pannel_adminrmv" ,"icon": "/assets/images/common/Iconly/Bold/Tick Square.svg", "text": "Remove administrator privileges", "red": false, "onclick":''},
                {"pannel": "pannel_ban" ,"icon": "/assets/images/common/Iconly/Bold/Danger.svg", "text": "Ban from server", "red": true, "onclick":''},
                {"pannel": "pannel_unban" ,"icon": "/assets/images/common/Iconly/Bold/Danger.svg", "text": "Unban from server", "red": true, "onclick":''}]
                this._data.server_name = this._data.username
                this.renderPannels(title, user_server_item,this._data)
            }
        }
    } 
}

customElements.define("user-pannel", UserSideBar);


function Qr_codedisplay(qr_code)
{

    if (document.querySelector(".qr-body"))
    {
	    document.querySelector(".qrmg").src = qr_code
    }
    else
    {
	    let divqr = document.createElement('div')
	    divqr.classList.add('qr-body')

	    divqr.innerHTML = /* html */ `
	    	<div class="qr_dataimg">
	    		<span>Invite Link</span>
	    		<img src="/assets/images/server_avatars/default.jpg" class="qrmg">
	    		<button-component data-text="Close" class="back_buton"></button-component>
	    	</div>
	    `
	    divqr.querySelector(".back_buton").addEventListener('click', ()=>{
	    	document.querySelector(".Qr_code_data").style.display = "none"
	    })
	    divqr.querySelector(".qrmg").src = qr_code

	    document.querySelector(".Qr_code_data").appendChild(divqr)
    }
    document.querySelector(".Qr_code_data").style.display = "flex"

}

function EditPanel(server_name)
{
    GoTo(`/chat/edit_server/${server_name}`)
}

function DeletePanel(server_name)
{
    makeRequest('/api/chat/delete_server/', 'Delete', {"server": server_name}).then(data => {}).catch(error => {
        showToast("error", error)
    })
}

function LeavePanel(server_name)
{

    makeRequest(`/api/chat/leave_server/?server=${server_name}`, 'Delete').then(data => {
        GoTo('/chat/browse_chat/')
    }).catch(error => {
        showToast("error", error)
    })
}