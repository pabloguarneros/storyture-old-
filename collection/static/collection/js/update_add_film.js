class Collections extends React.Component {
    

    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            search_value: "",
            collection_ID: window.location.pathname.split('/')[2],
            searched_films: [], // user searches
            on_coll: [], // on collection --> this ones will be added toward the end
            deleted_pile:[],
        };

        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    };


    componentDidMount(){
        // const tag_api = "http://127.0.0.1:8000/search/api/tag";
        const api = `/search/api/collection_x_film?&colletion_pk=${this.state.collection_ID}`;
        const fetchFilm = async () => {
            fetch(api)
                .then(response => response.json())
                .then(data => {
                    var on_coll = [];
                    for (var i = 0; i < data.length; i++){
                        const movie_ID = data[i]["movie_ID"];
                        const image = new Image().src=data[i]["poster_pic"];
                        on_coll.push([movie_ID,image]);
                        };
                    this.setState({
                        on_coll: on_coll,
                        loaded:true
                        })
                });
        };
        fetchFilm();
        
    };

    render() {
      return this.renderAddFilms();
    }

    handleSearchChange(event){
        const value = event.target.value;
        this.setState({
            search_value: value},
        this.fetchFilms(value));
    }

    fetchFilms(value) {
        var url = `/search/api/film_by_tag?&tt=${value}`
        var searched_films = []
        const fetchSearch = async () => {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    searched_films = [];
                    for (var i = 0; i < data.length; i++){
                        const movie_ID = data[i]["movie_ID"];
                        const image = new Image().src=data[i]["poster_pic"];
                        searched_films.push([movie_ID,image]);
                        };
                    this.setState({
                            searched_films: searched_films
                        });
                });
        };
        fetchSearch();
      } 
    
    handleAdd = (event) => {{
          const movie_ID = event.target.getAttribute("value");
          const poster = event.target.getAttribute("src");
          var on_coll = this.state.on_coll;
          var if_contains = on_coll.every((element,index,array)=>{
                return array[index][0] != movie_ID;
                });
          if (if_contains){
            on_coll.push([movie_ID,poster]);
                this.setState({
                on_coll: on_coll,
                });
                $(`.movie_search_${movie_ID}`).css("display","none");

            }
    }}

    handleRem = (event) => {{
        const movie_ID = event.target.getAttribute("value");
        var array = this.state.on_coll;
        var deleted_pile = this.state.deleted_pile;
        var filtered = array.filter(function(value, index, array){ 
            if (value[0] != movie_ID){
                return value[0] != movie_ID;
            } else {
                deleted_pile.push(value);
            };
            });
        this.setState({
            deleted_pile: deleted_pile,
            on_coll: filtered,
            });
        $(`.movie_search_${movie_ID}`).css("filter","brightness(100%)");
    }}

    renderAddFilms(){
        const collection_ID = this.state.collection_ID
        function send_to_prof(){
            window.location.href=`/collections/${collection_ID}/update`
        }

        return( 
            <div id="react_sent" className="ac fc cent">
                <div id="update_head" className="fr">
                    <h3> Manage Your Films </h3>
                </div>
                
                <div id="adding_portals" className="fr">

                {this.state.on_coll.length > 0 && //if statement renders if the result can be mapped
                <div id="current_pile" className="fc ac">
                    <div className="fc sect_head">
                        <h4> Current Films </h4>
                        <small> Click on a film to delete it from your collection </small>
                    </div>
                    <div id="current_gall" className="fr">
                    {this.state.on_coll.map((item) => {
                        let movie_class = "movie_search_".concat(item[0])
                        return <div className="poster_cont">
                            <a className={movie_class} onClick={this.handleRem}>
                                <img value={item[0]} src={item[1]} alt="Poster Picture"/>
                            </a>
                        </div>
                    })}
                    </div>
                </div>
                } 
                <div id="search_n_delete" className="fc ac">
                
                <div id="search_pile" className="fc ac">
                    <div className="fc sect_head">
                        <span id="search_pile_act" className="fr ac">
                            <h4 className="border_label"> Add New Films </h4>
                            <input type="text" value={this.state.search_value} onChange={this.handleSearchChange}></input>
                        </span>
                        <small> Search, then click on a film to add to collection </small>
                    </div>
                    <div id="searched_gall" className="fr">
                            {this.state.searched_films.map((item) => {
                                let movie_class = "movie_search_".concat(item[0])
                                return <div className="poster_cont">
                                    <a className={movie_class} onClick={this.handleAdd}>
                                        <img value={item[0]} src={item[1]} alt="Poster Picture"/>
                                    </a>
                                </div>
                            })}
                    </div>
                </div>
                <div id="deleted_pile" className="fc ac cent">
                            <div className="fc sect_head">
                                <h4> Deleted Pile </h4>
                                <small> Click on a film to add it back to your collection </small>
                            </div>
                            <div id="deleted_gall" className="fr">
                            {this.state.deleted_pile.map((item) => {
                                let movie_class = "movie_search_".concat(item[0])
                                return <div className="poster_cont">
                                    <a className={movie_class} onClick={this.handleAdd}>
                                        <img value={item[0]} src={item[1]} alt="Poster Picture"/>
                                    </a>
                            </div>
                            })}
                        </div>
                    </div>
                </div>
            </div>


                <div id="end_BTNs" className="fr ac">
                    <button id="update_BTN" onClick={this.handleSubmit}> update </button>
                    <button id="cancel_BTN" onClick={send_to_prof}>cancel</button>
                </div>

            </div>
        )
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
        var movie_IDs = this.state.on_coll.map(element=>element[0]);
        const collection_ID = this.state.collection_ID
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
            url: `/collections/${collection_ID}/added_films`,
            type:"POST", 
            data:{ 
                movie_ID:movie_IDs,
                }, 
        
        success: function() {
            $("#react_sent").replaceWith(`<div id="updated_success" class="ac cent fc tt_cent"><h4> Awesomely, you updated your collection &#127902 ! </h4>  <div class="fr"><button onclick="window.location.href='/tribe/'">Browse more collections</button><button onclick="window.location.href='/users/me'">Go to your profile</button></div></div>`);
        }
    });

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
ReactDOM.render(<Collections />, document.querySelector("#add_films"));
