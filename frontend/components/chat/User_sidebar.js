let _data = ''

export default class UserSideBar extends HTMLElement
{
    
    constructor()
    {
        super();
        this.server_name = location.pathname.split('/').pop()
        _data  = JSON.parse(this.getAttribute('data-text'))
        
        this.socket = window.userpermition_socket

        const chatbody = document.querySelector(".chatbodymain")
        if (this.socket)
        {
            this.socket.onmessage = (event) => {

                let data = JSON.parse(event.data)
                console.log(` ${data.user_id} == ${_data.user_id}`)
                if (data.message === "banning" && data.user_id == _data.user_id)
                {
                    if (_data)
                    {
                        if (data.action === "ban" && data.user_id == localStorage.getItem('id'))
                        {
                            chatbody.style.opacity = 0.5;
                            chatbody.blocked = true;
                        }
                        else
                        {
                            chatbody.style.opacity = 1;
                            chatbody.blocked = false;
                        }
                        let pannel = document.querySelector(".pannel_ban")
                        if (pannel)
                        {
                            let text = pannel.querySelector("span").innerText
                            if (text === "Unban from server")
                                text = "Ban from server"
                            else
                                text = "Unban from server"
                            if (pannel)
                                pannel.querySelector("span").innerText = text;
                        }
                    }
                }
                if (data.message === "change_privilages" && data.user_id == _data.user_id)
                {
                    let pannel = document.querySelector(".pannel_admin")
                    if (pannel)
                    {
                        let text  = pannel.querySelector("span").innerText;
                        if (text === "Remove administrator privileges")
                            text = "Give administrator privileges"
                        else
                            text = "Remove administrator privileges"
                        pannel.querySelector("span").innerText = text;
                    }
                }
            }
        }
        this.SetSideBar_button(this.getAttribute('type'))

    }

