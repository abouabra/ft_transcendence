export default class Tournament_Create extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/tournament_create.css'));


		this.innerHTML = /* html */`
		<div class="w-100 h-100 d-flex align-items-center">
			<div class="loader-container  w-100 justify-content-center align-items-center">
				<div class="loader">
				</div>
			</div>
			<div class="creation-container  w-100 justify-content-center align-items-center platinum_40_color_border">
					<div class="cards platinum_40_color_border  flex-column align-items-center">
						<span class="header_h2">Rules</span>
						<div class="">
							<ul>
                                <div class="listcard">
                                    <li class="p2_regular">If the tournament is created but not filled within 24 hours, it will be automatically deleted.</li>
                                    <li class="p2_regular">The tournament bracket will be automatically generated once all slots are filled.</li>
								    <li class="p2_regular">Visibility Options:</li>
                                </div>
                                <ul>
									<li class="p2_regular">Public: Anyone can join the Server without restrictions.</li>
									<li class="p2_regular">Private: member must enter the server's password to join.</li>
                                </ul>
							</ul>
						</div>
					</div>
					<div class="cards_1  flex-column align-items-center">
						<div class="avatar_change d-flex flex-column justify-content-center align-items-center platinum_40_color_border">
							<span id="text_avatar">Click to change</span>
							<span id="text_avatar">Tournament avatar</span>
							<span id="text_avatar">150x150 image required</span>
						</div>
						<div class="server_name platinum_40_color_border  d-flex flex-column justify-content-center align-items-center">
							<input class="create_server_input" id= "name" type="text" placeholder="Name" maxlength="255" pattern="[a-zA-Z0-9_.]*">
						</div>
                        <div class="server_visibility platinum_40_color_border position-relative">
                            <select class="form-select-1" required>
                                <option value="" disabled selected>Select a Game</option>
                                <option value="1">Pong</option>
                                <option value="2">Space Invaders</option>
                            </select>
                            <i class="arrowdown position-absolute bottom-50"></i>
                        </div>
                        <div class="server_visibility platinum_40_color_border position-relative">
							<select class="form-select0" required>
							    <option value="" disabled selected>Number of participants</option>
							    <option value="1">4</option>
							    <option value="2">8</option>
							    <option value="3">16</option>
							</select>
							<i class="arrowdown position-absolute bottom-50"></i>
						</div>
						<div class="server_visibility platinum_40_color_border position-relative">
							<select class="form-select1" required>
							    <option value="" selected disabled>Visibility</option>
							    <option value="1">Public</option>
							    <option value="2">Private</option>
							</select>
							<i class="arrowdown position-absolute bottom-50"></i>
						</div>
						<div class="server_password platinum_40_color_border justify-content-center align-items-center">
							<input class="create_server_input" id='pass' type="password" placeholder="Password">
						</div>
						<button-component class="button_submit" data-text="Create Tournament" id="serverbutton"></button-component>
					</div>
			</div>
			<div class="cards_2 flex-column justify-content-center align-items-center w-100 h-100 platinum_40_color_border">
				<div class="platinum_40_color_border d-flex flex-column align-items-center card2_content">
					<span class="header_h2 ">Invite Link</span>
					<div class="qr_code">
						<img class="qr_codeimg" src='' alt="Qr_img">
					</div>
				</div>
				<div>
					<button-component class="button_submit" data-text="Back" id="close_qr"></button-component>
				</div>
			</div>
		</div>
		`;
		const selectElement = this.querySelector(".form-select1");
		const selectnumberplayer = this.querySelector(".form-select0");
        const selectgame = this.querySelector(".form-select-1");
		const update_avatar = this.querySelector('.avatar_change')
		const password_element = this.querySelector('.server_password')
		const submit_click = this.querySelector('#serverbutton')
		const name_tag = this.querySelector('#name')
		const password_tag = this.querySelector('#pass')
		let file_name = "default.jpg"
		let base64 = null;

		this.querySelector("#close_qr").addEventListener('click', ()=>{
			GoTo('/tournament/')
		})
		selectElement.addEventListener('change', function() {
			const value = this.value;
			if (value == 2)
				password_element.style.display = "flex";
			else
				password_element.style.display = "none";
		});
		update_avatar.addEventListener('click', ()=>{
			const fileInput = document.createElement('input');
			fileInput.type = 'file'
			fileInput.accept = "image/png, image/gif, image/jpeg"
			fileInput.click();
			
			fileInput.addEventListener("change", function () {
				var file = this.files[0];
				file_name = file.name;

				var reader = new FileReader();
				document.querySelectorAll('#text_avatar').forEach(element => {
					if (element)
						element.remove();
				});
				reader.onload = function (e) {
				update_avatar.style.backgroundImage = `url(${e.target.result})`;
				base64 = e.target.result;
			};
			reader.readAsDataURL(file);

			
		});
	});



	submit_click.addEventListener('click', ()=>
	{

		if (!name_tag.value)
		{
			showToast("error", "Tournament Name can't be empty");
			return false;
		}
        if (selectnumberplayer.value === "")
        {
            showToast("error", "Please select a number of participants");
            return false;
        }
        if (selectElement.value === "")
        {
            showToast("error", "Please select a Tournament visibility");
            return false;
        }
        if (selectgame.value === "")
        {
            showToast("error", "Please select a Game");
            return false;
        }
		let visibility = "public"
		if (selectElement.value == 2)
			visibility = "private"
		let roomsize = selectnumberplayer.value * 4
		if (roomsize == 12)
			roomsize = 16
        let game_name = "pong"
        if (selectgame.value == 2)
            game_name = "space_invaders"
		let image_extention = 'jpg';
		let avatar = "/assets/images/tournament_avatars/default_tournament.jpg";
		
		if(base64 != null)
		{
			image_extention = base64.split('/')[1].split(';')[0]
			avatar = `/assets/images/tournament_avatars/${name_tag.value}.${image_extention}`
		}
		let qr_code = `/assets/images/tournament_qr_code/${name_tag.value}.${image_extention}`

		let body = {
			"name":name_tag.value,
			"visibility":visibility,
			"avatar":avatar,
			"password":password_tag.value,
			"id":localStorage.getItem('id'),
			"img":base64,
			"qr_code":qr_code,
            "room_size":roomsize,
            "game_name": game_name,
            "total_number_of_players":1
		}

		let loader_container = this.getElementsByClassName("loader-container")[0]
		let creation_container = this.getElementsByClassName("creation-container")[0]
		let card2 = this.querySelector(".cards_2");

		loader_container.style.display = 'flex'
		creation_container.style.opacity = 0.5
		makeRequest('/api/tournaments/Tournamentcreate/', 'POST', body)
		.then(data =>{
			this.querySelector('.qr_codeimg').src = `/assets/images/tournament_qr_code/${name_tag.value}.${image_extention}`
			loader_container.style.display = 'none'
			creation_container.classList.add('pointer_enable')
			creation_container.classList.remove("platinum_40_color_border")
			card2.style.display = 'flex'
		})
		.catch(error => {
			creation_container.style.opacity = 1
			loader_container.style.display = 'none'
			console.log(error.message)
			showToast("error", error.message);
		});

	});
}

connectedCallback() {}

disconnectedCallback() {}

attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("tournament-create", Tournament_Create);