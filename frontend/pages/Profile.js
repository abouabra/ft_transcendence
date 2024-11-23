export default class Profile_Page extends HTMLElement {
  constructor() {
    super();

    const head = document.head || document.getElementsByTagName("head")[0];
    head.appendChild(createLink("/styles/profile_page.css"));

    const user_id = window.location.pathname.split("/")[2];
	
    this.waitForSocket().then(() => {
      makeRequest(`/api/auth/profile/${user_id}/`)
        .then((data) => {
          if (data.response_code === 404) {
            this.innerHTML = /* html */ `
						<not-found-page text_span="User Not Found"></not-found-page>
					`;
            return;
          }
          this.render_data(data, user_id);
        })
        .catch((error) => {
          showToast("error", error);
        });
    });
  }

  async waitForSocket() {
    while (
      !window.notification_socket ||
      window.notification_socket.readyState !== WebSocket.OPEN
    ) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  eloChart = null;
  dataPoints = [];
  selectedBtn = null;
  selectedDaty = null;

  render_data(data, user_id) {
    console.log(data);
    if (data.user.is_blocked) {
      this.innerHTML = /*html*/ `
				<not-found-page text_span="You blocked this user" text_button="Tap to unblock" go_to="/unblock_${data.user.id}"></not-found-page>
			`;
      return;
    }
    let dot_color = "";

    if (data.user.status == "online") dot_color = '"#11ac12"';
    else dot_color = "#e84c3d";
    this.innerHTML = /* html */ `
			<div class="first_part">
				<img src="${data.user.profile_banner}" class="banner">
				<div class="left_part">
					<img src="${data.user.avatar}" class="avatar">
					<span class="dot" style="background-color:${dot_color}"></span>
					<span class="header_h1 ">${data.user.username}</span>
				</div>
				<div class="right_part">
					<div class="top_part">
						
					</div>
					<div class="bottom_part">
						<div class="leaderboard_page_header_filter">
							<div class="leaderboard_page_header_filter_item leaderboard_page_active_filter" data-name="pong">
								<span class="p4_bold Pong">Pong</span>
							</div>
							<div class="leaderboard_page_header_filter_item" data-name="space_invaders">
								<span class="p4_bold Space_Invaders">Space Invaders</span>
							</div>
							<div class="leaderboard_page_header_filter_item" data-name="road_fighter">
								<span class="p4_bold Road_Fighter">Road Fighter</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="sec_part">
			</div>
			<div class="third_part">
			</div>
		</div>
		`;

	
    if (data.user.id != localStorage.getItem("id")) {
      const first_right_top = document.querySelector(".top_part");
      first_right_top.innerHTML = /*html*/ `
			<div class="buttons_right_top">
			<button-component class="button_right_top" data-text="Add friend" data-type="no-bg"></button-component>
			<button-component class="button_right_top" data-text="Message" data-type="no-bg"></button-component>
			<button-component class="button_right_top three_point" data-text=". . ." data-type="no-bg"></button-component>
			<div class="three_point_options">
				<span class="button_right_top-items p3_regular block" >Block</span>
				<span class="button_right_top-items p3_regular report" >Report</span>
			</div>
			</div>
			`;
    }
    if (data.user.is_friend) {
      const is_friend = document.querySelector("[data-text='Add friend']");
      is_friend.setAttribute("data-text", "Remove friend");
    }

    const three_point_options = this.querySelector(".three_point_options");
    const three_points = document.querySelector(".three_point button");
    if (three_points) {
      three_points.addEventListener("click", (event) => {
        three_point_options.classList.toggle("show");
        three_points.classList.toggle("show_1");
        event.stopPropagation();
      });
      document.addEventListener("click", (event) => {
        three_point_options.classList.remove("show");
        three_points.classList.remove("show_1");
      });
    }

    const add_friend = document.querySelector("[data-text='Add friend']");
    if (add_friend) {
      add_friend.addEventListener("click", () => {
        send_friend_request(data.user.id);
        rm_friend.setAttribute("data-text", "Add friend");

        // add_friend.innerHTML="Remove friend";
      });
    }

    const rm_friend = document.querySelector("[data-text='Remove friend']");
    if (rm_friend) {
      rm_friend.addEventListener("click", () => {
        remove_friend(data.user.id);
        rm_friend.setAttribute("data-text", "Add friend");
        // rm_friend.innerHTML="Add friend";
      });
    }

    const message_direct = document.querySelector("[data-text='Message']");
    if (message_direct) {
      message_direct.addEventListener("click", () => {
        send_user_to_direct(data.user.id);
      });
    }

    const block = document.querySelector(".block");
    if (block) {
      block.addEventListener("click", () => {
        const center_part = document.getElementById("base_page");
        center_part.innerHTML +=
          /*html*/
          `
					<div class="card " id="card2" tabindex="1" autofocus >
						<div class="small_card card2">
						<span class="header_h3">Block ${data.user.username}</span>
						<span class="header_h5">Are you sure you want to block this account ?</span>
							<div class="small_card_cta">
								<button-component data-text="Cancel" data-type="no-bg" onclick="Delete_Card('#card2')"></button-component>
								<button-component data-text="Block" class="validate_2fa block_in_card"></button-component>
							</div>
						</div>
					</div>
				`;
        const block_in_card = document
          .querySelector(".block_in_card")
          .addEventListener("click", () => {
            makeRequest("/api/auth/unblock_and_block/", "POST", {
              isBlocked: false,
              id: data.user.id,
            }).then((response) => {
              const center_part = document.getElementById("base_page");
              showToast("success", "You blocked this user successfully");
              center_part.innerHTML = /*html*/ `
							<not-found-page text_span="You blocked this user" text_button="Tap to unblock" go_to="/unblock_${data.user.id}"></not-found-page>
						`;
              return;
            });
          });
      });
    }

    const report = document.querySelector(".report");
    if (report) {
      report.addEventListener("click", () => {
        const center_part = document.getElementById("base_page");
        center_part.innerHTML +=
          /*html*/
          `
				<div class="card" style="display:flex" id="card1" tabindex="0" autofocus >
					<div class="small_card_report card1" >
					<span class="header_h3">Report this user ${data.user.username}</span>
						<div class="d-flex flex-column align-items-center">
							<form>
								<div class="inputs_2fa">
									<p class="header_h4 primary_color_color">Subject :</p>
									<input type="text" class=" input_2fa subject">
									<p class="header_h4 primary_color_color">Description :</p>
									<textarea rows="6" cols="60" name="comment" class=" input_2fa description"></textarea>
								</div>
							</form>
						</div>
						<div class="small_card_cta">
							<button-component data-text="Cancel" data-type="no-bg" onclick="Delete_Card('#card1');"></button-component>
							<button-component data-text="Report" onclick="send_report(${data.user.id})" ></button-component>
						</div>
					</div>
                </div>
				`;
      });
    }

	this.create_chart();

    this.handle_click_button(data);
	
	this.createCustomLegend(this.eloChart);
	document.querySelector(".buttonContainer button").click();

    let active_part = this.querySelector(".leaderboard_page_active_filter");

    const pong = document.querySelector(".Pong").parentElement;
    const space_invaders = document.querySelector(".Space_Invaders").parentElement;
    const road_fighter = document.querySelector(".Road_Fighter").parentElement;

    pong.addEventListener("click", () => {
      active_part.classList.remove("leaderboard_page_active_filter");
      pong.classList.add("leaderboard_page_active_filter");
      active_part = pong;
      this.handle_click_button(data);
      this.createCustomLegend(this.eloChart);
    });
    space_invaders.addEventListener("click", () => {
      active_part.classList.remove("leaderboard_page_active_filter");
      space_invaders.classList.add("leaderboard_page_active_filter");
      active_part = space_invaders;
      this.handle_click_button(data);
      this.createCustomLegend(this.eloChart);
    });
    road_fighter.addEventListener("click", () => {
      active_part.classList.remove("leaderboard_page_active_filter");
      road_fighter.classList.add("leaderboard_page_active_filter");
      active_part = road_fighter;
      this.handle_click_button(data);
      this.createCustomLegend(this.eloChart);
    });
  }
  
  test_func(element, index)
  {
	  console.log("inside test_func", element, index);
  }

  handle_click_button(data) {
    const value_of_active_part = this.querySelector(".leaderboard_page_active_filter span").innerText;

    if (value_of_active_part == "Pong") {
      this.dataPoints = data.pong.elo_graph;
	  this.eloChart.data.datasets[0].label = "Pong Elo Rating";
		this.updateChart(this.selectedDaty, this.selectedBtn);
	//   this.eloChart.update();
    } else if (value_of_active_part == "Space Invaders") {
      this.dataPoints = data.space_invaders.elo_graph;
	  this.eloChart.data.datasets[0].label = "Space Invaders Elo Rating";
		this.updateChart(this.selectedDaty, this.selectedBtn);
	//   this.eloChart.update();
    } else if (value_of_active_part == "Road Fighter") {
      this.dataPoints = data.road_fighter.elo_graph;
	  this.eloChart.data.datasets[0].label = "Road Fighter Elo Rating";
		this.updateChart(this.selectedDaty, this.selectedBtn);
	//   this.eloChart.update();
    }
  }

  create_chart() {
    const sec_part = document.querySelector(".sec_part");
    sec_part.innerHTML = /*html*/ `
		<div class="graph">
			<div class="chartContainer">
				<div class="legend_container">
					<div id="customLegend" style="margin-top: 10px"></div>

					<div class="buttonContainer">
						<button id="btn-1d">1 Day</button>
						<button id="btn-5d">5 Days</button>
						<button id="btn-30d">30 Days</button>
						<button id="btn-6m">6 Months</button>
						<button id="btn-all">All Time</button>
					</div>
				</div>
				<canvas id="eloChart"></canvas>
			</div>
		</div>
		<div class="match_numbers">
		</div>
		<div class="win_loss_ratio">
		</div>
		<div class="average">
		</div>
	`;

	const one_day = document.getElementById("btn-1d");
	if(one_day)
	{
		one_day.addEventListener("click", () =>
		this.updateChart(1, one_day)
		);
	}

    const five_days = document.getElementById("btn-5d");
	if(five_days)
	{
		five_days.addEventListener("click", () =>
			this.updateChart(5, five_days)
		);
	}
	const thirty_days = document.getElementById("btn-30d")
	if(thirty_days) {
		thirty_days.addEventListener("click", () =>
        	this.updateChart(30, thirty_days)
		);
	}
      
	const six_months = document.getElementById("btn-6m")
	if(six_months)
		six_months.addEventListener("click", () =>
			this.updateChart(180, six_months)
		);

	const all_btn = document.getElementById("btn-all");
	if(all_btn)
	{
		all_btn.addEventListener("click", () =>
     	   this.updateChart(null, all_btn)
		);
	}


	const ctx = document.getElementById("eloChart").getContext("2d");
    this.eloChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: this.dataPoints.map((point) => point.match_id),
        datasets: [
          {
            label: "Pong Elo Rating",
            data: this.dataPoints.map((point) => point.elo),
            borderColor: getComputedStyle(document.documentElement)
              .getPropertyValue("--primary_color")
              .trim(), // Line color
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 7,
            fill: true,
            backgroundColor: getComputedStyle(document.documentElement)
              .getPropertyValue("--chart-underlay")
              .trim(), // Under the line

            pointBackgroundColor: getComputedStyle(document.documentElement)
              .getPropertyValue("--platinum")
              .trim(),
            pointHoverBackgroundColor: getComputedStyle(
              document.documentElement
            )
              .getPropertyValue("--platinum")
              .trim(),
          },
        ],
      },
      options: {
        responsive: true,
        animation: {
          duration: 500,
          easing: "easeInOutQuart",
        },
        interaction: {
          intersect: false,
          axis: "x",
        },
        plugins: {
          legend: {
            display: false,
            position: "top",
            align: "start",
          },
		  tooltip: {
			callbacks: {
				title: (tooltipItems) => {
					const index = tooltipItems[0].dataIndex;
					const point = this.eloChart.filteredData[index];
					const date = new Date(point.date * 1000);
					const formattedDate = date.toLocaleDateString("en-US", {
						day: "2-digit",
						month: "short",
						year: "numeric",
					});
					const matchLabel = point.match_id === "account_creation" ? "Account Creation" : "Match ";
					return `${matchLabel}${point.match_id === "account_creation" ? "" : point.match_id} - ${formattedDate}`;
				},
				label: (tooltipItem) => `Elo: ${tooltipItem.raw}`,
			},
		},
        },
        scales: {
          x: {
            title: {
              display: false,
              text: "Matches",
            },
            grid: {
              drawOnChartArea: false,
            },
            ticks: {
              display: false,
            },
          },
          y: {
            title: {
              display: true,
              text: "Elo Rating",
              color: getComputedStyle(document.documentElement)
                .getPropertyValue("--platinum")
                .trim(),
            },
            grid: {
              color: getComputedStyle(document.documentElement)
                .getPropertyValue("--platinum_40_percent")
                .trim(),
            },
            ticks: {
              color: getComputedStyle(document.documentElement)
                .getPropertyValue("--platinum")
                .trim(),
            },
            beginAtZero: false,
          },
        },
      },
    });
  }
  
  createCustomLegend(Chart) {
    const legendContainer = document.getElementById("customLegend");
    const dataset = Chart.data.datasets[0]; // Access the first dataset
    legendContainer.innerHTML = /*html*/ `
		<div style="display: flex; align-items: center; margin-left: 40px; gap: 20px;">
			<div style="width: 0.7vw; height: 0.7vw; background-color: ${dataset.borderColor};"></div>
			<span style="font-size: 0.7vw;">${dataset.label}</span>
		</div>`;
  }


	updateChart(days, button_node) {
		this.selectedBtn = button_node;
		this.selectedDaty = days;

		const filteredData = this.filterData(days, this.dataPoints);
		console.log("days", days);
		console.log("this.dataPoints", this.dataPoints);
		console.log("filteredData", filteredData);

		const labels = filteredData.map((point) =>
			point.match_id === "account_creation"
			? "Account Creation"
			: `Match ${point.match_id}`
		);

		console.log("labels", labels);


		const data = filteredData.map((point) => point.elo);
		console.log("data", data);
		
		this.eloChart.filteredData = filteredData;
		this.eloChart.data.labels = labels;
		this.eloChart.data.datasets[0].data = data;
		this.eloChart.options.animation = {
			duration: 500,
			easing: "easeInOutQuart",
		};

		this.eloChart.update();

		document.querySelectorAll(".buttonContainer button").forEach((btn) => {
			btn.style.backgroundColor = "transparent";
		});
		if(button_node)
		{
			button_node.style.backgroundColor = getComputedStyle(document.documentElement)
			.getPropertyValue("--primary_color")
			.trim();
		}
	}

	filterData(days, dataPoints) {
		const oneDayInSeconds = 86400;

		const now = Math.floor(Date.now() / 1000); // Current time in seconds
		if (!days) return dataPoints; // All time

		const rangeInSeconds = days * oneDayInSeconds;
		return dataPoints.filter((point) => now - point.date <= rangeInSeconds);
	}


  connectedCallback() {}

  disconnectedCallback() {}

  attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("profile-page", Profile_Page);
