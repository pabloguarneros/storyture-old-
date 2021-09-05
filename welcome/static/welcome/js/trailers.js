class Trailer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            num: 1,
            play: false,
            movie_ID: [],
            poster: [],
            title: [],
            trailer: [],
            country: [],
            synopsis: [],
            l_obj: $("#left_obj").attr("data-url"),
            r_obj: $("#right_obj").attr("data-url"),
            play_obj: $("#play_obj").attr("data-url")
        };
        
    }
    

    componentDidMount(){
        fetch("/search/trailers")
            .then(response => response.json())
            .then(data => {
                data["posts"].forEach(film=>{
                    this.state.movie_ID.push(film.movie_ID);
                    this.state.poster.push(new Image().src=film.poster);
                    this.state.title.push(film.title);
                    this.state.trailer.push(film.trailer);
                    var countries = []
                    for (var i = 0; i < film.country.length; i++){
                        if (film.country.length-i==1){
                            countries.push(`${film.country[i]}  `)
                        } else{
                            countries.push(`${film.country[i]},  `)
                        }
                    }
                    this.state.country.push(countries);
                    this.state.synopsis.push(film.synopsis);
                })
            });
    }

    render() {
        if (this.state.movie_ID == ""){
            return this.renderNoPlay();
        }
        else if (this.state.play==true){
            return this.renderTrailer();
        }
        else {
            return this.renderNext();
        };
    }

    renderNoPlay() {
        $(window).one("scroll",this.l_BTN);
        return (
            <div className="take_me fc ac">
                <button onClick={this.l_BTN}> 
                <span role="img" aria-label="film_camera"> 🎥 </span>
                Explore Trailers </button>
            </div>
        );
    }

    renderNext() {
        const index = (this.state.num % this.state.movie_ID.length);
        return (
            <div id="trailers_rev">
                <span className="tt cent">
                    <h3> Newest Trailers </h3>
                </span>
                <div className="one_trailer cent">
                    <span className="l_but cent g">
                        <button className="gg" onClick={this.l_BTN}> </button>
                        <object className="gg" type="image/svg+xml" data={this.state.l_obj}> </object>
                    </span>
                    <div className="tr_intro ac">
                        <div className="tr_poster cent">
                            <a className="gg" href={"film/"+this.state.movie_ID[index]}>
                            <img className="gg fr cent ac" src={this.state.poster[index]}></img>
                            </a>
                        </div>
                        <div onClick={this.t_BTN} className="tr_data fr cent">
                            <div className="tt_trailer fc">
                                <h3>{this.state.title[index]}</h3>
                                <span className="play_but g">
                                    <button className="gg" onClick={this.t_BTN}> </button>
                                    <object className="gg" type="image/svg+xml" data={this.state.play_obj}> </object>
                                </span>
                            </div>
                            <div className="tr_data_grain fc">
                                <p>{this.state.synopsis[index]} From: {this.state.country[index]} <span role="img" aria-label="countries"> 🌎 </span> </p>
                            </div>
                        </div>
                    </div>
                    <span className="r_but cent g">
                        <button className="gg" onClick={this.r_BTN}> </button>
                        <object className="gg" type="image/svg+xml" data={this.state.r_obj}> </object>
                    </span>
                </div>
            </div>
            );
    }

    renderTrailer(){
        var r_comp = this;
        var clicked = false; //if clicked, prevents it from closing down
        const index = (this.state.num % this.state.movie_ID.length);
        function isDoubleClicked(element) { // thanks to whoever put this on stacks!
            //if already clicked return TRUE to indicate this click is not allowed
            if (element.data("isclicked")) return true;
        
            //mark as clicked for 1 second
            element.data("isclicked", true);
            setTimeout(function () {
                element.removeData("isclicked");
            }, 1000);
        
            //return FALSE to indicate this click was allowed
            return false;
        }
        
        $(document).click(function(event) {  // hides the map
            var $target = $(event.target);
            if (isDoubleClicked($(this))) return;
            if(!$target.closest('.trailer_frame').length & clicked) {
                clicked = false;
                r_comp.setState(state => ({
                    play: false
                        }));
            } else{
                clicked = true;
            }       
          });
        return(
            <div>
                <span className="tt cent">
                    <h1> Newest Trailers </h1>
                </span>
                <div id="live_trailer" className="one_trailer cent">
                    <span className="l_but cent g">
                        <button className="gg" onClick={this.l_BTN}> </button>
                        <object className="gg" type="image/svg+xml" data={this.state.l_obj}> </object>
                    </span>
                    <div className="trailer_frame cent">
                        <iframe src={this.state.trailer[index]} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="true">
                        </iframe>
                    </div>
                    <div className="r_but cent g">
                        <button className="gg" onClick={this.r_BTN}> </button>
                        <object className="gg" type="image/svg+xml" data={this.state.r_obj}> </object>
                    </div>
                </div>
            </div>

        );
    }

    l_BTN = () => {
        if (this.state.num < 2){
            this.setState(state => ({
                play: false,
                num: state.movie_ID.length
            }))
        } else {
            this.setState(state => ({
                play: false,
                num: state.num - 1
            }))
        }
    }

    r_BTN = () => {
    this.setState(state => ({
        num: state.num + 1,
        play: false
            }))
    }

    t_BTN = () => {
        this.setState(({
            play: true
                }))
        }

}

ReactDOM.render(<Trailer />, document.querySelector("#trailer_r"));
