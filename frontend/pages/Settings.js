
export default class Settings_Page extends HTMLElement {
	
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/settings_page.css'));
		this.data= null;
		makeRequest('/api/auth/user_info/', 'GET')
		.then(response => {
			this.render_data(response);
		})
		.catch(error => console.log(error));	
	}

	change_image_uploaded(event, imgSelector) {
		const input = event.target;
		if (input.files && input.files[0]) {
			const img = this.querySelector(imgSelector);
			img.onload = () => {
				URL.revokeObjectURL(img.src);
			};
			img.src = URL.createObjectURL(input.files[0]);
			input.blur();
		}
	}
	render_data(response) {
    	let check_2fa = response.two_f_a ? "Disable" : "Enable";

		this.innerHTML = /* html */`
		<div class="main_settings">
			<div class="settings_content">
				<div>
					<p class="header_h2 primary_color_color">Edit profile</p>
				</div>
				<div class="change_profile_banner">
					<input type="file" name="pdp_uploaded" class="input_file" id="input_banner" accept="image/png , image/jpeg">
					<img src="${response.profile_banner}" id="banner">
					<p class="p3_regular a">Click to change <br>Profile Banner <br>1226x212 image required</p>
				</div>
				<div class="upload_pdp_and_2fa_and_inputs">
					<div class="upload_pdp_and_2fa">
					<div class="upload_pdp">
						<input type="file" name="pdp_uploaded" class="input_file" id="input_pdp" accept="image/png, image/jpeg">
						<p class="p3_regular a">Click to change <br>Profile avatar <br>150x150 <br>image required</p>
						<img src="${response.pdp}" id="pdp">
					</div>
					<div>
						<label class="switch">
							<input type="checkbox" id="two_f_a_switch">
							<span class="slider"></span>
						</label>
						<span class="p2_regular a paragraph_active_2fa">${check_2fa} Two factor authentication</span>
					</div>
					</div>
					<div class="inputs">
						<input class="settings_input" type="text" value="${response.username}" name="uname">
						<div class="pass">
							<input class="settings_input" type="password" placeholder="Password" name="psw" id="Password-1" required>
							<a id="toggle-password-1">
								<img src="/assets/images/common/Iconly/Light/Show.svg" alt="eye" id="toggle-icon-1">
							</a>
						</div>
						<div class="pass">
							<input class="settings_input" type="password" placeholder="Password Confirmation" name="psw" id="Password-2" required>
							<a id="toggle-password-2">
								<img src="/assets/images/common/Iconly/Light/Show.svg" alt="eye" id="toggle-icon-2">
							</a>
						</div>
					</div>
				</div>
				<div class="button">
					<button-component class="save_button" data-text="save" ></button-component>
					<span class="delete_account primary_color_color">Delete Account</span>

				</div>
			</div>
		</div>
		`;
		const input_2fa = document.querySelector("#two_f_a_switch");
		
		
		if (response.two_f_a) {
			input_2fa.setAttribute("checked", "");
		} else {
			input_2fa.removeAttribute("checked", "");
		}
		this.querySelector('.save_button').addEventListener('click', () => this.handleSave());
		this.querySelector('#toggle-password-1').addEventListener('click', () => togglePasswordVisibility('#Password-1', '#toggle-icon-1'));
        this.querySelector('#toggle-password-2').addEventListener('click', () => togglePasswordVisibility('#Password-2', '#toggle-icon-2'));
		this.querySelector('#input_pdp').addEventListener('change', (event) => this.change_image_uploaded(event, "#pdp"));
		this.querySelector('#input_banner').addEventListener('change', (event) => this.change_image_uploaded(event, "#banner"));
		this.addEventListener('keydown', (event) => {if (event.key === 'Enter') {this.handleSave()}});
		this.querySelector('#two_f_a_switch').addEventListener('change', (event) => this.change_state_2fa(event, response))
		this.querySelector('.delete_account').addEventListener('click', () => this.delete_account());
	}

	delete_account(){
		const center_part = document.getElementById("base_page");
		center_part.innerHTML+=/*html*/
		`
			<div class="card " id="card2" tabindex="1" autofocus >
				<div class="small_card card2">
					<span class="header_h4">Are you sure you want to delete your account ?</span>
					<span class="header_h5">Your account, including all informations and statistics, will be gone. they cannot be retrieved.</span>
					<div class="small_card_cta">
						<button-component data-text="Cancel" data-type="no-bg" onclick="Delete_Card('#card2')"></button-component>
						<button-component data-text="Delete" class="validate_2fa" onclick="delete_user()"></button-component>
					</div>
				</div>
			</div>
		`;
	}



	change_state_2fa(event, response_1){
		const paragraph_active_2fa = document.querySelector(".paragraph_active_2fa");
		const username = response_1.username; 
		const data={
			username
		}
		showSpinner();
		makeRequest('/api/auth/update_2fa/', 'PUT', data)
		.then((response) => {
			if(response.user_is_auth)
			{
				hideSpinner();
				const center_part = document.getElementById("base_page");
				center_part.innerHTML+=/*html*/
				`
				<div class="card" style="display:flex" id="card1" tabindex="0" autofocus >
					<div class="small_card card1" >
					<span class="header_h3">Two-Factor Authenticator</span>
					<span class="header_h5">Scan the QR code with your Two factor Authenticator app</span>
						<div class="d-flex flex-column align-items-center">
							<img src="../assets/images/qrcode_2fa/qrcode.png">
						</div>
						<div class="small_card_cta">
							<button-component data-text="Cancel" data-type="no-bg" onclick="Delete_Card('#card1'); Delete_Card('#card2')"></button-component>
							<button-component data-text="Verify" onclick="change_display('#card1', '#card2')" ></button-component>
						</div>
					</div>
                </div>
				<div class="card " style="display:none" id="card2" tabindex="1" autofocus >
					<div class="small_card card2">
						<span class="header_h3">Set up Autheticator</span>
						<span class="header_h5">Enter the 6-digit code that you see in the app</span>
						<div class="d-flex flex-column align-items-center">
							<form>
								<div class="inputs_2fa">
									<input type="text" class="header_h3 input_2fa" maxlength="1" id="input1">
									<input type="text" class="header_h3 input_2fa" maxlength="1" id="input2">
									<input type="text" class="header_h3 input_2fa" maxlength="1" id="input3">
									<input type="text" class="header_h3 input_2fa" maxlength="1" id="input4">
									<input type="text" class="header_h3 input_2fa" maxlength="1" id="input5">
									<input type="text" class="header_h3 input_2fa" maxlength="1" id="input6">	
								</div>
							</form>
						</div>

						<div class="small_card_cta">
							<button-component data-text="Cancel" data-type="no-bg" onclick="Delete_Card('#card2')"></button-component>
							<button-component data-text="validate" class="validate_2fa"></button-component>
						</div>
					</div>
                </div>
				`;
				const card1 = document.querySelector("#card1");
				const card2 = document.querySelector("#card2");
				
				card1.addEventListener('keydown', (event) => {
					if (event.key === 'Enter') {
						if(card1.style.display === "flex")
							change_display('#card1', '#card2');
						else if(card2.style.display === "flex")
							this.validate_two_f_a(response_1.username);
					}
				});

				const inputs = document.querySelectorAll(".input_2fa");
				const click_2fa = document.querySelector(".validate_2fa").addEventListener('click',  () => this.validate_two_f_a(response_1.username));
				inputs.forEach((input, index) => {
					input.addEventListener("input", (e) => {
						const nextInput = inputs[index + 1];
						if(input.value.length === 1 && nextInput && !nextInput.value.length) nextInput.focus();
					})
					input.addEventListener("keydown", (e) => {
						if (e.key === "Backspace" && input.value === "") {
						const prevInput = inputs[index - 1];
						if (prevInput) prevInput.focus();
						}
					});
				})
				paragraph_active_2fa.innerHTML="Disable Two factor authentication";
			}
			else
			{
				hideSpinner();
				paragraph_active_2fa.innerHTML="Enable Two factor authentication";
				showToast("success", "Two factor authetication is disabled")
			}
		})
		.catch(error => {
			showToast("error", error.message)
			console.log("error")});			
	}

	get2FACode = () => {
		const inputs = document.querySelectorAll('.input_2fa');
		console.log(inputs)
		let code = '';
	
		inputs.forEach(input => {
			code += input.value;
		});
		if(code.length != 6)
			code = 0;
		return code;
	};

	validate_two_f_a = async(response)=>{
		const username = localStorage.getItem("username");
        const from_login = false;
		const data = {
			username,
			from_login
		};
		data.otp = this.get2FACode();
		if (!data.otp){
			showToast("error", "fill all feild");
			return;
		}
		try{
			console.log("verify_2fa", data)
			const response = await makeRequest('/api/auth/verify_2fa/', 'POST', data);
			console.log(response);
			Delete_Card('#card2');
			showToast("success", "Two factor authetication is enabled")
			const input_2fa = document.querySelector("#two_f_a_switch");
			input_2fa.setAttribute("checked", "");
			const paragraph_active_2fa = document.querySelector(".paragraph_active_2fa");
			paragraph_active_2fa.innerHTML="Disable Two factor authentication";

		}catch{
			showToast("error", "code incorrect. Please check you app auth.");
		}
	}

	handleSave = async() =>{
		const bannerInput = this.querySelector('#input_banner');
		const avatarInput = this.querySelector('#input_pdp');
		const username = this.querySelector('[name="uname"]').value;
		const password = this.querySelector('#Password-1').value;
		const password_confirmation = this.querySelector('#Password-2').value;
		const bannerInput_file = bannerInput.files[0];
		const avatarInput_file = avatarInput.files[0];
		const data = {
			username,
			password,
			password_confirmation,
		};
		if (bannerInput_file || avatarInput_file) {
			const readFileAsBase64 = (file) => new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => resolve(reader.result);
				reader.onerror = reject;
				reader.readAsDataURL(file);
			});
	
			try {
				if (bannerInput_file) {
					data.bannerImage = await readFileAsBase64(bannerInput_file);
				}
				if (avatarInput_file) {
					data.avatarImage = await readFileAsBase64(avatarInput_file);
				}
			} catch (error) {
				showToast("error", "Failed to read files.");
				return;
			}
		}
		makeRequest('/api/auth/user_info/', 'POST', data)
		.then(response => {
			if(response.success)
			{
				document.getElementsByClassName("header_h1")[0].innerHTML=username;
				const pro=document.getElementsByClassName("user-bar-icon")[0].src=response.avatar;
				showToast("success", response.success)
				localStorage.setItem("username", username);
				localStorage.setItem("avatar", response.avatar);
			}
		})
		.catch(error => showToast("error", error.message));	
	}

	connectedCallback() {
	}

	disconnectedCallback() {
		this.querySelector('#toggle-password-1').removeEventListener('click', () => togglePasswordVisibility('#Password-1', '#toggle-icon-1'));
        this.querySelector('#toggle-password-2').removeEventListener('click', () => togglePasswordVisibility('#Password-2', '#toggle-icon-2'));
	}	

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("settings-page", Settings_Page);



