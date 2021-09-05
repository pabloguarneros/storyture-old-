class Specifics extends React.Component {
    

    constructor(props) {
        super(props);

        this.state = {
            category: "film",
            search_value: "",
            searched_films: [], // user searches
            searched_collections: [],
            searched_friends: [],
        };

        this.newCategFilm = this.newCategFilm.bind(this);
        this.newCategColl = this.newCategColl.bind(this);
        this.newCategFriend = this.newCategFriend.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    };


    render() {
        if (this.state.category=="film"){
            return this.renderFilmSearch()
        } else if (this.state.category=="collection"){
            return this.renderCollectionSearch()
        } else if (this.state.category=="friend"){
            return this.renderFriendSearch()
        } else{
            return (<div>WHAT HAPPENED?!</div>)
        }
    }


    handleSearchChange(event,key="key") {
        var value = this.state.search_value;
        var search_category = this.state.category;
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
        const fetchSearch = async () => {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (search_category == "film"){
                        searched_films = [];
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
                                searched_films: searched_films
                            });
                        };
                    } else if (search_category == "collection"){
                        searched_collections = [];
                        for (var i = 0; i < data.length; i++){
                            const id = data[i]["id"];
                            const name = data[i]["collection_name"];
                            const tag_list = data[i]["tags"];
                            searched_collections.push([id, name, tag_list]);
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
                        searched_friends = [];
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
        };
        fetchSearch();
      } 

      renderFilmSearch(){

        $(document).ready(function(){
            $('#browse_BTN').on("click",function(){
                $("#browse_search").addClass("browse_expand");
                $("#specific_search").addClass("specific_shrink");
            });
        });

        return( 
            <div id="react_sent" className="fc cent">

                <div id="search_head" className="fc ac">
                    <div className="fr ac">
                        <h4> Search Directly </h4>
                        <span role="img" aria-label="octopus" id="browse_BTN"> or browse 🐙</span>
                    </div>
                    <input type="text" value={this.state.search_value} onChange={this.handleSearchChange}></input>
                    <p> Searching for: </p>
                    <div id="category_select" className="fr ac">
                        <button value="film" className="active_categ"> <span role="img" aria-label="film_camera"> 🎬 movies </span> </button>
                        <button value="collection" onClick={this.newCategColl}> <span role="img" aria-label="bento_box"> 🍱 collections </span> </button>
                        <button value="friend" onClick={this.newCategFriend}> <span role="img" aria-label="monkey_face"> 🐵 members </span> </button>
                    </div>
                </div>
                
                <div id="searched_gall" className="fr cent">
                    {this.state.searched_films.map((item) => {
                        let movie_url = "/film/".concat(item[0])
                        return <div className="poster_cont">
                            <a href={movie_url}>
                                <img value={item[0]} src={item[1]} alt="Poster Picture"/>
                            </a>
                        </div>
                            })}
                    </div>

            </div>
            

        )
    }

    renderCollectionSearch(){
        $(document).ready(function(){
            $('#browse_BTN').on("click",function(){
                $("#browse_search").addClass("browse_expand");
                $("#specific_search").addClass("specific_shrink");
            });
        });
        return( 
            <div id="react_sent" className="ac fc cent">

                <div id="search_head" className="fc ac">
                    
                    <div className="fr ac">
                        <h4> Search Directly </h4>
                        <span role="img" aria-label="octopus" id="browse_BTN"> or browse 🐙</span>
                    </div>
                    <input type="text" value={this.state.search_value} onChange={this.handleSearchChange}></input>
                    <p> Searching for: </p>
                    <div id="category_select" className="fr ac">
                        <button value="film" onClick={this.newCategFilm}> <span role="img" aria-label="film_camera"> 🎬 movies </span> </button>
                        <button value="collection" className="active_categ"> <span role="img" aria-label="bento_box"> 🍱 collections </span> </button>
                        <button value="friend" onClick={this.newCategFriend}> <span role="img" aria-label="monkey_face"> 🐵 members </span> </button>
                    </div>
                </div>
                
                <div id="searched_gall" className="fr">
                    {this.state.searched_collections.map((item) => {
                        let collection_url = "/collection/".concat(item[0])
                        return <div>
                            <a className="collection_cont" href={collection_url}>
                                <p><b> Name: {item[1]} </b></p>
                                <p><b> Tags: {item[2]} </b></p>
                            </a>
                        </div>
                            })}
                    </div>

            </div>
        )
    }

    renderFriendSearch(){
        $(document).ready(function(){
            $('#browse_BTN').on("click",function(){
                $("#browse_search").addClass("browse_expand");
                $("#specific_search").addClass("specific_shrink");
            });
        });
        return( 
            <div id="react_sent" className="ac fc cent">

                <div id="search_head" className="fc ac">
                    
                    <div className="fr ac">
                        <h4> Search Directly </h4>
                        <span role="img" aria-label="octopus" id="browse_BTN"> or browse 🐙</span>
                    </div>
                    <input type="text" value={this.state.search_value} onChange={this.handleSearchChange}></input>
                    <p> Searching for: </p>
                    <div id="category_select" className="fr ac">
                        <button value="film" onClick={this.newCategFilm}> <span role="img" aria-label="film_camera"> 🎬 movies </span> </button>
                        <button value="collection" onClick={this.newCategColl}> <span role="img" aria-label="bento_box"> 🍱 collections </span> </button>
                        <button value="friend" className="active_categ"> <span role="img" aria-label="monkey_face"> 🐵 members </span> </button>
                    </div>
                </div>
                
                <div id="searched_gall" className="fr">
                    {this.state.searched_friends.map((item) => {
                        let friend_url = "/user/".concat(item[0])
                        let alt_text = "Profile picture for ".concat(item[0])
                        return <div className="poster_cont">
                            <a href={friend_url}>
                                <img src={item[1]} alt={alt_text}/>
                                {item[0]} - {item[3]}
                            </a>
                        </div>
                            })}
                    </div>

            </div>
        )
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

   
}

/* $(function(){
    "#can we fetch the user by just loading their object into serializer?! ooo"
    fetch(`search/load/?&query=&start=0&end=10&country=${req.user.country.name}`)
    .then(response => response.json())
    .then(data => {
        films = data["posts"];
    });
});   */
ReactDOM.render(<Specifics />, document.querySelector("#specific_search"));
