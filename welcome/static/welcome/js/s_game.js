class App extends React.Component {
    

    constructor(props) {
        super(props);

        this.state = {
            num: -1,
            xp: 0,
            0: "",
            1: "",
            2: "",
            3: "",
            4: "",
            5: "",
            6: "",
            7: "",
            8: "",
            9: "",
            film_tt: [],
            film_id: [],
            film_yy: [],
            film_img: [],
            film_sco: [],
            film_cc: [],
            game_type: "",
            yes_obj: $("#yes_obj").attr("data-url"),
            no_obj: $("#no_obj").attr("data-url"),
            idk_obj: $("#idk_obj").attr("data-url"),
            notseen_obj: $("#notseen_obj").attr("data-url"),
            play: true,
            //country: $("#user_country").text().trim(),
            //user: $("#user_username").text().trim()
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        fetch(`/search/game/?&country=${this.state.country}`)
            .then(response => response.json())
            .then(data => {
                if (data["posts"] == "nop"){
                    this.state.play = false;
                } else{
                data["posts"].forEach(film=>{
                    this.state.film_tt.push(film.title);
                    this.state.film_yy.push(film.year);
                    this.state.film_cc.push(film.country);
                    this.state.film_id.push(film.movie_ID);
                    this.state.film_img.push(new Image().src=film.poster);
                })}
            });
    }

    render() {
        if (this.state.play == false){
            return this.renderNoPlay();
        }
        else if (this.state.num == 10) {
            return this.renderWinnerScreen();
        } else if (this.state.num == -1) {
            return this.renderReadyToPlay();
        }
        else {
            return this.renderNext();
        };
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;

        this.setState({
            [name]: target.value
        });
      } 

    handleSubmit(event) {
        event.preventDefault();
        $.ajaxSetup({ 
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
            url: `/film/commento/${this.state.film_id[event.target.name]}`,
            type:"POST", 
            data:{ 
                comment: this.state[event.target.name]
                }, 
        
        success: function(index) {
            $(`#${index} p`).replaceWith("<p> Thanks for submitting :) </p> ");
            $(`#${index} button`).replaceWith("");
            $(`#${index} textarea`).css("opacity","0");

        }
    });
      }
    
    renderWinnerScreen(){
 
    return (
        <div class="end_game">
            <div id="winner" className="fc ac cent">
                <h4> You won 100 XP! </h4>
                <div>
                <button id="submit_scores" onClick={this.submitScores}> Complete Review! </button>
                </div>
            </div>
            <div id="rev_list" className="fr ac">
                {this.state.film_tt.map((value, index) => {
                    if (this.state.film_sco[index]=="0") {
                        var choice = <div className="not_auth"> <p> <i>Not Authentic</i></p>
                         </div>;
                      } else if (this.state.film_sco[index]=="1") {
                        var choice = <div className="yes_auth"> <p><i>Authentic</i></p>
                        </div>;
                      }
                        else if (this.state.film_sco[index]=="2") {
                        var choice = <div className="idk"> <p> <i>IDK </i></p>
                         </div>;
                      } else {
                        var choice = <div className="not_seen"> <p> <i>Haven't seen </i></p>
                        </div>
                      }
                    return <div className="film_revz ac fc" key={index}>
                            <img className="summary_img fr cent ac" src={this.state.film_img[index]}></img>
                            <p> <b> {value} </b> </p>
                            <div> {choice} </div>
                            <form id={this.state.film_id[index]} onSubmit={this.handleSubmit}>
                                <label>
                                <p> Any + thoughts? </p>
                                <textarea value={this.state[index]} name={index} onChange={this.handleChange} />
                                </label>
                                <button
                                    name={index}
                                    onClick={this.handleSubmit}
                                    type="submit"
                                    value="Submit"
                                    >
                                    Submit
                                </button>
                            </form>
                        </div>
            
                    })}
            </div>
            <div class="btm_space"> </div>
        </div>

    );}

    submitScores=() => {
        $.ajaxSetup({ 
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
            url: "/authentico/results",
            type:"POST", 
            data:{ 
                film_id: `${this.state.film_id}`,
                film_sco: `${this.state.film_sco}`,
                xp_upd: this.state.xp,
                game_type: this.state.game_type,
                }, 
        success: function() {
            window.location.href = "/";
            $("#submit_scores").remove();
            $("#winner").replaceWith("<div className='cent'> <h2 style='text-align:center'> submitted </h2> </div>");
            }
        })
    }

    renderReadyToPlay() {
        return (
            <div id="choose_ready" className="fr">

                <div id="choose_world" className="ready fc ac">
                    <div className="starter_img">
                        <object type="image/svg+xml" data="static/icons/authentico_world.svg"> </object>
                    </div>
                    <h2> Close to Home </h2>
                    <p className="explanation"> Do movies <b> misrepresent </b> your country? Are people from your nationality often <b> stereotyped </b>? Now is your chance. Which movies do a good job at showing your nuanced <b> reality? </b></p>
                    <button onClick={this.worldBTN}> Bring it on </button>
                </div>
                
                <div className="ready fc ac">
                    <div className="starter_img">
                        <object type="image/svg+xml" data="static/icons/authentico_bech.svg"> </object>
                    </div>
                    <h2> The Bechdel Test </h2>
                    <p className="explanation"> Does the movie show  <b> at least two women </b>? Are the women <b>talking to each other </b>? Do they discuss something <b> besides a man? </b> </p>
                    <button onClick={this.bechBTN}> Bring it on </button>
                </div>

                <div id="choose_basic" className="ready fc ac">
                    <div className="starter_img">
                        <object type="image/svg+xml" data="static/icons/film_roll.svg"> </object>
                    </div>
                    <h2> The Basics </h2>
                    <p className="explanation"> From <b> romantic flings </b> to <b> high school </b> stresses, from <b> glamourous streets </b> to office drinks, how close is the film to <b> your experience </b> living on this Earth? </p>
                    <button onClick={this.basicBTN}> Bring it on </button>
                </div>

                
            </div>
        );
    }

    renderNoPlay() {
        return (
            <div>
                <div id="no_play">There's no more films in your country for you to review.</div>
            </div>
        );
    }

    renderNext() {
        if (this.state.film_tt[this.state.num]==""){
            this.yesBTN("3");
        };
        if (this.state.game_type == "basic"){
            var question = `Is ${this.state.film_tt[this.state.num]} (${this.state.film_yy[this.state.num]})`
            var emphasis = "genuine?"
            var explanation = "genuine: providing an accurate portrayal of human emotions and/or relationships"
        } else if (this.state.game_type == "bech"){
            var question = `Does ${this.state.film_tt[this.state.num]} (${this.state.film_yy[this.state.num]}) pass the`
            var emphasis = "Bechdel Test?"
            var explanation = "to pass: 2 female characters speak about something other than a man"
        } else if (this.state.game_type == "world"){
            var question = `Does ${this.state.film_tt[this.state.num]} (${this.state.film_yy[this.state.num]}) portray ${this.state.film_cc[this.state.num]}`
            var emphasis = "accurately?"
            var explanation = "accurately: honest representation of your country and its citizens"
        };
        return (
            <div className="game_live fc ac">
                <div className="question">
                    <h2> {question} <b> {emphasis}</b> </h2>
                    <small> <i> {explanation} </i></small>
                    <br/>
                </div>
                <span id="main_s" className="fc ac">
                    <div className="poster_cont">
                        <img src={this.state.film_img[this.state.num]}></img>
                    </div>
                    <div className="quest_s fr">
                        <div className="fc">
                            <span id="yuppo" className="cent g">
                                <button id="yuppo_b" className="gg" value="1" onClick={e => this.yesBTN(e.target.value)}> </button>
                                <object className="gg cent" type="image/svg+xml" data={this.state.yes_obj}> </object>
                            </span>
                                <h4 className="cent"> Yup. </h4>
                        </div>
                        <div className="fc">
                            <span id="nops" className="cent g">
                                <button id="nops_b" className="gg" value="0" onClick={e => this.yesBTN(e.target.value)}> </button>
                                <object className="gg cent" type="image/svg+xml" data={this.state.no_obj}> </object>
                            </span>
                                <h4 className="cent"> Nop. </h4>
                        </div>
                        <div className="fc">
                            <span id="idk" className="cent g">
                                <button id="idk_b" className="gg" value="2" onClick={e => this.yesBTN(e.target.value)}> </button>
                                <object className="gg cent" type="image/svg+xml" data={this.state.idk_obj}> </object>
                            </span>
                                <h4 className="cent"> Seen, but idk </h4>
                        </div>
                        <div className="fc">
                            <span id="not_seen" className="cent g">
                                <button id="not_seen_b" className="gg" value="3" onClick={e => this.yesBTN(e.target.value)}> </button>
                                <object className="gg cent" type="image/svg+xml" data={this.state.notseen_obj}> </object>
                            </span>
                            <h4 className="cent"> Not seen. </h4>
                        </div>
                    </div>
                </span>
                <span className="points fc">
                    <div> Film: {this.state.num +1} /10 </div>
                    <div> XP Awarded: +{this.state.xp} </div>
                </span>
                <div class="btm_space"> </div>
            </div>
            );
    }

    basicBTN = () => {
        this.setState(state => ({
            game_type: "basic",
            num: state.num + 1,
        }))
}

    bechBTN = () => {
        this.setState(state => ({
            game_type: "bech",
            num: state.num + 1,
        }))
}

    worldBTN = () => {
        this.setState(state => ({
            game_type: "world",
            num: state.num + 1,
        }))
}

    readyBTN = () => {
    this.setState(state => ({
        num: state.num + 1,
    }))
}

yesBTN = (val) => {
    this.state.film_sco.push(val);
    this.setState(state => ({
        num: state.num + 1,
        xp: state.xp + 10,
                    }))
    }

}

/* $(function(){
    "#can we fetch the user by just loading their object into serializer?! ooo"
    fetch(`search/load/?&query=&start=0&end=10&country=${req.user.country.name}`)
    .then(response => response.json())
    .then(data => {
        films = data["posts"];
    });
});   */
ReactDOM.render(<App />, document.querySelector("#s_game"));