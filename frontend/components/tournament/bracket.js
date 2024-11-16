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
                result += /*html*/`<div class="bracket_main_container">
                    <div class="bracket_container" data-id=${matchs[i][0]}>
                        <div class="data_bracket">
                            <img src="${first.avatar}" class="bracket_player_img">
                            <span>${first.username}</span>
                        </div>
                        <div class="point_bracket d-flex justify-content-center align-items-center">
                            <span class="p1_regular number_points">5</span>
                        </div>
                    </div>
                    <div class="bracket_container" data-id="${matchs[i][1]}">
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
                <div class="bracket_container" data-id="${matchs[i][0]}">
                    <div class="point_bracket d-flex justify-content-center align-items-center">
                        <span class="p1_regular number_points">5</span>
                    </div>
                    <div class="data_bracket">
                        <img src="${second.avatar}" class="bracket_player_img">
                        <span>${first.username}</span>
                    </div>
                </div>
                <div class="bracket_container" data-id="${matchs[i][1]}">
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

export function display_tournaments(usersdata, data, position)
{
    let result = []
    const position_keys = ["round_of_16", "quarterfinals", "semifinals"]
    let 
    for (const key in data)
    {
        if (key === "current_round" || key === "finals")
            continue
        if (position === "left")
        {
            result.push(/*html*/`
                <div class="d-flex flex-column bracket_group">
                    ${Tournament_leftBracket(data[key].slice(0,data[key].length/2), usersdata)}
                </div>
            `)
        }
        else
        {
            result.push(/*html*/`
                <div class="d-flex flex-column bracket_group">
                    ${Tournament_rightBracket(data[key].slice(data[key].length/2), usersdata)}
                </div>
            `)
        }
    }
    if (position === "left")
        return result.reverse().join()
    return result.join();
}