export default class Create_Server_page extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/chat_create_server.css'));
		
		
		// makeRequest('/api/chat/create_server/', 'POST', {})
		// .then(data =>{
		// 	render_page(data);
		// 	showToast("success", "Server Created Successfully")
		// 	GoTo(`/chat/${data.name}`)
		// })
		// .catch(error => {
		// 	showToast("error", error);
		// });

		
		
		this.innerHTML = /* html */`
			<div class="w-100 h-100 d-flex align-items-center">
				<div class="creation-container d-flex w-100 justify-content-center align-items-center platinum_40_color_border">
				<div class="cards platinum_40_color_border d-flex flex-column align-items-center">
					<span class="header_h2">Rules</span>
					<div class="w-75">
						<ul>
						<li class="p2_regular">Visibility Options:</li>
						<ul>
						<li class="p2_regular">Public: Anyone can join the Server without restrictions.</li>
						<li class="p2_regular">Private: member must enter the server's password to join.</li>
						</ul>
						</ul>
					</div>
					</div>
					<div class="cards_1 d-flex flex-column align-items-center">
						<div class="avatar_change d-flex flex-column justify-content-center align-items-center platinum_40_color_border">
							<span id="text_avatar">Click to change</span>
							<span id="text_avatar">Server avatar</span>
							<span id="text_avatar">150x150 image required</span>
						</div>
						<div class="server_name platinum_40_color_border  d-flex flex-column justify-content-center align-items-center">
							<input class="create_server_input" type="text" placeholder="Name">
						</div>
						<div class="server_visibility platinum_40_color_border position-relative">
							<select class="form-select1">
  								<option value="1">Public</option>
  								<option value="2">Private</option>
							</select>
							<i class="arrowdown position-absolute bottom-50"></i>
						</div>
						<div class="server_password platinum_40_color_border justify-content-center align-items-center">
							<input class="create_server_input" type="password" placeholder="Password">
						</div>
						<button-component class="button_submit" data-text="Create Server" onclick="GoTo('/chat/create_server/')"></button-component>
					</div>
					<div class="cards_2 platinum_40_color_border d-flex flex-column align-items-center ">
						<span class="header_h2 ">Invite Link</span>
						<div class="qr_code"></div>
					</div>
				</div>
			</div>
		`;

		const selectElement = this.querySelector(".form-select1");
		const update_avatar = this.querySelector('.avatar_change')
		const password_element = document.querySelector('.server_password')

		selectElement.addEventListener('change', function() {
  			const value = this.value;
			console.log(value);

			if (value == 2)
			{
				password_element.style.display = "flex";
			}
			else
			{
				password_element.style.display = "none";
			}
		});
		update_avatar.addEventListener('click', ()=>{
			const fileInput = document.createElement('input');
			fileInput.type = 'file'
			fileInput.click();

			fileInput.addEventListener("change", function () {
				var file = this.files[0];
				var reader = new FileReader();
				const spanElement = this.querySelectorall('span').array.forEach(element => {
					if (element)
						element.textContent = '';
					
				});
				reader.onload = function (e) {
					update_avatar.style.backgroundImage = `url(${e.target.result})`;
					var base64 = e.target.result;
					console.log(base64);
				
				};
				reader.readAsDataURL(file);
			});





			
			

		});
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("create-server-page", Create_Server_page);