
class Notif extends React.Component {
    

    constructor(props) {
        super(props);
        this.state = {
            scene: 0,
            alert: false,
            first_close: false,
            actions: [],
            //country: $("#user_country").text().trim(),
            //user: $("#user_username").text().trim()
        };
    }

    componentDidMount(){
        fetch(`/search/api/user_feed`)
            .then(response => response.json())
            .then(data => {
                data.forEach(action=>{
                    this.state.actions.push(action);
                    if (!this.state.alert & action["seen"] == 0){
                        $("#notification_open .fill").attr('data',"/static/icons/a_notification_btn.svg");
                        $("#notification_open .no_fill").attr('data',"/static/icons/a_notification_btn_m.svg");
                        
                        this.state.alert = true;
                    };
                    /* this.state.film_tt.push(film.title);
                    this.state.film_yy.push(film.year);
                    this.state.film_id.push(film.movie_ID);
                    this.state.film_img.push(new Image().src=film.poster);
                    */
                })})
    };

    add_seen(pk){ // here for the class starts with seen_to_
        $.ajaxSetup({ 
            cache:false,
            beforeSend: function(xhr, settings) {
                function getCookie(name) {
                    var cookieValue = null;
                    if (document.cookie && document.cookie != '') {
                        var cookies = document.cookie.split(';');
                        for (var i = 0; i < cookies.length; i++) {
                            var cookie = jQuery.trim(cookies[i]);
                            // Does this cookie string begin with the name we want?
                            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                                break;
                            }
                        }
                    }
                    return cookieValue;
                }
                if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                    // Only send the token to relative URLs i.e. locally.
                    xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                }
            } 
        });
        $.ajax( 
            { 
                url: "/users/notif_seen",
                type:"POST", 
                data: { 
                    do: "seen", //user 
                    action_id: pk, // to remove fc_cancel
                    }, 
            success: function() {
                console.log("Marked as seen");
            }
    })};

    render() {
        if (this.state.scene == 0){
            return this.renderOpen();
        }
        else if (this.state.scene == 1) {
            return this.renderFirstFeed();
        };
    }

    renderOpen(){
        var div; // div to use for a smoother close
        if (this.state.first_close){
            div = <div id="feed_retreat"></div>
        } else{
            div = <div></div>
        }
        $(".notification_tp").on("click",this.readyBTN);

    return (
        <div>
            {div}
            <button onClick={this.readyBTN} className="i_expand">
            </button>
        </div>
    )
    
    }
    
    renderFirstFeed(){

    function caps(string){
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    function rem_feed(button){
        let pk = button.target.value;
        let index = button.target.name;
        $.ajaxSetup({ 
            cache:false,
            beforeSend: function(xhr, settings) {
                function getCookie(name) {
                    var cookieValue = null;
                    if (document.cookie && document.cookie != '') {
                        var cookies = document.cookie.split(';');
                        for (var i = 0; i < cookies.length; i++) {
                            var cookie = jQuery.trim(cookies[i]);
                            // Does this cookie string begin with the name we want?
                            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                                break;
                            }
                        }
                    }
                    return cookieValue;
                }
                if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                    // Only send the token to relative URLs i.e. locally.
                    xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                }
            } 
        });
        $.ajax( 
            { 
                url: "/users/notif_seen",
                type:"POST", 
                data: { 
                    do: "delete", //user 
                    action_id: pk, // to remove fc_cancel
                    }, 
            success: function() {
                $(`#f_index_${index}`).css("animation","one_not_hide .4s linear 0s 1 normal forwards running");
                $(`#f_index_${index}`).bind('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function(){
                $(`#f_index_${index}`).hide();
                });
            }
            })
        };

    function add_friend_notif(button){
        let index = button.target.name;
        let friend_to_accept = button.target.value;
        $.ajaxSetup({ 
            cache:false,
            beforeSend: function(xhr, settings) {
                function getCookie(name) {
                    var cookieValue = null;
                    if (document.cookie && document.cookie != '') {
                        var cookies = document.cookie.split(';');
                        for (var i = 0; i < cookies.length; i++) {
                            var cookie = jQuery.trim(cookies[i]);
                            // Does this cookie string begin with the name we want?
                            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                                break;
                            }
                        }
                    }
                    return cookieValue;
                }
                if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                    // Only send the token to relative URLs i.e. locally.
                    xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                }
            } 
        });
        $.ajax( 
            { 
                url: "/users/change",
                type:"POST", 
                data: { 
                    target: friend_to_accept,
                    n_val: "fc_respond",
                    }, 
            success: function() {
                $(`#add_ff_${index}`).html("Friend Added");
            }
            })
    }
