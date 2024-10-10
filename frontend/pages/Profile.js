
export default class Profile_Page extends HTMLElement {
	constructor() {
		super();
		
		const head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(createLink('/styles/profile_page.css'));

		const user_id = window.location.pathname.split("/")[2];

		makeRequest(`/api/auth/full_user/${user_id}/`)
		.then((data) => {
			this.render_data(data);
		})
		.catch((error) => {
			showToast("error", error);
		});
	}

	render_data(data)
	{
		if(data.response_code == 404)
		{
			this.innerHTML = /* html */`
				<h1> User not found</h1>
			`;
			return;
		}
		this.innerHTML = /* html */`
			<h1> Profile Page</h1>

			<div> 
				<h1> ID: ${data.id}</h1>
				<h1> Username: ${data.username}</h1>
				<h1> Email: ${data.email}</h1>
				<img src="${data.avatar}" class="profile_avatar"/>
			</div>

		`;
	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("profile-page", Profile_Page);
