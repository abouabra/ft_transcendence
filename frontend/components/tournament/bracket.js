export function Tournament_leftBracket(matchs, users, avatar) {
        let result = ""

        for (let i=0; i < matchs.length; i++)
        {
            let first = users[matchs[i][0]]
            let second = users[matchs[i][1]]
            if (first == undefined)
                first = {"username": "empty", "avatar": avatar}
            if (second == undefined)
                second = {"username": "empty", "avatar": avatar}
                result += /*html*/`<div class="bracket_main_container">
                    <div class="bracket_container" data-id=${matchs[i][0]}>
                        <div class="data_bracket">
                            <img src="${first.avatar}" class="bracket_player_img">
                            <span class="bracket_username">${first.username}</span>
                        </div>
                        <div class="point_bracket d-flex justify-content-center align-items-center">
                            <span class="p1_regular number_points">5</span>
                        </div>
                    </div>
                    <div class="bracket_container" data-id="${matchs[i][1]}">
                        <div class="data_bracket">
                            <img src="${second.avatar}" class="bracket_player_img">
                            <span class="bracket_username">${second.username}</span>
                        </div>
                        <div class="point_bracket d-flex justify-content-center align-items-center">
                            <span class="p1_regular number_points">5</span>
                        </div>
                    </div>
                </div>`
        }
        return result;
}
export function Tournament_rightBracket(matchs, users, avatar) {
    let result = ""

    for (let i=0; i < matchs.length; i++)
    {
        let first = users[matchs[i][0]]
        let second = users[matchs[i][1]]
        if (first == undefined)
            first = {"username": "empty", "avatar": avatar}
        if (second == undefined)
            second = {"username": "empty", "avatar": avatar}

            result += /*html*/`<div class="bracket_main_container">
                <div class="bracket_container" data-id="${matchs[i][0]}">
                    <div class="point_bracket d-flex justify-content-center align-items-center">
                        <span class="p1_regular number_points">5</span>
                    </div>
                    <div class="data_bracket">
                        <img src="${first.avatar}" class="bracket_player_img">
                        <span class="bracket_username">${first.username}</span>
                    </div>
                </div>
                <div class="bracket_container" data-id="${matchs[i][1]}">
                    <div class="point_bracket d-flex justify-content-center align-items-center">
                        <span class="p1_regular number_points">5</span>
                    </div>
                    <div class="data_bracket">
                        <img src="${second.avatar}" class="bracket_player_img">
                        <span class="bracket_username">${second.username}</span>
                    </div>
                </div>
            </div>    
        `
    }
    return result;
}

export function display_tournaments(usersdata, data, position, avatar)
{
    let result = []
    const position_keys = ["round_of_16", "quarterfinals", "semifinals"]
    let keys = Object.keys(data)
    if (keys.length == 5)
    {
        data = {
            "round_of_16": data.round_of_16,
            "quarterfinals": data.quarterfinals,
            "semifinals": data.semifinals,
            "finals": data.finals
        }
    }
    else if (keys.length == 4)
    {
        data = {
            "quarterfinals": data.quarterfinals,
            "semifinals": data.semifinals,
            "finals": data.finals
        }
    }
    for (const key in data)
    {
        if (key === "current_round" || key === "finals")
            continue
        if (position === "left")
        {
            result.push(/*html*/`
                <div class="d-flex flex-column bracket_group bracket_${key}">
                    ${Tournament_leftBracket(data[key].slice(0,data[key].length/2), usersdata, avatar)}
                </div>
            `)
        }
        else
        {
            result.push(/*html*/`
                <div class="d-flex flex-column bracket_group bracket_${key}">
                    ${Tournament_rightBracket(data[key].slice(data[key].length/2), usersdata, avatar)}
                </div>
            `)
        }
    }
    if (position === "left")
        return result.join();
    return result.reverse().join()
}