class Browsing extends React.Component {
    
    /*
    TO IMPROVE >>> HAVE A WAY TO WAIT SOME ONE SEC BEFORE SUBSEQUENT FIRE!!
    */

    constructor(props) {
        super(props);

        this.state = {
            base_url: "/search/api/browse_films?",
            want_url: "",//"&want=none",
            netflix_url: "", //"&netflix=false",
            bechdel_url: "", //"&bechdel=false",
            time_min_url: "", //"&time_min=0",
            time_max_url: "", //"&time_max=999",
            time_order_url: "", //"&time_order=false", // let this also equal up or down!
            year_min_url: "", //"&year_min=1990",
            year_max_url: "", //"&year_max=2020",
            year_order_url: "", //"&year_order=false",
            imdb_min_url: "", //"&imdb_min=0",
            imdb_max_url: "", //"&imdb_max=10",
            imdb_order_url: "", //"&imdb_order_top=false", // let this also equal up or down!
            tag_only_url: "", //"&tag_only=none",
            tag_exclude_url: "", //"&tag_exclude=none",
            country_only_url: "", //"&country_only=none",
            country_exclude_url: "", //"&country_exclude=none",
            genre_only_url: "", //"&genre_only=none",
            genre_exclude_url: "", //"&genre_exclude=none",
            final_url: "",

            scene: 0,
            current_counter: 0,
            loading: false,
            first_load: false,
            scrolled_once:false,
            browse:true,
            time_to_select: 300,
            maybe_pile: [],
            want_to_select: ["cry","laugh","think","fling","idk"], // d
            want_selected: "",
            netflix: false,
            bechdel: false,
            time_min: 0,
            time_max: 14400,
            time_order: "none",
            imdb_min: 0,
            imdb_max: 10,
            imdb_order: "none",
            year_min: 1888,
            year_max: 2021,
            year_order: "none",
            tag_only: [], 
            tag_highlight: [],
            tag_options:["lgbt","based_on_books","royalty","sundance"],
            tag_exclude: [],
            country_only: [],
            country_highlight: [],
            country_options:["USA","Mexico","India","UK","Italy"],
            country_exclude: [],
            genre_only: [],
            genre_highlight: [],
            genre_options: ["Romance","Musicals","Family","Drama"],
            genre_exclude: [],
            // future trope exclude!! WOHOOOO
            output_films: [], // user searches

            // for specific search
            category: "film",
            search_value: "",
            searched_films: [], // user searches
            searched_collections: [],
            searched_friends: [],

        };

        this.handleChange = this.handleChange.bind(this);

        this.newCategFilm = this.newCategFilm.bind(this);
        this.newCategColl = this.newCategColl.bind(this);
        this.newCategFriend = this.newCategFriend.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);

    };

    

    componentDidMount(){
        // const tag_api = "http://127.0.0.1:8000/search/api/tag";
        const tag_api = "/search/api/tag_restricted";
        const country_api ="/search/api/country";
        const genre_api ="/search/api/genre";
        Promise.all([
            fetch(tag_api).then((response) => response.json()),
            fetch(country_api).then((response) => response.json()),
            fetch(genre_api).then((response) => response.json())
        ]).then(([tagData,countryData,genreData]) => 
                this.setState({
                    tag_options: tagData,
                    country_options: countryData,
                    genre_options: genreData,
                })
            );     
    };

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        this.setState({
            [name]: target.value
        },this.setParam(name,target.value));
      }


    render() {
        if (this.state.scene == 0){
            return this.renderWantIt()
        } else if (this.state.scene == 1){
            return this.renderBrowse()
        } else{
            return <div> {this.state.scene }</div>
        }
    }


    handleUpdate(url) {
        const sent_url = url;
        let counter = 0;
        const quantity = 30; // Load posts 22 at a time
        let max_height = 120;
        let start = 0;
        let end = 0; 

        function hasJustScrolled(element) {
            //if already clicked return TRUE to indicate this click is not allowed
            if (element.data("isScrolled")) return true;
        
            //mark as clicked for 1 second
            element.data("isScrolled", true);
            setTimeout(function () {
                element.removeData("isScrolled");
            }, 200);
        
            //return FALSE to indicate this click was allowed
            return false;
        };
        
        const fetchSearch = async () => {
            start = counter;
            end = start + quantity - 1;
            counter = end + 1;
            var paginated_url = sent_url.concat(`&start=${start}&end=${end}`);
            fetch(paginated_url)
                .then(response => response.json())
                .then(data => {
                    if (data["posts"] == "never_results"){
                        console.log("got no more films to load");
                    } else{ // here we are limiting no films, showing?
                    };
                    if (start == 0){
                        var output_films = [];
                    } else{
                        var output_films = this.state.output_films;
                    };
                    for (var i = 0; i < data.length; i++){
                        const movie_ID = data[i]["movie_ID"];
                        const image = new Image().src=data[i]["poster_pic"];
                        output_films.push([movie_ID,image]);
                        };
                    this.setState({
                            output_films: output_films,
                            final_url: sent_url,
                            loading:false,
                            current_counter: counter,
                        });
                });
        };
        fetchSearch();
        var react_obj = this;
        if (/Mobi|Android/i.test(navigator.userAgent)) {
            $(document).on("scroll",function(){ // counter max number of films to load!
            
                if ($(document).scrollTop() > max_height & counter < 1000 & (sent_url == react_obj.state.final_url) & (react_obj.state.loading == false) & (counter == react_obj.state.current_counter)){
                    if (hasJustScrolled($(this))) return;
                    max_height += 200;
                    fetchSearch()
                }});
        }
        else{
        $("#search_pile #searched_gall").on("scroll",function(){ // counter max number of films to load!
            
            if ($("#search_pile #searched_gall").scrollTop() > max_height & (counter < 1000) & (sent_url == react_obj.state.final_url) & (react_obj.state.loading == false) & (counter == react_obj.state.current_counter)){
                // the sent_ulr == react_obj... prevents old events from coming up again!
                if (hasJustScrolled($(this))) return;
                max_height += 200;
                fetchSearch()
            }});
        }   
    
      } 

      handleSearchChange(event,key="key") {
        var value = this.state.search_value;
        var search_category = this.state.category;

        let counter = 0;
        const quantity = 40; // Load posts 22 at a time
        let max_height = 100;

        var start = counter;
        var end = start + quantity - 1;
        counter = end + 1;

        if (key=="key"){
            value = event.target.value;
            this.setState({
                search_value: event.target.value
            });
        } else {
            search_category = key;
        };
        // var url = `http://127.0.0.1:8000/search/api/film_by_tag?&tt=${value}`
        var url = `/search/api/${search_category}_main?&query=${value}`;
        var searched_films = [];
        var searched_collections = [];
        var searched_friends = [];

        function hasJustScrolled(element) {
            //if already clicked return TRUE to indicate this click is not allowed
            if (element.data("isScrolled")) return true;
        
            //mark as clicked for 1 second
            element.data("isScrolled", true);
            setTimeout(function () {
                element.removeData("isScrolled");
            }, 100);
        
            //return FALSE to indicate this click was allowed
            return false;
        };

        const fetchSpecificSearch = async () => {
            var paginated_url = url.concat(`&start=${start}&end=${end}`);
            fetch(paginated_url)
                .then(response => response.json())
                .then(data => {
                    if (search_category == "film"){
                        if (start == 0){
                            searched_films = [];
                        };
                        for (var i = 0; i < data.length; i++){
                            const movie_ID = data[i]["movie_ID"];
                            const image = new Image().src=data[i]["poster_pic"];
                            searched_films.push([movie_ID,image]);
                            };
                        if (value==""){
                            this.setState({
                                searched_films: [],
                            });
                        }else{
                        this.setState({
                                searched_films: searched_films,
                            });
                        };
                    } else if (search_category == "collection"){
                        if (start == 0){
                            searched_collections = [];
                        } else {
                            searched_collections =this.state.searched_collections;
                        };
                        for (var i = 0; i < data.length; i++){
                            const id = data[i]["id"];
                            const name = data[i]["collection_name"];
                            const tag_list = data[i]["tags"];
                            const bya = data[i]["bya"];
                            const film_count = data[i]["film_property_count"];
                            searched_collections.push([id, name, tag_list, film_count, bya]);
                            };
                        if (value==""){
                                this.setState({
                                    searched_collections: [],
                                });
                            }else{
                                this.setState({
                                    searched_collections: searched_collections
                                });
                            }
                    } else if (search_category == "friend"){
                        if (start == 0){
                            searched_friends = [];
                        } else {
                            searched_friends = this.state.searched_friends;
                        };
                        for (var i = 0; i < data.length; i++){
                            const username = data[i]["username"];
                            const prof_pic = new Image().src=data[i]["prof_pic"];
                            const xp = data[i]["xp"];
                            searched_friends.push([username,prof_pic,xp]);
                            };
                        if (value==""){
                                this.setState({
                                    searched_friends: [],
                                });
                        }   else{
                            this.setState({
                                    searched_friends: searched_friends
                                });
                            }
                    }
                });
                var react_obj = this;
                $("#search_pile #specific_searched_gall").on("scroll",function(){ // counter max number of films to load!
                    
                    if ($("#search_pile #specific_searched_gall").scrollTop() > max_height & counter < 1000 & (value==react_obj.state.search_value)){
                        if (hasJustScrolled($(this))) return;
                        max_height += 100;
                        start = counter;
                        end = start + quantity - 1;
                        counter = end + 1;
                        fetchSpecificSearch()
                    }});
        };
        fetchSpecificSearch();
      }

      newCategFilm = (event) => {
        this.setState({
            category: "film",
        },
        this.handleSearchChange(event,"film"));
      } 

        newCategColl = (event) => {
            this.setState({
                category: "collection",
            },
            this.handleSearchChange(event,"collection"));
        } 

        newCategFriend = (event) => {
            this.setState({
                category: "friend",
            },
            this.handleSearchChange(event,"friend"));
        }
    
    renderWantIt(){
        const react_obj = this
        $(document).ready(function(){
            $("#fake_search_portal").hide();
            $(".set_want").one("click",function(e){
                var value = $(e.target).attr("name");
                react_obj.setWant(value);
                })
        });
        return(
            <div id="react_sent" className="ac fc cent">
                <div id="browse_body" className="ac fc cent">
                    {this.state.want_to_select.map((item) => {
                        return <div className="set_want_div">
                            {(item == "cry") && <div className="set_want" name={item} role="img">😭 Cry</div>}
                            {(item == "laugh") && <div className="set_want" name={item} role="img">😂 Laugh</div>}
                            {(item == "fling") && <div className="set_want" name={item} role="img">😏 Netflix + Chill</div>}
                            {(item == "think") && <div className="set_want" name={item} role="img">😲 Ponder</div>}
                            {(item == "idk") && <div className="set_want" name={item} role="img">😌 Show me everything</div>}
                        </div>
                    })}
                </div>
            </div>
        )
    }

    renderBrowse(){
        const react_obj = this;

        function isDoubleClicked(element) {
            //if already clicked return TRUE to indicate this click is not allowed
            if (element.data("isclicked")) return true;
        
            //mark as clicked for 1 second
            element.data("isclicked", true);
            setTimeout(function () {
                element.removeData("isclicked");
            }, 1000);
        
            //return FALSE to indicate this click was allowed
            return false;
        };
        
        $(document).ready(function(){
            if (/Mobi|Android/i.test(navigator.userAgent) & !react_obj.state.first_load) {
                var styling = "<style>";
                styling = styling.concat("#tt_mob.nav_down { top: -20px; } ");
                styling = styling.concat(" #tt_mob.nav_top { top: -140px; } ");
                styling = styling.concat(" .n_nav_down { top: 160px; } ");
                styling = styling.concat(" .n_nav_top { top: 40px; } ");
                styling = styling.concat(" .opened_filter { flex-direction: column; justify-content:space-evenly; align-items:center; height:120px; width:100%} ");
                styling = styling.concat(" #mood_filter.opened_filter { flex-direction: row; flex-wrap:wrap; justify-content: center; align-items:center; height:120px; width:100%} ");
                styling = styling.concat(" #mood_filter .set_want_div { width: 30% } ");
                styling = styling.concat(" #search_portal { height: fit-content; } ");
                styling = styling.concat(" #browse_body { height: fit-content; } ");
                styling = styling.concat(" #react_sent { height: fit-content; } ");
                styling = styling.concat(" #search_pile { height: fit-content; } ");
                styling = styling.concat(" #searched_gall { height: fit-content; } ");
                styling = styling.concat(" #searched_gall { margin-top: 145px; } ");
                styling = styling.concat(" #specific_searched_gall { height: fit-content; } ");
                styling = styling.concat(" #specific_searched_gall { margin-top: 145px; } ");
                
                styling = styling.concat("</style>");
                $('html > head').append($(styling));
                
                $(".space").hide();
                $(".separator").hide();
                
                $("#tt_f_mob").hide();
                
                            /* It?S THIS ONE THAT DOESNT WORK!! */
    
                $("#tt_mob").append($("#browse_filters"));
    
                $("#tt_mob").append($("#browse_sidebar"));
                
                $("#notification").css({
                    "z-index":"500",
                });
                $("#netflix_bechdel_filter div.fr").css({
                    "width":"190px",
                });
    
                $("#tt_mob").css({
                    "padding":"0px",
                    "width":"90%",
                    "height":"180px",
                    "display":"flex",
                    "flex-direction":"column",
                    "justify-content":"space-between",
                });
                $("#tt_mob p").css({
                    "margin":"0px",
                    "font-family":"Helvetica",
                    "font-weight":"lighter",
                    "font-size":"14px",
                    "z-index":"100",
                });
                $(".toggle_filter span[role=img]").css({
                    "padding":"0px",
                })
                $("#browse_sidebar").css({
                    "justify-content":"initial",
                    "margin-left":"auto",
                    "margin-right":"auto",
                    "flex-direction":"row",
                    "width":"70%",
                    "height":"40px",
                    "overflow-x":"row",
                    "overflow-y":"hidden",
                });
    
                $("#browse_filters").css({
                    "height":"120px",
                    "margin-top":"23px",
                });
                $("#browse_filters label").css({
                    "margin-right":"auto",
                    "margin-left":"auto",
                    "width":"fit-content",
                });
                $("#browse_filters .box_label").css({
                    "width":"80%",
                });
            
                $(".closed_filter").css({
                    "flex-direction":"column",
                    "justify-content":"space-around",
                    "align-items":"center",
                    "height":"120px",
                    "width":"100%",
                })
                $("#time_filter input").on("change",function(e){
                    react_obj.handleChange(e)});
                $("#year_filter input").on("change",function(e){
                    react_obj.handleChange(e)});
                    
                $("#imdb_filter input").on("change",function(e){
                    react_obj.handleChange(e)});
                    
                $("#specific_filter input").on("change",function(e){
                    react_obj.handleSearchChange(e)});
                react_obj.setState({
                    first_load: true,
                });
                $("#category_select button").on("click",function(e){

                    if (e.currentTarget.value=="film"){
                        react_obj.newCategFilm(e);
                    } else if (e.currentTarget.value=="collection"){
                        react_obj.newCategColl(e);
                    } else if (e.currentTarget.value=="friend"){
                        react_obj.newCategFriend(e);
                    };
                });
    
    
            };
            if (!react_obj.state.first_scroll & !react_obj.state.loading){
                react_obj.setState({
                    first_scroll:true,
                },react_obj.setParam("want",react_obj.state.want_selected));
            };
            if (react_obj.state.loading==false){
            $(".toggle_net").one("click",function(e){
                react_obj.setParam("netflix",e.target.value);
                });
            $(".toggle_bech").one("click",function(e){
                react_obj.setParam("bechdel",e.target.value);
                });
            $(".time_order_change").one("click",function(e){
                react_obj.setParam("time_order",e.target.value);
                });
            $(".year_order_change").one("click",function(e){
                react_obj.setParam("year_order",e.target.value);
                });
            $(".imdb_order_change").one("click",function(e){
                react_obj.setParam("imdb_order",e.target.value);
                });

            $(".set_want_later").on("click",function(e){
                var value = $(e.target).attr("name");
                react_obj.setParam("want",value);
            });
        }
            else{
                console.log("currently loading");
            };

            $('#country_filter .multi_select').select2().on("change",function(){
                if (!react_obj.state.loading){
                    var country_only_list =  Array.from($(`#country_only .select2-selection__rendered li`), option => option.title);
                    var country_exclude_list =  Array.from($(`#country_exclude .select2-selection__rendered li`), option => option.title);
                    if ((country_only_list.length != react_obj.state.country_only.length) | (country_exclude_list.length != react_obj.state.country_exclude.length)){
                        react_obj.updateCountrySelect(country_only_list,country_exclude_list);
                    };
                };
            }); 

            $('#tag_filter .multi_select').select2().on("change",function(){
                if (!react_obj.state.loading){
                    var tag_only_list =  Array.from($(`#tag_only .select2-selection__rendered li`), option => option.title);
                    var tag_exclude_list =  Array.from($(`#tag_exclude .select2-selection__rendered li`), option => option.title);
                    if ((tag_only_list.length != react_obj.state.tag_only.length) | (tag_exclude_list.length != react_obj.state.tag_exclude.length)){
                        react_obj.updateTagSelect(tag_only_list,tag_exclude_list);
                    };
                };
            }); 

            $('#genre_filter .multi_select').select2().on("change",function(){
                if (!react_obj.state.loading){
                    var genre_only_list =  Array.from($(`#genre_only .select2-selection__rendered li`), option => option.title);
                    var genre_exclude_list =  Array.from($(`#genre_exclude .select2-selection__rendered li`), option => option.title);
                    if ((genre_only_list.length != react_obj.state.genre_only.length) | (genre_exclude_list.length != react_obj.state.genre_exclude.length)){
                        react_obj.updateGenreSelect(genre_only_list,genre_exclude_list);
                    };
                };
            }); 

            $('.toggle_filter').on("click",function(e){
                if (isDoubleClicked($(this))) return;
                if (/Mobi|Android/i.test(navigator.userAgent)) {
                    $("#tt_mob").addClass("nav_down").removeClass("nav_top");
                    $("#notification").addClass("n_nav_down").removeClass("n_nav_top");
                };
                var name = $(e.target).attr("name");
                $(".toggled_filter").addClass("toggle_filter").removeClass("toggled_filter");
                $(e.currentTarget).addClass("toggled_filter").removeClass("toggle_filter");
                $(".opened_filter").addClass("closed_filter").removeClass("opened_filter");
                
                $(`#${name}_filter`).removeClass("closed_filter").addClass("opened_filter");
                if (name == "specific" & react_obj.state.browse){
                    react_obj.setState({
                        browse: false
                    });
                } else if (!react_obj.state.browse){
                    react_obj.setState({
                        browse: true
                    });
                }
            });


        });

        if (this.state.category == "film"){

            var specific_buttons = 
                
                <div id="category_select" className="fr ac">
                    <button value="film" className="active_categ"> <span role="img" aria-label="film_camera"> movies </span> </button>
                    <button value="collection" onClick={this.newCategColl}> <span role="img" aria-label="bento_box"> collections </span> </button>
                    <button value="friend" onClick={this.newCategFriend}> <span role="img" aria-label="monkey_face"> members </span> </button>
                </div>

            var specific_search_pile = 

            <div id="specific_searched_gall" className="fr">
                {this.state.searched_films.map((item) => {
                    let movie_url = "/film/".concat(item[0])
                    return <div className="poster_cont">
                        <a href={movie_url}>
                            <img value={item[0]} src={item[1]} alt="Poster Picture"/>
                        </a>
                    </div>
                        })}
            </div>


        } else if (this.state.category == "collection"){

            var specific_buttons = 
                
                <div id="category_select" className="fr ac">
                    <button value="film" onClick={this.newCategFilm}> <span role="img" aria-label="film_camera"> movies </span> </button>
                    <button value="collection" className="active_categ"> <span role="img" aria-label="bento_box"> collections </span> </button>
                    <button value="friend" onClick={this.newCategFriend}> <span role="img" aria-label="monkey_face"> members </span> </button>
                </div>

            var specific_search_pile =
            

            <div id="specific_searched_gall" className="fr cent">
                {this.state.searched_collections.map((item) => {
                    let collection_url = "/collections/".concat(item[0]);
                    var tags = "";
                    item[2].map((single_tag) => {
                        var last_index = item[2].length - 1;
                        if (single_tag == item[2][last_index]){
                            tags = tags.concat(`#${single_tag}`);
                        } else{
                            tags = tags.concat(`#${single_tag}, `);
                        };
                    });
                    return <div className="collection_cont fc ac">
                            <a href={collection_url} className="fc">
                                <h5> {item[1].toUpperCase()} </h5>
                            </a>
                            
                            <small> by <a href={`/user/${item[4]}`}>{item[4]}</a></small> 
                            <p> # of films: {item[3]} </p>
                            <p> {tags} </p>
                    </div>
                })}
            </div>

        } else if (this.state.category == "friend"){

            var specific_buttons = 
                
                <div id="category_select" className="fr ac">
                    <button value="film" onClick={this.newCategFilm}> <span role="img" aria-label="film_camera">movies</span> </button>
                    <button value="collection" onClick={this.newCategColl}> <span role="img" aria-label="bento_box">collections</span> </button>
                    <button value="friend" className="active_categ"> <span role="img" aria-label="monkey_face">members</span> </button>
                </div>

            var specific_search_pile = 
            
            <div id="specific_searched_gall" className="fr">
                    {this.state.searched_friends.map((item) => {
                        let friend_url = "/user/".concat(item[0])
                        let alt_text = "Profile picture for ".concat(item[0])
                        return <div className="profile_cont fc ac">
                            <a href={friend_url}>
                                <span className="prof_pic_container">
                                    <img src={item[1]} alt={alt_text}/>
                                </span>
                                <p><b>{item[0]}</b></p>
                                <p>{item[2]} XP</p>
                            </a>
                        </div>
                            })}
            </div>
        };

        return( 
            <div id="react_sent" className="ac fc cent">
                <div id="browse_body" className="fr cent">
                    
                    <div id="browse_sidebar" className="fc">
                                { (this.state.want_selected.length > 0 & this.state.browse) ?
                                    <div className="toggle_filter fr has_filter">
                                        <div className="g">
                                            <span name="mood" role="img" aria-label="mood" className="gg">🐲</span>
                                        </div>
                                    </div>
                                : 
                                    <div className="toggle_filter fr">
                                        <div className="g">
                                            <span name="mood" role="img" aria-label="mood" className="gg">🐲</span>
                                        </div>
                                    </div>
                                }
                                
                                { ((this.state.netflix | this.state.bechdel)& this.state.browse) ?
                                    <div className="toggle_filter fr has_filter">
                                        <div className="g">
                                            <span name="netflix_bechdel" role="img" aria-label="netflix_bechdel" className="gg">🍌</span>
                                        </div>
                                    </div>
                                :   <div className="toggle_filter fr">
                                        <div className="g">
                                            <span name="netflix_bechdel" role="img" aria-label="netflix_bechdel" className="gg">🍌</span>
                                        </div>
                                    </div>
                                }

                                { ((this.state.country_only.length > 0 | this.state.country_exclude.length > 0)& this.state.browse) ?
                                    <div className="toggle_filter fr has_filter">
                                        <div className="g">
                                            <span name="country" role="img" aria-label="country_Select" className="gg">🇺🇳</span>
                                        </div>
                                    </div>
                                :   <div className="toggle_filter fr">
                                        <div className="g">
                                            <span name="country" role="img" aria-label="country_Select" className="gg">🇺🇳</span>
                                        </div>
                                    </div>
                                }

                                { ((this.state.tag_only.length > 0 | this.state.tag_exclude.length > 0) & this.state.browse) ?
                                    <div className="toggle_filter fr has_filter">
                                        <div className="g">
                                            <span name="tag" role="img" aria-label="tag_select" className="gg">🏂</span>
                                        </div>
                                    </div>
                                : <div className="toggle_filter fr">
                                    <div className="g">
                                        <span name="tag" role="img" aria-label="tag_select" className="gg">🏂</span>
                                    </div>
                                </div>
                                }

                                { ((this.state.imdb_min != 0 | this.state.imdb_max != 10 | this.state.imdb_order != "none") & this.state.browse) ?
                                    <div className="toggle_filter has_filter fr">
                                        <div className="g">
                                            <span name="imdb" role="img" aria-label="imdb_score" className="gg">🌟</span>
                                        </div>
                                    </div>
                                :   <div className="toggle_filter fr">
                                        <div className="g">
                                            <span name="imdb" role="img" aria-label="imdb_score" className="gg">🌟</span>
                                        </div>
                                    </div>
                                }

                                { ((this.state.year_min != 1888 | this.state.year_max != 2021 | this.state.year_order != "none") & this.state.browse) ?
                                    <div className="toggle_filter has_filter fr">
                                        <div className="g">
                                            <span name="year" role="img" aria-label="year_released" className="gg">📅</span>
                                        </div>
                                    </div>
                                :   <div className="toggle_filter fr">
                                        <div className="g">
                                            <span name="year" role="img" aria-label="year_released" className="gg">📅</span>
                                        </div>
                                    </div>
                                }

                                { ((this.state.time_min != 0 | this.state.time_max != 14400 | this.state.time_order != "none") & this.state.browse) ?
                                    <div className="toggle_filter has_filter fr">
                                        <div className="g">
                                            <span name="time" role="img" aria-label="running_time" className="gg">⏲️</span>
                                        </div>
                                    </div>
                                :   <div className="toggle_filter fr">
                                        <div className="g">
                                            <span name="time" role="img" aria-label="running_time" className="gg">⏲️</span>
                                        </div>
                                    </div>
                                }

                                { ((this.state.genre_only.length > 0 | this.state.genre_exclude.length > 0) & this.state.browse) ?
                                    <div className="toggle_filter fr has_filter">
                                        <div className="g">
                                            <span name="genre" role="img" aria-label="genre_select" className="gg">👾</span>
                                        </div>
                                    </div> 
                                :   <div className="toggle_filter fr">
                                        <div className="g">
                                            <span name="genre" role="img" aria-label="genre_select" className="gg">👾</span>
                                        </div>
                                    </div> 
                                }

                                    <div className="toggle_filter fr">
                                        <div className="g">
                                            <span name="specific" role="img" aria-label="magnifying_glass" className="gg">🔍</span>
                                        </div>
                                    </div>
                                
                                
                        </div> {/* end browse_side_bar */}
                    
                    
                    <div class="separator"></div>
                    

                    <div id="browse_main_stage" className="fc cent ac">
                    <div id="browse_filters" className="fr ac cent">
                        <div id="browse_instructions" className="opened_filter">
                            <h4> Select from the emojis to narrow your search! </h4>
                        </div>

                        <div id="mood_filter" className="closed_filter">
                            {this.state.want_to_select.map((item) => {
                                if (item == this.state.want_selected){
                                    var set_class = "set_want_div want_toggled ac";
                                } else{
                                    var set_class = "set_want_div ac";
                                }
                                return <div className={set_class}>
                                    {(item == "cry") && <div className="set_want_later" name={item} role="img">😭<small name={item}>cry </small></div>}
                                    {(item == "laugh") && <div className="set_want_later" name={item} role="img">😂<small name={item}>laugh</small></div>}
                                    {(item == "fling") && <div className="set_want_later" name={item} role="img">😏<small name={item}>'n chill</small></div>}
                                    {(item == "think") && <div className="set_want_later" name={item} role="img">😲<small name={item}>ponder</small></div>}
                                    {(item == "idk") && <div className="set_want_later" name={item} role="img">😌<small name={item}>idk yet</small></div>}
                                </div>
                            })}
                        </div>

                        <div id="netflix_bechdel_filter" className="closed_filter">

                            <div className="fr">
                                {this.state.netflix ? <button className="toggled_on toggle_net" value="0">On Netflix</button> : <button className="toggled_off toggle_net" value="1"> On Netflix </button>}
                            </div>

                            <div className="fr">
                                {this.state.bechdel ? <button className="toggled_on toggle_bech" value="0">Passes Bechdel Test</button> : <button className="toggled_off toggle_bech" value="1">Passes Bechdel Test</button>}
                            </div>

                        </div>

                            <div id="time_filter" className="closed_filter fr ac">
                                <span className="fr ac">
                                    Running time:
                                    <input type="text" value={this.state.time_min} name="time_min" onChange={this.handleChange}></input>
                                    -
                                    <input type="text" value={this.state.time_max} name="time_max" onChange={this.handleChange}></input>
                                    minutes
                                </span>
                                <span className="fr ac">
                                    Order by:
                                    {this.state.time_order=="up" ? <button className="time_order_change" value="up">▲</button>
                                    : this.state.time_order=="down" ? <button className="time_order_change" value="down">▼</button>
                                    : <button className="time_order_change null" value="null"> - </button>}
                                </span>
                        </div>

                            <div id="year_filter" className="closed_filter">
                                <span className="fr ac">
                                    Year:
                                    <input type="text" value={this.state.year_min} name="year_min" onChange={this.handleChange}></input>
                                    -
                                    <input type="text" value={this.state.year_max} name="year_max" onChange={this.handleChange}></input>
                                    released
                                </span>
                                <span className="fr ac">
                                    Order by:
                                {this.state.year_order=="up" ? <button className="year_order_change" value="up">▲</button>
                                : this.state.year_order=="down" ? <button className="year_order_change" value="down">▼</button>
                                : <button className="year_order_change null" value="null"> - </button>}
                                </span>
                        </div>

                            <div id="imdb_filter" className="closed_filter">
                                <span className="fr ac">
                                    IMDB score:
                                    <input type="text" value={this.state.imdb_min} name="imdb_min" onChange={this.handleChange}></input>
                                    -
                                    <input type="text" value={this.state.imdb_max} name="time_max" onChange={this.handleChange}></input>
                                </span>
                                <span className="fr ac">
                                    Order by:
                                    {this.state.imdb_order=="up" ? <button className="imdb_order_change" value="up">▲</button>
                                    : this.state.imdb_order=="down" ? <button className="imdb_order_change" value="down">▼</button>
                                    : <button className="imdb_order_change null" value="null"> - </button>}
                                </span>
                        </div>
                            <div id="country_filter" className="closed_filter fr ac">

                                 <p className="box_label"> Country Selection: </p>                   

                                <label id="country_only" className="fr ac">
                                    <span role="img" aria-label="yes_included">✅</span>
                                    <select className="form-group multi_select" multiple={true} value={this.state.country_only}>
                                        {this.state.country_options.map((value, index) => {
                                            var name = this.state.country_options[index]["name"];
                                        return <option value={name}>{name}</option>
                                        })}
                                    </select>
                                </label>

                                <label id="country_exclude" className="fr ac">
                                <span role="img" aria-label="exclude">🚫</span>
                                    <select className="form-group multi_select" multiple={true} value={this.state.country_exclude}>
                                        {this.state.country_options.map((value, index) => {
                                            var name = this.state.country_options[index]["name"];
                                        return <option value={name}>{name}</option>
                                        })}
                                    </select>
                                </label>    
                            
                        </div>

                            <div id="tag_filter" className="closed_filter fr ac">

                            <p className="box_label"> Tag Selection: </p>  

                                <label id="tag_only" className="fr ac">
                                    <span role="img" aria-label="yes_included">✅</span>
                                    <select className="form-group multi_select" multiple={true} value={this.state.tag_only}>
                                        {this.state.tag_options.map((value, index) => {
                                            var name = this.state.tag_options[index]["name"];
                                        return <option value={name}>{name}</option>
                                        })}
                                    </select>
                                </label>

                                <label id="tag_exclude" className="fr ac">
                                    <span role="img" aria-label="exclude">🚫</span>
                                    <select className="form-group multi_select" multiple={true} value={this.state.tag_exclude}>
                                        {this.state.tag_options.map((value, index) => {
                                            var name = this.state.tag_options[index]["name"];
                                        return <option value={name}>{name}</option>
                                        })}
                                    </select>
                                </label>
                        
                        </div>

                        <div id="genre_filter" className="closed_filter fr ac">

                                <p className="box_label"> Genre Selection: </p>  

                                <label id="genre_only" className="fr ac">
                                    <span role="img" aria-label="yes_included">✅</span>
                                    <select className="form-group multi_select" multiple={true} value={this.state.genre_only}>
                                        {this.state.genre_options.map((value, index) => {
                                            var name = this.state.genre_options[index]["name"];
                                        return <option value={name}>{name}</option>
                                        })}
                                    </select>
                                </label>

                                <label id="genre_exclude" className="fr ac">
                                    <span role="img" aria-label="exclude">🚫</span>
                                    <select className="form-group multi_select" multiple={true} value={this.state.genre_exclude}>
                                        {this.state.genre_options.map((value, index) => {
                                            var name = this.state.genre_options[index]["name"];
                                        return <option value={name}>{name}</option>
                                        })}
                                    </select>
                                </label>

                        </div> {/* end genre_filter */}

                        <div id="specific_filter" className="closed_filter fr ac">
                            <span className="fr ac">
                                <span name="specific" role="img" aria-label="magnifying_glass" className="gg">🔍</span>
                                <input type="text" value={this.state.search_value} onChange={this.handleSearchChange}></input>
                            </span>
                            <span className="fr ac">
                                {specific_buttons}
                            </span>
                        </div>

                    </div> {/* end_browse_filters pile */}
                    
                             
                    <div id="search_pile" className="fc">
                            {this.state.browse ?
                            
                                <div id="searched_gall" className="fr">
                                    {this.state.output_films.map((item) => {
                                        let movie_class = "movie_search_".concat(item[0]);
                                        let movie_url = "/film/".concat(item[0]);
                                        return <div className="poster_cont">
                                            <a className={movie_class} href={movie_url}>
                                                <img value={item[0]} src={item[1]} alt="Poster Picture"/>
                                            </a>
                                        </div>
                                    })}
                                </div>

                            : specific_search_pile
                            }

                    </div> {/* end_search pile */}
                
                    </div>
                
                </div>
            </div>
        )
    }

    updateCountrySelect = (country_only_list,country_exclude_list) => { 
            this.setParam("country_select",{
                "country_only":country_only_list,
                "country_exclude":country_exclude_list
            });     
    }

    updateTagSelect = (tag_only_list,tag_exclude_list) => {
        this.setParam("tag_select",{
            "tag_only":tag_only_list,
            "tag_exclude":tag_exclude_list
        });  
    }

    updateGenreSelect = (genre_only_list,genre_exclude_list) => {
        this.setParam("genre_select",{
            "genre_only":genre_only_list,
            "genre_exclude":genre_exclude_list
        });
    }

    updateOnlySelect = () => {
        /*
        We grab the values from the three buckets, where list_name is our category (only versus exclude)
        */
        var country_only_list =  Array.from($(`#country_only .select2-selection__rendered li`), option => option.title);
        var tag_only_list =  Array.from($(`#tag_only .select2-selection__rendered li`), option => option.title);
        var genre_only_list = Array.from($(`#genre_only .select2-selection__rendered li`), option => option.title);

        this.setParam("only_select",{
            "country_only":country_only_list,
            "tag_only":tag_only_list,
            "genre_only":genre_only_list,
        });
        
    }

    updateExcludeSelect = () => {
        /*
        We grab the values from the three buckets, where list_name is our category (only versus exclude)
        */
        var country_exclude_list =  Array.from($(`#country_exclude .select2-selection__rendered li`), option => option.title);
        var tag_exclude_list =  Array.from($(`#tag_exclude .select2-selection__rendered li`), option => option.title);
        var genre_exclude_list = Array.from($(`#genre_exclude .select2-selection__rendered li`), option => option.title);

        this.setParam("exclude_select",{
            "country_exclude":country_exclude_list,
            "tag_exclude":tag_exclude_list,
            "genre_exclude":genre_exclude_list,
        });
        
    }



    setWant = (value) => {
        if (this.state.scene == 0){
        $("#introduce").hide();
        this.setState(state => ({
            want_selected: value,
            scene: 1,
            }),this.setParam("want",value)
            );
        };
    }

    setParam = (add_section, new_add) => {
        if (this.state.loading==false){
            if (add_section == "want"){
                var want_url = "&want=".concat(new_add);
                var url = this.state.base_url.concat(want_url).concat(this.state.netflix_url).concat(this.state.bechdel_url).concat(this.state.time_min_url).concat(this.state.time_max_url).concat(this.state.time_order_url).concat(this.state.year_min_url).concat(this.state.year_max_url).concat(this.state.year_order_url).concat(this.state.imdb_min_url).concat(this.state.imdb_max_url).concat(this.state.imdb_order_url).concat(this.state.tag_only_url).concat(this.state.tag_exclude_url).concat(this.state.country_only_url).concat(this.state.country_exclude_url).concat(this.state.genre_only_url).concat(this.state.genre_exclude_url);
                this.setState({
                    loading:true,
                    want_selected: new_add,
                    want_url: want_url
                },this.handleUpdate(url));
            } else if (add_section == "netflix"){
                if (new_add == "1"){
                    var netflix_url = "&netflix=true"
                    var netflix_state = true;
                } else {
                    var netflix_url = "&netflix=false"
                    var netflix_state = false;
                };
                var url = this.state.base_url.concat(this.state.want_url).concat(netflix_url).concat(this.state.bechdel_url).concat(this.state.time_min_url).concat(this.state.time_max_url).concat(this.state.time_order_url).concat(this.state.year_min_url).concat(this.state.year_max_url).concat(this.state.year_order_url).concat(this.state.imdb_min_url).concat(this.state.imdb_max_url).concat(this.state.imdb_order_url).concat(this.state.tag_only_url).concat(this.state.tag_exclude_url).concat(this.state.country_only_url).concat(this.state.country_exclude_url).concat(this.state.genre_only_url).concat(this.state.genre_exclude_url);
                this.setState({
                    loading:true,
                    netflix: netflix_state,
                    netflix_url: netflix_url
                },this.handleUpdate(url));
            } else if (add_section == "bechdel"){
                if (new_add == "1"){
                    var bechdel_url = "&bechdel=true";
                    var bechdel_state = true;
                } else {
                    var bechdel_url = "&bechdel=false";
                    var bechdel_state = false;
                };
                var url = this.state.base_url.concat(this.state.want_url).concat(this.state.netflix_url).concat(bechdel_url).concat(this.state.time_min_url).concat(this.state.time_max_url).concat(this.state.time_order_url).concat(this.state.year_min_url).concat(this.state.year_max_url).concat(this.state.year_order_url).concat(this.state.imdb_min_url).concat(this.state.imdb_max_url).concat(this.state.imdb_order_url).concat(this.state.tag_only_url).concat(this.state.tag_exclude_url).concat(this.state.country_only_url).concat(this.state.country_exclude_url).concat(this.state.genre_only_url).concat(this.state.genre_exclude_url);
                this.setState({
                    loading:true,
                    bechdel: bechdel_state,
                    bechdel_url: bechdel_url
                },this.handleUpdate(url));
            } else if (add_section == "time_order"){
                if (new_add == "null"){ // it was NULL, now we made it go UP!
                    var time_order_url = "&time_order=up";
                    var time_order_state = "up";
                } else if(new_add == "up"){
                    var time_order_url = "&time_order=down"
                    var time_order_state = "down";                }
                else { // here sensing new_add will be down, and if not and error at least not putting more effort on algorithm
                    var time_order_url = ""
                    var time_order_state = "none";
                }
                var url = this.state.base_url.concat(this.state.want_url).concat(this.state.netflix_url).concat(this.state.bechdel_url).concat(this.state.time_min_url).concat(this.state.time_max_url).concat(time_order_url).concat(this.state.year_min_url).concat(this.state.year_max_url).concat(this.state.year_order_url).concat(this.state.imdb_min_url).concat(this.state.imdb_max_url).concat(this.state.imdb_order_url).concat(this.state.tag_only_url).concat(this.state.tag_exclude_url).concat(this.state.country_only_url).concat(this.state.country_exclude_url).concat(this.state.genre_only_url).concat(this.state.genre_exclude_url);
                this.setState({
                    loading:true,
                    time_order: time_order_state,
                    time_order_url: time_order_url
                },this.handleUpdate(url));
            } else if (add_section == "year_order"){
                if (new_add == "null"){ // it was NULL, now we made it go UP!
                    var year_order_url = "&year_order=up";
                    var year_order_state = "up";
                } else if(new_add == "up"){
                    var year_order_url = "&year_order=down"
                    var year_order_state = "down";
                }
                else { // here sensing new_add will be down, and if not and error at least not putting more effort on algorithm
                    var year_order_url = ""
                    var year_order_state = "none";
                }
                var url = this.state.base_url.concat(this.state.want_url).concat(this.state.netflix_url).concat(this.state.bechdel_url).concat(this.state.time_min_url).concat(this.state.time_max_url).concat(this.state.time_order_url).concat(this.state.year_min_url).concat(this.state.year_max_url).concat(year_order_url).concat(this.state.imdb_min_url).concat(this.state.imdb_max_url).concat(this.state.imdb_order_url).concat(this.state.tag_only_url).concat(this.state.tag_exclude_url).concat(this.state.country_only_url).concat(this.state.country_exclude_url).concat(this.state.genre_only_url).concat(this.state.genre_exclude_url);
                this.setState({
                    loading:true,
                    year_order: year_order_state,
                    year_order_url: year_order_url
                },this.handleUpdate(url));
            } else if (add_section == "imdb_order"){
                if (new_add == "null"){ // it was NULL, now we made it go UP!
                    var imdb_order_url = "&imdb_order=up";
                    var imdb_order_state = "up";
                } else if(new_add == "up"){
                    var imdb_order_url = "&imdb_order=down"
                    var imdb_order_state = "down";
                }
                else { // here sensing new_add will be down, and if not and error at least not putting more effort on algorithm
                    var imdb_order_url = ""
                    var imdb_order_state = "none";
                }
                var url = this.state.base_url.concat(this.state.want_url).concat(this.state.netflix_url).concat(this.state.bechdel_url).concat(this.state.time_min_url).concat(this.state.time_max_url).concat(this.state.time_order_url).concat(this.state.year_min_url).concat(this.state.year_max_url).concat(this.state.year_order_url).concat(this.state.imdb_min_url).concat(this.state.imdb_max_url).concat(imdb_order_url).concat(this.state.tag_only_url).concat(this.state.tag_exclude_url).concat(this.state.country_only_url).concat(this.state.country_exclude_url).concat(this.state.genre_only_url).concat(this.state.genre_exclude_url);
                this.setState({
                    loading:true,
                    imdb_order: imdb_order_state,
                    imdb_order_url: imdb_order_url
                },this.handleUpdate(url));
            
            } else if (add_section == "time_min"){
                    var time_min_url = "&time_min=".concat(new_add);
                    var url = this.state.base_url.concat(this.state.want_url).concat(this.state.netflix_url).concat(this.state.bechdel_url).concat(time_min_url).concat(this.state.time_max_url).concat(this.state.time_order_url).concat(this.state.year_min_url).concat(this.state.year_max_url).concat(this.state.year_order_url).concat(this.state.imdb_min_url).concat(this.state.imdb_max_url).concat(this.state.imdb_order_url).concat(this.state.tag_only_url).concat(this.state.tag_exclude_url).concat(this.state.country_only_url).concat(this.state.country_exclude_url).concat(this.state.genre_only_url).concat(this.state.genre_exclude_url);
                this.setState({
                    loading:true,
                    time_min_url:time_min_url,
                },this.handleUpdate(url));
            
            } else if (add_section == "time_max"){
                var time_max_url = "&time_max=".concat(new_add);
                var url = this.state.base_url.concat(this.state.want_url).concat(this.state.netflix_url).concat(this.state.bechdel_url).concat(this.state.time_min_url).concat(time_max_url).concat(this.state.time_order_url).concat(this.state.year_min_url).concat(this.state.year_max_url).concat(this.state.year_order_url).concat(this.state.imdb_min_url).concat(this.state.imdb_max_url).concat(this.state.imdb_order_url).concat(this.state.tag_only_url).concat(this.state.tag_exclude_url).concat(this.state.country_only_url).concat(this.state.country_exclude_url).concat(this.state.genre_only_url).concat(this.state.genre_exclude_url);
            this.setState({
                loading:true,
                time_max_url:time_max_url,
            },this.handleUpdate(url));
        
            } else if (add_section == "year_min"){
                var year_min_url = "&year_min=".concat(new_add);
                var url = this.state.base_url.concat(this.state.want_url).concat(this.state.netflix_url).concat(this.state.bechdel_url).concat(this.state.time_min_url).concat(this.state.time_max_url).concat(this.state.time_order_url).concat(year_min_url).concat(this.state.year_max_url).concat(this.state.year_order_url).concat(this.state.imdb_min_url).concat(this.state.imdb_max_url).concat(this.state.imdb_order_url).concat(this.state.tag_only_url).concat(this.state.tag_exclude_url).concat(this.state.country_only_url).concat(this.state.country_exclude_url).concat(this.state.genre_only_url).concat(this.state.genre_exclude_url);
            this.setState({
                loading:true,
                year_min_url:year_min_url,
            },
                this.handleUpdate(url));
            } else if (add_section == "year_max"){
                var year_max_url = "&year_max=".concat(new_add);
                var url = this.state.base_url.concat(this.state.want_url).concat(this.state.netflix_url).concat(this.state.bechdel_url).concat(this.state.time_min_url).concat(this.state.time_max_url).concat(this.state.time_order_url).concat(this.state.year_min_url).concat(year_max_url).concat(this.state.year_order_url).concat(this.state.imdb_min_url).concat(this.state.imdb_max_url).concat(this.state.imdb_order_url).concat(this.state.tag_only_url).concat(this.state.tag_exclude_url).concat(this.state.country_only_url).concat(this.state.country_exclude_url).concat(this.state.genre_only_url).concat(this.state.genre_exclude_url);
            this.setState({
                loading:true,
                year_max_url:year_max_url,
            },
                this.handleUpdate(url));
            } else if (add_section == "imdb_min"){
                var imdb_min_url = "&imdb_min=".concat(new_add);
                var url = this.state.base_url.concat(this.state.want_url).concat(this.state.netflix_url).concat(this.state.bechdel_url).concat(this.state.time_min_url).concat(this.state.time_max_url).concat(this.state.time_order_url).concat(this.state.year_min_url).concat(this.state.year_max_url).concat(this.state.year_order_url).concat(imdb_min_url).concat(this.state.imdb_max_url).concat(this.state.imdb_order_url).concat(this.state.tag_only_url).concat(this.state.tag_exclude_url).concat(this.state.country_only_url).concat(this.state.country_exclude_url).concat(this.state.genre_only_url).concat(this.state.genre_exclude_url);
            this.setState({
                loading:true,
                imdb_min_url:imdb_min_url,
            },
                this.handleUpdate(url));
            }   else if (add_section == "imdb_max"){
                var imdb_max_url = "&imdb_max=".concat(new_add);
                var url = this.state.base_url.concat(this.state.want_url).concat(this.state.netflix_url).concat(this.state.bechdel_url).concat(this.state.time_min_url).concat(this.state.time_max_url).concat(this.state.time_order_url).concat(this.state.year_min_url).concat(this.state.year_max_url).concat(this.state.year_order_url).concat(this.state.imdb_min_url).concat(imdb_max_url).concat(this.state.imdb_order_url).concat(this.state.tag_only_url).concat(this.state.tag_exclude_url).concat(this.state.country_only_url).concat(this.state.country_exclude_url).concat(this.state.genre_only_url).concat(this.state.genre_exclude_url);
            this.setState({
                loading:true,
                imdb_max_url:imdb_max_url,
            },
                this.handleUpdate(url));
            } else if (add_section == "country_select"){
                /*
                Rewrite once you figure out how to rename the variables independently
                */
                var country_only_url = "&country_only=";
                var country_exclude_url = "&country_exclude=";

                var country_only_list = new_add["country_only"];
                var country_exclude_list = new_add["country_exclude"];

                for (var i=0; i < country_only_list.length; i++){
                    if (i == 0){
                        country_only_url = country_only_url.concat("",country_only_list[i])
                    }else{
                        country_only_url = country_only_url.concat(",",country_only_list[i])
                }};

                for (var i=0; i < country_exclude_list.length; i++){
                    if (i == 0){
                        country_exclude_url = country_exclude_url.concat("",country_exclude_list[i])
                    }else{
                        country_exclude_url = country_exclude_url.concat(",",country_exclude_list[i])
                }};

                var url = this.state.base_url.concat(this.state.want_url).concat(this.state.netflix_url).concat(this.state.bechdel_url).concat(this.state.time_min_url).concat(this.state.time_max_url).concat(this.state.time_order_url).concat(this.state.year_min_url).concat(this.state.year_max_url).concat(this.state.year_order_url).concat(this.state.imdb_min_url).concat(this.state.imdb_max_url).concat(this.state.imdb_order_url).concat(this.state.tag_only_url).concat(this.state.tag_exclude_url).concat(country_only_url).concat(country_exclude_url).concat(this.state.genre_only_url).concat(this.state.genre_exclude_url);
                
                this.setState({
                    loading:true,
                    country_only_url: country_only_url,
                    country_exclude_url: country_exclude_url,
                    country_only: country_only_list,
                    country_exclude: country_exclude_list,

                },this.handleUpdate(url));

            } else if (add_section == "tag_select"){
                /*
                Rewrite once you figure out how to rename the variables independently
                */
                var tag_only_url = "&tag_only=";
                var tag_exclude_url = "&tag_exclude=";

                var tag_only_list = new_add["tag_only"];
                var tag_exclude_list = new_add["tag_exclude"];

                for (var i=0; i < tag_only_list.length; i++){
                    if (i == 0){
                        tag_only_url = tag_only_url.concat("",tag_only_list[i])
                    }else{
                        tag_only_url = tag_only_url.concat(",",tag_only_list[i])
                }};

                for (var i=0; i < tag_exclude_list.length; i++){
                    if (i == 0){
                        tag_exclude_url = tag_exclude_url.concat("",tag_exclude_list[i])
                    }else{
                        tag_exclude_url = tag_exclude_url.concat(",",tag_exclude_list[i])
                }};

                var url = this.state.base_url.concat(this.state.want_url).concat(this.state.netflix_url).concat(this.state.bechdel_url).concat(this.state.time_min_url).concat(this.state.time_max_url).concat(this.state.time_order_url).concat(this.state.year_min_url).concat(this.state.year_max_url).concat(this.state.year_order_url).concat(this.state.imdb_min_url).concat(this.state.imdb_max_url).concat(this.state.imdb_order_url).concat(tag_only_url).concat(tag_exclude_url).concat(this.state.country_only_url).concat(this.state.country_exclude_url).concat(this.state.genre_only_url).concat(this.state.genre_exclude_url);
                
                this.setState({
                    loading:true,
                    tag_only_url: tag_only_url,
                    tag_exclude_url: tag_exclude_url,
                    
                    tag_only: tag_only_list,
                    tag_exclude: tag_exclude_list,

                },this.handleUpdate(url));
            }else if (add_section == "genre_select"){
                /*
                Rewrite once you figure out how to rename the variables independently
                */
                var genre_only_url = "&genre_only=";
                var genre_exclude_url = "&genre_exclude=";

                var genre_only_list = new_add["genre_only"];
                var genre_exclude_list = new_add["genre_exclude"];

                for (var i=0; i < genre_only_list.length; i++){
                    if (i == 0){
                        genre_only_url = genre_only_url.concat("",genre_only_list[i])
                    }else{
                        genre_only_url = genre_only_url.concat(",",genre_only_list[i])
                }};

                for (var i=0; i < genre_exclude_list.length; i++){
                    if (i == 0){
                        genre_exclude_url = genre_exclude_url.concat("",genre_exclude_list[i])
                    }else{
                        genre_exclude_url = genre_exclude_url.concat(",",genre_exclude_list[i])
                }};

                var url = this.state.base_url.concat(this.state.want_url).concat(this.state.netflix_url).concat(this.state.bechdel_url).concat(this.state.time_min_url).concat(this.state.time_max_url).concat(this.state.time_order_url).concat(this.state.year_min_url).concat(this.state.year_max_url).concat(this.state.year_order_url).concat(this.state.imdb_min_url).concat(this.state.imdb_max_url).concat(this.state.imdb_order_url).concat(this.state.tag_only_url).concat(this.state.tag_exclude_url).concat(this.state.country_only_url).concat(this.state.country_exclude_url).concat(genre_only_url).concat(genre_exclude_url);
                
                this.setState({
                    loading:true,
                    genre_only_url: genre_only_url,
                    genre_exclude_url: genre_exclude_url,
                    
                    genre_only: genre_only_list,
                    genre_exclude: genre_exclude_list,

                },this.handleUpdate(url));
            } else if (add_section == "only_select"){
                /*
                Rewrite once you figure out how to rename the variables independently
                */
                var country_only_url = "&country_only=";
                var tag_only_url = "&tag_only=";
                var genre_only_url = "&genre_only=";

                var country_only_list = new_add["country_only"];
                var tag_only_list = new_add["tag_only"];
                var genre_only_list = new_add["genre_only"];

                for (var i=0; i < country_only_list.length; i++){
                    if (i == 0){
                        country_only_url = country_only_url.concat("",country_only_list[i])
                    }else{
                        country_only_url = country_only_url.concat(",",country_only_list[i])
                }};

                for (var i=0; i < tag_only_list.length; i++){
                    if (i == 0){
                        tag_only_url = tag_only_url.concat("",tag_only_list[i])
                    }else{
                        tag_only_url = tag_only_url.concat(",",tag_only_list[i])
                }};
                
                for (var i=0; i < genre_only_list.length; i++){
                    if (i == 0){
                        genre_only_url = genre_only_url.concat("",genre_only_list[i])
                    }else{
                        genre_only_url = genre_only_url.concat(",",genre_only_list[i])
                }};

                var url = this.state.base_url.concat(this.state.want_url).concat(this.state.netflix_url).concat(this.state.bechdel_url).concat(this.state.time_min_url).concat(this.state.time_max_url).concat(this.state.time_order_url).concat(this.state.year_min_url).concat(this.state.year_max_url).concat(this.state.year_order_url).concat(this.state.imdb_min_url).concat(this.state.imdb_max_url).concat(this.state.imdb_order_url).concat(tag_only_url).concat(this.state.tag_exclude_url).concat(country_only_url).concat(this.state.country_exclude_url).concat(genre_only_url).concat(this.state.genre_exclude_url);
                
                this.setState({
                    loading:true,
                    country_only_url: country_only_url,
                    tag_only_url: tag_only_url,
                    genre_only_url: genre_only_url,
                    
                    country_only: country_only_list,
                    tag_only: tag_only_list,
                    genre_only:genre_only_list,

                },this.handleUpdate(url));
            } else if (add_section == "exclude_select"){
                /*
                Rewrite once you figure out how to rename the variables independently
                */
                var country_exclude_url = "&country_exclude=";
                var tag_exclude_url = "&tag_exclude=";
                var genre_exclude_url = "&genre_exclude=";

                var country_exclude_list = new_add["country_exclude"];
                var tag_exclude_list = new_add["tag_exclude"];
                var genre_exclude_list = new_add["genre_exclude"];

                for (var i=0; i < country_exclude_list.length; i++){
                    if (i == 0){
                        country_exclude_url = country_exclude_url.concat("",country_exclude_list[i])
                    }else{
                        country_exclude_url = country_exclude_url.concat(",",country_exclude_list[i])
                }};

                for (var i=0; i < tag_exclude_list.length; i++){
                    if (i == 0){
                        tag_exclude_url = tag_exclude_url.concat("",tag_exclude_list[i])
                    }else{
                        tag_exclude_url = tag_exclude_url.concat(",",tag_exclude_list[i])
                }};
                
                for (var i=0; i < genre_exclude_list.length; i++){
                    if (i == 0){
                        genre_exclude_url = genre_exclude_url.concat("",genre_exclude_list[i])
                    }else{
                        genre_exclude_url = genre_exclude_url.concat(",",genre_exclude_list[i])
                }};

                var url = this.state.base_url.concat(this.state.want_url).concat(this.state.netflix_url).concat(this.state.bechdel_url).concat(this.state.time_min_url).concat(this.state.time_max_url).concat(this.state.time_order_url).concat(this.state.year_min_url).concat(this.state.year_max_url).concat(this.state.year_order_url).concat(this.state.imdb_min_url).concat(this.state.imdb_max_url).concat(this.state.imdb_order_url).concat(this.state.tag_only_url).concat(tag_exclude_url).concat(this.state.country_only_url).concat(country_exclude_url).concat(this.state.genre_only_url).concat(genre_exclude_url);
                
                this.setState({
                    loading:true,
                    country_exclude_url: country_exclude_url,
                    tag_exclude_url: tag_exclude_url,
                    genre_exclude_url: genre_exclude_url,
                    
                    country_exclude: country_only_list,
                    tag_exclude: tag_exclude_list,
                    genre_exclude :genre_exclude_list,

                },this.handleUpdate(url));
            } else if (add_section == "select"){
                const change = {
                    only:{
                        country:{
                            url: '',
                            list: '',
                        },
                        tag:{
                            url: '',
                            list: '',
                        },
                        genre:{
                            url: '',
                            list: '',
                        },
                    },
                    exclude:{
                        country:{
                            url: '',
                            list: '',
                        },
                        tag:{
                            url: '',
                            list: '',
                        },
                        genre:{
                            url: '',
                            list: '',
                        },
                    }
                };
                const only_exclude = new_add["type"];
                change[new_add["type"]].country.url = `&country_${new_add["type"]}=`;
                change[new_add["type"]].tag.url = `&tag_${new_add["type"]}=`;
                change[new_add["type"]].genre.url = `&genre_${new_add["type"]}=`;

                change[new_add["type"]].country.list = new_add["country_only"];
                change[new_add["type"]].tag.list = new_add["tag_only"];
                change[new_add["type"]].genre.list = new_add["genre_only"];

                const categories = ["country","tag","genre"];
                for (var i=0; i < categories.length; i++){
                    for (var x=0; x < change[new_add["type"]][categories[i]].list.length; x++){
                        if (x == 0){
                            change[new_add["type"]][categories[i]].url = change[new_add["type"]][categories[i]].url.concat("",change[new_add["type"]][categories[i]].list[x])
                        }else{
                            change[new_add["type"]][categories[i]].url = change[new_add["type"]][categories[i]].url.concat(",",change[new_add["type"]][categories[i]].list[x])
                    }};
                };

                if (new_add["type"] == "only"){
                    var url = this.state.base_url.concat(this.state.want_url).concat(this.state.netflix_url).concat(this.state.bechdel_url).concat(this.state.time_min_url).concat(this.state.time_max_url).concat(this.state.time_order_url).concat(this.state.year_min_url).concat(this.state.year_max_url).concat(this.state.year_order_url).concat(this.state.imdb_min_url).concat(this.state.imdb_max_url).concat(this.state.imdb_order_url).concat(change[new_add["type"]].tag.url).concat(this.state.tag_exclude_url).concat(change[new_add["type"]].country.url).concat(this.state.country_exclude_url).concat(change[new_add["type"]].genre.url).concat(this.state.genre_exclude_url);
                } else{
                    var url = this.state.base_url.concat(this.state.want_url).concat(this.state.netflix_url).concat(this.state.bechdel_url).concat(this.state.time_min_url).concat(this.state.time_max_url).concat(this.state.time_order_url).concat(this.state.year_min_url).concat(this.state.year_max_url).concat(this.state.year_order_url).concat(this.state.imdb_min_url).concat(this.state.imdb_max_url).concat(this.state.imdb_order_url).concat(this.state.tag.url).concat(change[new_add["type"]].tag.url).concat(this.state.country_only_url).concat(change[new_add["type"]].country.url).concat(this.state.genre_only_url).concat(change[new_add["type"]].genre.url);

                };
                
                this.setState({
                    loading:true,
                    country_only_url: country_only_url,
                    tag_only_url: tag_only_url,
                    genre_only_url: genre_only_url,
                    
                    country_only: country_only_list,
                    tag_only: tag_only_list,
                    genre_only:genre_only_list,

                },this.handleUpdate(url));
            }
            else {
                var url = this.state.base_url.concat(this.state.want_url).concat(this.state.netflix_url).concat(this.state.bechdel_url).concat(this.state.time_min_url).concat(this.state.time_max_url).concat(this.state.time_order_url).concat(this.state.year_min_url).concat(this.state.year_max_url).concat(this.state.year_order_url).concat(this.state.imdb_min_url).concat(this.state.imdb_max_url).concat(this.state.imdb_order_url).concat(this.state.tag_only_url).concat(this.state.tag_exclude_url).concat(this.state.country_only_url).concat(this.state.country_exclude_url).concat(this.state.genre_only_url).concat(this.state.genre_exclude_url);
                this.handleUpdate(url);
            };
    }}

}

ReactDOM.render(<Browsing />, document.querySelector("#browse_search"));
