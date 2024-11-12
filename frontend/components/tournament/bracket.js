export function Tournament_leftBracket(matchs, users) {
        let result = ""

        for (let i=0; i < matchs.length; i++)
        {
            let first = users[matchs[i][0]]
            let second = users[matchs[i][1]]
            if (first == undefined)
                first = {username: "smiya", avatar: "/assets/images/tournament_avatars/haka.jpeg"}
            if (second == undefined)
                second = {username: "smiya", avatar: "/assets/images/tournament_avatars/haka.jpeg"}
            console.log(first)
            console.log("okokok")

                result += /*html*/`<div class="bracket_main_container">
                    <div class="bracket_container">
                        <div class="data_bracket">
                            <img src="${first.avatar}" class="bracket_player_img">
                            <span>${first.username}</span>
                        </div>
                        <div class="point_bracket d-flex justify-content-center align-items-center">
                            <span class="p1_regular number_points">5</span>
                        </div>
                    </div>
                    <div class="bracket_container">
                        <div class="data_bracket">
                            <img src="${second.avatar}" class="bracket_player_img">
                            <span>${second.username}</span>
                        </div>
                        <div class="point_bracket d-flex justify-content-center align-items-center">
                            <span class="p1_regular number_points">5</span>
                        </div>
                    </div>
                </div>`
        }
        return result;
}
export function Tournament_rightBracket(matchs, users) {
    let result = ""

    for (let i=0; i < matchs.length; i++)
    {
        let first = users[matchs[i][0]]
        let second = users[matchs[i][1]]
        if (first == undefined)
            first = {username: "smiya", avatar: "/assets/images/tournament_avatars/haka.jpeg"}
        if (second == undefined)
            second = {username: "smiya", avatar: "/assets/images/tournament_avatars/haka.jpeg"}

            result += /*html*/`<div class="bracket_main_container">
                <div class="bracket_container">
                    <div class="point_bracket d-flex justify-content-center align-items-center">
                        <span class="p1_regular number_points">5</span>
                    </div>
                    <div class="data_bracket">
                        <img src="${second.avatar}" class="bracket_player_img">
                        <span>${first.username}</span>
                    </div>
                </div>
                <div class="bracket_container">
                    <div class="point_bracket d-flex justify-content-center align-items-center">
                        <span class="p1_regular number_points">5</span>
                    </div>
                    <div class="data_bracket">
                        <img src="${second.avatar}" class="bracket_player_img">
                        <span>${second.username}</span>
                    </div>
                </div>
            </div>    
        `
    }
    return result;
}