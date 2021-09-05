const api = `/user/${window.location.href.substr(window.location.href.lastIndexOf('/') + 1)}/suggested_friends`;

const fetchSuggestedFriends = async () => {
    fetch(api)
        .then(response => response.json())
        .then(data => {
            for (var i = 0; i < data.length; i++){
                const username = data[i]["username"]
                const prof_pic = data[i]["prof_pic"]
                const xp = data[i]["xp"]
                const countries = data[i]["country"]
                var country_div = "" 
                for (c in countries){
                    const emoji_1 = countries[c]["emoji_1"];
                    const emoji_2 = countries[c]["emoji_2"];
                    country_div = country_div.concat(`<li> &nbsp &#${emoji_1}&#${emoji_2} </li>`)
                }
                $("#suggested_friend_column").append(`
                <div id="${username}_user" class="f_grid">
                <button class="add_friend friend fr ac cent gg" value="${username}">
                    <h4 class="cent"> Add Friend </h4>
                </button>
                <div class="friend fr ac cent gg">
                    <span class="prof_pic_c">
                        <img class="prof_pic" src="${prof_pic}" alt="User's Profile Picture"></img>
                    </span>
                    <div class="fc">
                        <small>
                        ${username.charAt(0).toUpperCase() + username.slice(1, Math.min(14,username.length))}
                        </small>
                        <div class="u_countries fr">
                            ${(country_div.length < 1) ?
                                "&nbsp &#127482&#127475" 
                            : country_div }
                        </div>
                    </div>
                    <span class="xp">
                        <small> XP: ${xp} </small>
                    </span>
                </div>
            </div>`)
        }
        manageAddFriend();
        manageFriends();
        if (data.length < 1){
            $("#friend_suggestions").css("display","none");
        }
    });
};

fetchSuggestedFriends();