    renderPannels(title, data, server_result)
    {

        let username = server_result.username
        if (username.length > 15)
            username = username.slice(0, 15) + "..."
        this.innerHTML = /* html */`


            <div class="header_right_side_bar">
                <span class="p1_bold leave_pannel">X</span>
                <span class="p1_bold">${title}</span>
            </div>
            <div class="user_info_right_side_bar">
                <img src="${server_result.avatar}" alt="avatar" class="sliding_elementimg hidden">
                <span class="header_h3 sliding_elementtext hidden">${username}</span>
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
                            console.log(`adding onclick ${item.pannel}`)
                            item.onclick(item.args)
                        })
                    }
                }
            })


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
        return _data;
    }
    set data(newVal) {
        _data = newVal;
    }


    connectedCallback() {}

    disconnectedCallback() {
    }

    SetSideBar_button(type)
    {

        let title = "Server info"
        let server_item
        const my_id = parseInt(localStorage.getItem("id"))
        if (type === 'groupsettings')
        {
            server_item = [
                {"pannel": "pannel_share" ,"icon": "/assets/images/common/Iconly/Bold/Scan.svg", "text": "Share", "red": false, "onclick": Qr_codedisplay, 'args': _data.qr_code},
                {"pannel": "pannel_leave" ,"icon": "/assets/images/common/Iconly/Bold/Logout.svg", "text": "Leave Server", "red": true, "onclick": LeavePanel, 'args': _data.server_name}]
            if (_data.staffs.includes(my_id))
            {
                server_item.unshift({"pannel": "pannel_edit" ,"icon": "/assets/images/common/Iconly/Bold/Edit.svg", "text": "Edit", "red": false, "onclick": EditPanel, 'args': _data})
            }
        }
        else if (type === 'usersettings')
        {
            title = "User info"
            server_item = [
                {"pannel": "pannel_view" ,"icon": "/assets/images/common/Iconly/Bold/Profile.svg", "text": "View profile", "red": false, "onclick":ViewProfile, 'args':_data.user_id},
            ]
            if (_data.user_id != my_id)
            {
                server_item.push({"pannel": "pannel_pong" ,"icon": "/assets/images/common/Iconly/Bold/Game.svg", "text": "Invite to Pong", "red": false, "onclick":invite_user_to_pong, 'args': _data})
                server_item.push({"pannel": "pannel_space_invaders" ,"icon": "/assets/images/common/Iconly/Bold/Game.svg", "text": "Invite to Space Invaders", "red": false, "onclick":invite_user_to_space_invaders, 'args': _data})
                server_item.push({"pannel": "pannel_message" ,"icon": "/assets/images/common/Iconly/Bold/Message.svg", "text": "Message", "red": false, "onclick": send_user_to_direct, 'args':_data.user_id})
            }
            if(!_data.friends_list.includes(my_id) && _data.user_id != localStorage.getItem("id"))
                server_item.push({"pannel": "pannel_invite" ,"icon": "/assets/images/common/Iconly/Bold/Add User.svg", "text": "Add to friend list", "red": false, "onclick":send_friend_request, 'args':_data.user_id})

            if (_data.visibility != "protected" && _data.staffs.includes(my_id) && _data.user_id !== my_id)
            {
            
                if (_data.staffs.includes(parseInt(_data.user_id)))
                    server_item.push({"pannel": "pannel_admin" ,"icon": "/assets/images/common/Iconly/Bold/Tick Square.svg", "text": "Remove administrator privileges", "red": false, "onclick":privileges_user, 'args':[_data, this.server_name]})
                else
                    server_item.push({"pannel": "pannel_admin" ,"icon": "/assets/images/common/Iconly/Bold/Tick Square.svg", "text": "Give administrator privileges", "red": false, "onclick":privileges_user, 'args':[_data, this.server_name]})
                if (_data.banned.includes(_data.user_id))
                    server_item.push({"pannel": "pannel_ban" ,"icon": "/assets/images/common/Iconly/Bold/Danger.svg", "text": "Unban from server", "red": true, "onclick":banning, 'args':[_data, this.server_name]})
                else
                    server_item.push({"pannel": "pannel_ban" ,"icon": "/assets/images/common/Iconly/Bold/Danger.svg", "text": "Ban from server", "red": true, "onclick":banning, 'args':[_data, this.server_name]})
            }
        }
        else if (type === 'protectedsettings')
        {
            title = "User info"
            server_item = [{"pannel": "pannel_view" ,"icon": "/assets/images/common/Iconly/Bold/Profile.svg", "text": "View profile", "red": false, "onclick":ViewProfile, 'args':_data.user_id}]

            if(_data.user_id !== my_id)
            {
                server_item.push({"pannel": "pannel_pong" ,"icon": "/assets/images/common/Iconly/Bold/Game.svg", "text": "Invite to Pong", "red": false, "onclick":invite_user_to_pong, 'args': _data})
                server_item.push({"pannel": "pannel_space_invaders" ,"icon": "/assets/images/common/Iconly/Bold/Game.svg", "text": "Invite to Space Invaders", "red": false, "onclick":invite_user_to_space_invaders, 'args': _data})

                if(!_data.friends_list.includes(my_id) && _data.user_id != localStorage.getItem("id"))
                    server_item.push({"pannel": "pannel_invite" ,"icon": "/assets/images/common/Iconly/Bold/Add User.svg", "text": "Add to friend list", "red": false, "onclick":send_friend_request, 'args':_data.user_id})
            }
        }
        this.renderPannels(title, server_item,_data)
    }



    static get observedAttributes() { return ['type', 'data-text']; }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'data-text')
        {
            _data = JSON.parse(this.getAttribute('data-text'))
            
            console.log(_data.friends_list)
        }
        else if (name === 'type')
        {
            if (newValue === 'groupsettings' || newValue === 'usersettings' || newValue === 'protectedsettings')
                this.SetSideBar_button(newValue)
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

function ViewProfile(user_id)
{
    GoTo(`/profile/${user_id}`)
}

function EditPanel(data)
{
    const server_name = data.server_name

    if (data.staffs.includes(parseInt(localStorage.getItem("id"))) && !data.banned.includes(parseInt(localStorage.getItem("id"))) )
        GoTo(`/chat/edit_server/${server_name}`)
    else
        showToast("error", "You are not an administrator")
}

function DeletePanel(data)
{
    const server_name = data.server_name

    if (data.staffs.includes(parseInt(localStorage.getItem("id"))))
        console.log("delete")
    else
        showToast("error", "You are not an administrator")
}

function LeavePanel(server_name)
{

    makeRequest(`/api/chat/leave_server/?server=${server_name}`, 'Delete').then(data => {
        GoTo('/chat/browse_chat/')
    }).catch(error => {
        showToast("error", error)
    })
}

function banning(data)
{
    console.log(`data1 = ${data[1]}`)
    makeRequest(`/api/chat/get_server_data/?server=${data[1]}`, 'GET').then(svdata => {
        _data.banned = svdata[0].banned
        _data.staffs = svdata[0].staffs
        const server_name = data[1];
        const socket = window.userpermition_socket;
        console.log(svdata)
        data[0].banned = svdata[0].banned
        data[0].staffs = svdata[0].staffs
        data = data[0]
        const id = data.user_id;
        let action = "ban";
        let text = "Unban from server"

        if (data.banned.includes(parseInt(id)))
        {
            action = "unban"
            text = "Ban from server"
        }
            
        makeRequest(`/api/chat/manage_user/`, 'PUT', {"action":action,"user_id":id, "server_name":server_name}).then(data => {
            showToast("success", `User ${action}ned from server`)
            document.querySelector(".pannel_ban").querySelector("span").innerText = text;
            socket.send(JSON.stringify({"user_id": id, "action":action, "permition_to_change": "banning", "server_name": server_name,"sender":localStorage.getItem("id")}))
            }).catch(error => {
                showToast("error", error)
            })
    })
    

}

function privileges_user(data)
{

    makeRequest(`/api/chat/get_server_data/?server=${data[1]}`, 'GET').then(svdata => {
        _data.banned = svdata[0].banned
        _data.staffs = svdata[0].staffs
        const server_name = data[1];
        const socket = window.userpermition_socket;

        data[0].staffs = svdata[0].staffs
        data[0].banned = svdata[0].banned
        data = data[0]
        const id = data.user_id;
        let action = "add_staff";
        let text = "Remove administrator privileges"

        if (data.staffs.includes(parseInt(id)))
        {
            text = "Give administrator privileges"
            action = "remove_staff"
        }

        makeRequest(`/api/chat/manage_user/`, 'PUT', {"action":action,"user_id":id, "server_name":server_name}).then(data => {
            showToast("success", `Changed administrator privileges`)
            document.querySelector(".pannel_admin").querySelector("span").innerText = text;
            socket.send(JSON.stringify({"user_id": id, "action":action, "permition_to_change": "change_privilages", "server_name": server_name, "sender":localStorage.getItem("id")}))
        }).catch(error => {
            showToast("error", error)
            })
        })
}


function invite_user_to_pong(data)
{
    console.log("data inside invite_user: ", {username: data.username, avatar: data.avatar, id: data.user_id})
    handle_action("invite_to_pong", data.user_id, {username: data.username, avatar: data.avatar, id: data.user_id})
}
function invite_user_to_space_invaders(data)
{
    console.log("data inside invite_user: ", data)
    handle_action("invite_to_space_invaders", data.user_id, {username: data.username, avatar: data.avatar, id: data.user_id})
}