//$('[class^="seen_to_"]')

        $(".notification_tp").on("click",this.backBTN);

    return (
        <div id="feed_column" className="g">
            <div id="feed_expanded" className="gg">

                <div className="fc">
                    {this.state.actions.map((value, index) => {
                        var id_class = "seen_to_".concat(value["pk"]);
                        if (value["categ"]=="1") {
                            var user_url = "/user/" + value["by_user_id"][0]["user"]
                            if (value["rel_users"]=="you"){
                                var friend_target = "you"
                            } else{
                                var friend_url = "/user/" + value["rel_users"]
                                var friend_target = <a href={friend_url} className={id_class} onClick={this.add_seen.bind(this, value["pk"])}>{caps(value["rel_users"])} </a>
                            };
                            var film_url = "/film/"+ value["rel_films"][0]["movie_ID"]
                            var heading =
                                <div>
                                        <p> <a href={user_url} className={id_class} onClick={this.add_seen.bind(this, value["pk"])}>{caps(value["by_user_id"][0]["user"])} </a>
                                        recommended <a href={film_url} className={id_class} onClick={this.add_seen.bind(this, value["pk"])}> {value["rel_films"][0]["title"]} ({value["rel_films"][0]["year"]}) </a> 
                                        to {friend_target}
                                        </p>
                                        <p className="time_feed">
                                            {value["time"]}
                                        </p>
                                </div>;
                        } else if (value["categ"]=="2") {
                            var user_url = "/user/" + value["by_user_id"][0]["user"]
                            if (value["rel_users"] == "you"){
                                var target_friend = value["rel_users"]
                                var friend_url = "/users/me"
                            } else {
                                var target_friend = caps(value["rel_users"])
                                var friend_url = "/user/" + value["rel_users"]
                            };
                            var heading =
                                <div>
                                    <p> <a href={user_url} className={id_class} onClick={this.add_seen.bind(this, value["pk"])}>{caps(value["by_user_id"][0]["user"])} </a> 
                                    and <a href={friend_url} className={id_class} onClick={this.add_seen.bind(this, value["pk"])}>{target_friend} </a>
                                    are now friends 
                                    </p>
                                    <p className="time_feed">
                                        {value["time"]}
                                    </p>
                                </div>;
                        } else if (value["categ"]=="3") {
                            /*
                            to improve: when you accept the friend request, this should get eliminated from the list
                            a way to query is that if they are your friends, the number of choice (sent request) should no longer matter
                            */
                            var user_url = "/user/" + value["by_user_id"][0]["user"]
                            var heading = 
                                <div>
                                    <p> <a href={user_url} className={id_class} onClick={this.add_seen.bind(this, value["pk"])}> {caps(value["by_user_id"][0]["user"])} </a> 
                                    sent you a friend request   
                                    </p>
                                    <p id={"add_ff_"+index}>
                                     <button className="add_f" name={index} value={value["by_user_id"][0]["user"]} onClick={add_friend_notif}> ADD FRIEND </button>
                                     </p>
                                    <p className="time_feed">
                                        {value["time"]}
                                    </p>
                                </div>;
                        } else if (value["categ"]=="4") {
                            var film_url = "/film/"+ value["rel_films"][0]["movie_ID"]
                            var user_url = "/user/" + value["by_user_id"][0]["user"]
                            var heading =
                                <div>
                                    <p> <a href={user_url} className={id_class} onClick={this.add_seen.bind(this, value["pk"])}>{caps(value["by_user_id"][0]["user"])} </a> 
                                    watched <a href={film_url} className={id_class} onClick={this.add_seen.bind(this, value["pk"])}> {value["rel_films"][0]["title"]} ({value["rel_films"][0]["year"]}) </a>
                                    </p>
                                    <p className="time_feed">
                                        {value["time"]}
                                    </p>
                                </div>;
                        } else if (value["categ"]=="5") {
                            var film_url = "/film/"+ value["rel_films"][0]["movie_ID"]
                            var user_url = "/user/" + value["by_user_id"][0]["user"]
                            var heading =
                                <div>
                                    <p> <a href={user_url} className={id_class} onClick={this.add_seen.bind(this, value["pk"])}>{caps(value["by_user_id"][0]["user"])} </a>
                                    added <a href={film_url} className={id_class} onClick={this.add_seen.bind(this, value["pk"])}> {value["rel_films"][0]["title"]} ({value["rel_films"][0]["year"]}) </a>
                                    to their favorites
                                    </p>
                                    <p className="time_feed">
                                        {value["time"]}
                                    </p>
                                </div>;
                        } else if (value["categ"]=="6") {
                            var film_url = "/film/"+ value["rel_films"][0]["movie_ID"]
                            var user_url = "/user/" + value["by_user_id"][0]["user"]
                            var heading =
                                <div>  
                                    <p> <a className={id_class} href={user_url} onClick={this.add_seen.bind(this, value["pk"])}>{caps(value["by_user_id"][0]["user"])} </a>
                                    added <a href={film_url} className={id_class} onClick={this.add_seen.bind(this, value["pk"])}> {value["rel_films"][0]["title"]} ({value["rel_films"][0]["year"]}) </a>
                                    to their bucket list
                                    </p>
                                    <p className="time_feed">
                                        {value["time"]}
                                    </p>
                                </div>;
                        } else if (value["categ"]=="7") {
                            /*
                            TO CHANGE >> here, when see user collections, always just make the name clickable!
                            */
                            var user_url = "/user/" + value["by_user_id"][0]["user"] //be careful if ever change string method of users!
                            var collection_url = "/collections/" + value["rel_collection"][0]
                            var heading =
                                <div>
                                    <p> <a href={user_url} className={id_class} onClick={this.add_seen.bind(this, value["pk"])}>{caps(value["by_user_id"][0]["user"])} </a> 
                                    created a new collection. <a href={collection_url} className={id_class} onClick={this.add_seen.bind(this, value["pk"])}> See their collection. </a>
                                    </p>
                                    <p className="time_feed">
                                        {value["time"]}
                                    </p>
                                </div>;
                        } else if (value["categ"]=="8") {
                            var user_url = "/user/" + value["by_user_id"][0]["user"]
                            var heading =
                                <div>
                                    <p> <a href={user_url} className={id_class} onClick={this.add_seen.bind(this, value["pk"])}>{caps(value["by_user_id"][0]["user"])} </a> 
                                    upgraded their theatre
                                    </p>
                                    <p className="time_feed">
                                        {value["time"]}
                                    </p>
                                </div>;
                        } else if (value["categ"]=="9") {
                            var user_url = "/user/" + value["by_user_id"][0]["user"]
                            var heading =
                                <div>
                                    <p> <a href={user_url} className={id_class} onClick={this.add_seen.bind(this, value["pk"])}>{caps(value["by_user_id"][0]["user"])} </a> 
                                    upgraded their speakers
                                    </p>
                                    <p className="time_feed">
                                        {value["time"]}
                                    </p>
                                </div>;
                        } else if (value["categ"]=="10") {
                            var user_url = "/user/" + value["by_user_id"][0]["user"]
                            var heading =
                                <div>
                                    <p> <a href={user_url} className={id_class} onClick={this.add_seen.bind(this, value["pk"])}>{caps(value["by_user_id"][0]["user"])} </a> 
                                    upgraded their theatre seats
                                    </p>
                                    <p className="time_feed">
                                        {value["time"]}
                                    </p>
                                </div>;
                        } else if (value["categ"]=="11") {
                            var user_url = "/user/" + value["by_user_id"][0]["user"]
                            var heading =
                                <div>
                                    <p> <a href={user_url} className={id_class} onClick={this.add_seen.bind(this, value["pk"])}>{caps(value["by_user_id"][0]["user"])} </a>
                                    upgraded their projector
                                    </p>
                                    <p className="time_feed">
                                        {value["time"]}
                                    </p>
                                </div>;
                        } else if (value["categ"]=="12") {
                            var user_url = "/user/" + value["by_user_id"][0]["user"]
                            var heading =
                                <div>
                                    <p> <a href={user_url} className={id_class} onClick={this.add_seen.bind(this, value["pk"])}>{caps(value["by_user_id"][0]["user"])} </a> 
                                    upgraded their popcorn
                                    </p>
                                    <p className="time_feed">
                                        {value["time"]}
                                    </p>
                                </div>;
                        };
                        let id = "f_index_" + index;
                        var classes;
                        if (value["seen"]==1){
                            classes = "one_feed_txt feed_seen gg"
                        } else {
                            classes = "one_feed_txt feed_not_seen gg"
                        };
                        return <div className="one_feed g" id={id}>
                                <div className={classes}> {heading} </div>
                                <button className="remove_feed gg" name={index} value={value["pk"]} onClick={rem_feed}> X </button>
                            </div>
                        })}
                
                </div>
            </div>
            <div className="gg exit_feed">
                <button onClick={this.backBTN}>
                </button>
            </div>
        </div>

    );}

    readyBTN = () => {
        this.setState(({
            scene: 1,
        }))
    };
    backBTN = () => {
        this.setState(({
            first_close: true,
            scene: 0,
        }))
    };


}

/* $(function(){
    "#can we fetch the user by just loading their object into serializer?! ooo"
    fetch(`search/load/?&query=&start=0&end=10&country=${req.user.country.name}`)
    .then(response => response.json())
    .then(data => {
        films = data["posts"];
    });
});   */
ReactDOM.render(<Notif />, document.querySelector("#notification"));

$('#feed_expanded a').click(function() {});
$(".remove_feed").click(function() {});