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

  win_loss_doughnut = null;
  eloChart = null;
  dataPoints = [];
  data_data = null;
  win_loss = [];
  selectedBtn = null;
  selectedDaty = null;

  render_data(data, user_id) {
    this.dataGlobal=data;
    this.data_data = data.pong;
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
              let id11 = parseInt(localStorage.getItem('id'))
              let id22 = data.user.id
              let server_name = `${id11}_${id22}`
              if (id11 > id22)
              {
                server_name = `${id22}_${id11}`
              }
              makeRequest(`/api/chat/create_chat_room/${data.user.id}`)
              makeRequest(`/api/chat/manage_userblockprotected/`, 'PUT', {"action":"ban","user_id":data.user.id, "server_name":server_name})
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




  this.win_loss = [data.pong.match_numbers.won, data.pong.match_numbers.lost];
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
  

  handle_click_button(data) {
    const value_of_active_part = this.querySelector(".leaderboard_page_active_filter span").innerText;
    if (value_of_active_part == "Pong")
      this.data_data = data.pong;
    else if (value_of_active_part == "Space Invaders")
      this.data_data = data.space_invaders;
    else if (value_of_active_part == "Road Fighter")
      this.data_data = data.road_fighter;
    this.dataPoints = this.data_data.elo_graph;
    this.eloChart.data.datasets[0].label = `${value_of_active_part} Elo Rating`;
    this.updateChart(this.selectedDaty, this.selectedBtn);
    this.win_loss = [this.data_data.match_numbers.won, this.data_data.match_numbers.lost]
    this.updateDoughnut(value_of_active_part)
    document.querySelector(".win_los_ratio_matches").innerHTML=this.data_data.win_los_ratio.matches+"%";
    document.querySelector(".win_los_ratio_tournaments").innerHTML=this.data_data.win_los_ratio.tournaments+"%";
    document.querySelector(".average_avg_duration").innerHTML=from_sec_to_min(this.data_data.average.avg_duration);
    document.querySelector(".average_avg_score").innerHTML=this.data_data.average.avg_score.toFixed(2);
    this.third_part();
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
      <div>
        <span class="header_h3">Match Numbers</span>
      </div>
      <canvas class="doughnut"></canvas>
		</div>
		<div class="win_loss_ratio">
      <div><span class="header_h4">Win Loss Ratio</span></div>
      <div><span class="header_h1 primary_color_color win_los_ratio_matches">${this.data_data.win_los_ratio.matches} %</span></div>
      <div><span class="header_h5">matches win ratio</span></div>
      <div><span class="header_h1 primary_color_color win_los_ratio_tournaments">${this.data_data.win_los_ratio.tournaments} %</span></div>
      <div><span class="header_h5">tournament win ratio</span></div>
      <div><img src="/assets/images/profile/statistique_decoration.png"></div>
		</div>
		<div class="average">
      <div><span class="header_h4">Average</span></div>
      <div><span class="header_h1 primary_color_color average_avg_duration">${this.data_data.average.avg_duration}</span></div>
      <div><span class="header_h5">Average match duration</span></div>
      <div><span class="header_h1 primary_color_color average_avg_score">${this.data_data.average.avg_score}</span></div>
      <div><span class="header_h5">Average scrore per game</span></div>
      <div><img src="/assets/images/profile/statistique_decoration.png"></div>
		</div>
	`;
  this.third_part();
  
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


  const ctx_doughnut = document.querySelector(".doughnut");

  this.win_loss_doughnut = new Chart(ctx_doughnut, {
    type: 'doughnut',
    data: {
      labels:[
        'win',
        'loss',
      ],
      datasets:[{
        label: 'Pong',
        data: this.win_loss,
        backgroundColor: [
          '#88BD6F',
          '#C03C3C',
        ],
        hoverOffset: 4
      }]
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: '#e6e7e7'
          }
        }
      }
    }
  })

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
		<div style="display: flex; align-items: center; margin-left: 20px; gap: 20px;">
			<div style="width: 0.6vw; height: 0.6vw; background-color: ${dataset.borderColor};"></div>
			<span style="font-size: 0.6vw;">${dataset.label}</span>
		</div>`;
  }


  updateDoughnut(label)
  {
    this.win_loss_doughnut.data.datasets[0].label = label;
    this.win_loss_doughnut.data.datasets[0].data = this.win_loss;
    this.win_loss_doughnut.update();
  }
	updateChart(days, button_node) {
		this.selectedBtn = button_node;
		this.selectedDaty = days;

		const filteredData = this.filterData(days, this.dataPoints);

		const labels = filteredData.map((point) =>
			point.match_id === "account_creation"
			? "Account Creation"
			: `Match ${point.match_id}`
		);

		const data = filteredData.map((point) => point.elo);
		
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


  third_part()
  {
    const third_part = document.querySelector(".third_part");
    third_part.innerHTML = /*html*/ `
      <div class="recent_games">
        <span class="header_h4">Recent Games</span>
        <div class="all_recent_games">
        ${
          this.data_data.recent_games.map((game) => {
            if (game.player1.id != this.dataGlobal.user.id){
              [game.player1, game.player2, game.player_1_score, game.player_2_score] = [game.player2, game.player1, game.player_2_score, game.player_1_score];
            }
            return /*html*/ `
              <div class="recent_game_1">
                  <img src="${game.player1.avatar}">
                  <span class="p3_bold">${game.player1.username}</span>
                  <div class="scores">
                    <span class="p3_bold platinum_40_color">${game.player_1_score}</span>
                    <span class="platinum_40_color"> - </span>
                    <span class="p3_bold platinum_40_color">${game.player_2_score}</span>
                  </div>
                  <span class="p3_bold">${game.player2.username}</span>
                  <img src="${game.player2.avatar}">
                  <div class="win_or_loss">
                    <img src="${this.dataGlobal.user.id == game.winner ? '/assets/images/profile/win_vector.png' : '/assets/images/profile/loss_vector.png'}">
                  </div>
                </div>   
             `
          }).join('')
        }          
        </div>
      </div>
      <div class="recent_tournaments">
        <span class="header_h4">Recent Tournaments</span>
        <div class="all_recent_tournaments">
        ${
          this.data_data.recent_tournaments.map((tournament) => {
            return /*html*/ `
              <div class="recent_tournament_1">
                  <img src="${tournament.avatar}">
                  <span class="p3_bold">${tournament.name}</span>
                  <span class="ranking p3_bold"># ${tournament.tournament_position}</span>
                  <div class="win_or_loss">
                    <img src="/assets/images/profile/tournament_vector.png">
                  </div>
                </div>   
             `
          }).join('')
        }
          
          </div>
        </div>
      </div>

    `;
  }

  connectedCallback() {}

  disconnectedCallback() {}

  attributeChangedCallback(name, oldValue, newValue) {}
}

customElements.define("profile-page", Profile_Page);