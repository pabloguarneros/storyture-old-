class AdminTags extends React.Component {
    

    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            search_value: "",
            tag_options: [],
            tag_selected: "",
            searched_films: [], // user searches
            on_coll: [],
            deleted_pile:[],
        };

        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleTagChange = this.handleTagChange.bind(this);

    };


    componentDidMount(){
        const api = '/search/api/tag';
        const fetchTags = async () => {
            fetch(api)
                .then(response => response.json())
                .then(data => {
                    var tag_options = [];
                    for (var i = 0; i < data.length; i++){
                        const tag_name = data[i]["name"];
                        tag_options.push(tag_name);
                        };
                    this.setState({
                        tag_options: tag_options,
                        loaded:true
                        })
                });
        };
        fetchTags();
        
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
        var url = `/search/api/film_extended?&tt=${value}`
        const fetchSearch = async () => {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    var searched_films = [];
                    for (var i = 0; i < data.length; i++){
                        const movie_ID = data[i]["movie_ID"];
                        const poster_pic = new Image().src=data[i]["poster_pic"];
                        const name = `${data[i]["title"]} (${data[i]["year"]})`;
                        searched_films.push({
                            "movie_ID":movie_ID,
                            "poster_pic":poster_pic,
                            "name":name
                        });
                        };
                    this.setState({
                            searched_films: searched_films
                        });
                });
        };
        fetchSearch();
      } 

    handleTagChange(event){
        const choice = event.target.value;
        this.setState({
            deleted_pile:[],
            tag_selected: choice},
        this.fetchFilmsbyTag(choice));
    }

    fetchFilmsbyTag(value) {
        var url = `/search/api/film_extended?&tag=${value}`
        const fetchSearch = async () => {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    var on_coll = [];
                    for (var i = 0; i < data.length; i++){
                        const movie_ID = data[i]["movie_ID"];
                        const poster_pic = new Image().src=data[i]["poster_pic"];
                        const name = `${data[i]["title"]} (${data[i]["year"]})`;
                        on_coll.push({
                            "movie_ID":movie_ID,
                            "poster_pic":poster_pic,
                            "name":name
                        });
                        };
                    this.setState({
                            on_coll: on_coll
                        });
                });
        };
        fetchSearch();
      }

    
    handleAdd = (event) => {{
          const movie_ID = event.target.getAttribute("value");
          const name = event.target.getAttribute("name");
          const poster_pic = event.target.getAttribute("src");
          var on_coll = this.state.on_coll;
          var if_contains = on_coll.every((element,index,array)=>{
                return array[index]["movie_ID"] != movie_ID;
                });
          if (if_contains){
            on_coll.push({
                "movie_ID":movie_ID,
                "poster_pic":poster_pic,
                "name":name
            });
                this.setState({
                on_coll: on_coll,
                });
                $(`.movie_search_${movie_ID}`).css("display","none");
            }
            else{
                if ($(event.target).hasClass("already_in")){ //costly
                    $(event.target).removeClass("already_in");
                }else{
                    $(event.target).addClass("already_in");
                };
            };
    }}

    handleRem = (event) => {{
        const movie_ID = event.target.getAttribute("value");
        var array = this.state.on_coll;
        var deleted_pile = this.state.deleted_pile;
        var filtered = array.filter(function(value, index, array){ 
            if (value["movie_ID"] != movie_ID){
                return value["movie_ID"] != movie_ID;
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

        /*
        HAVE WAY TO ADD TAGS AND REMOVE FILMS FROM THE TAGS TOO!
        NEED SELECTED TAGS TOO!!! and to define a couple more submits

        */

        return( 
            <div id="react_sent" className="ac fc cent">
                <div id="update_head" className="fr">
                    <h3> Tag Manager </h3>
                </div>

                <label id="tag_select">
                    <p> Select the tag to analyze </p>
                    <select className="form-group" value={this.state.tag_selected} onChange={this.handleTagChange}>
                        {this.state.tag_options.map((value, index) => {
                            var name = this.state.tag_options[index];
                        return <option value={name}>{name}</option>
                        })}
                    </select>
                </label>
                
                <div id="adding_portals" className="fr">

                {this.state.on_coll.length > 0 && //if statement renders if the result can be mapped
                <div id="current_pile" className="fc ac">
                    <div className="fc sect_head">
                        <h4> Current Films </h4>
                        <small> Click on a film to delete it from your collection </small>
                    </div>
                    <div id="current_gall" className="fr">
                    {this.state.on_coll.map((item) => {
                        let movie_class = "movie_search_".concat(item["movie_ID"])
                        return <div className="poster_cont">
                            <span className={movie_class}>
                            <a onClick={this.handleRem}>
                                <img value={item["movie_ID"]} src={item["poster_pic"]} alt="Poster Picture"/>
                            </a>
                            <p>{item["name"]}</p>
                            </span>
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
                                let movie_class = "movie_search_".concat(item["movie_ID"])
                                return <div className="poster_cont">
                                    <span className={movie_class}>
                                    <a onClick={this.handleAdd}>
                                        <img value={item["movie_ID"]} src={item["poster_pic"]} alt="Poster Picture"/>
                                    </a>
                                    <p> {item["name"]} </p>
                                    </span>
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
                                let movie_class = "movie_search_".concat(item["movie_ID"])
                                return <div className="poster_cont">
                                    <a className={movie_class} onClick={this.handleAdd}>
                                        <img value={item["movie_ID"]} src={item["poster_pic"]} alt="Poster Picture"/>
                                    </a>
                            </div>
                            })}
                        </div>
                    </div>
                </div>
            </div>


                <div id="end_BTNs" className="fr ac">
                    <button id="update_BTN" onClick={this.handleUpdate}> Update Tag </button>
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

    handleUpdate(event) {
        event.preventDefault();
        var added_films = this.state.on_coll.map(element=>element["movie_ID"]);
        var removed_films = this.state.deleted_pile.map(element=>element["movie_ID"]);
        const tag = this.state.tag_selected;
        const react_obj = this;
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
            url: `/tribe/admin/tags_push`,
            type:"POST", 
            data:{ 
                added_films:added_films,
                removed_films:removed_films,
                tag: tag,
                }, 
        
        success: function() {
            $("#update_BTN").html(`updated for ${tag}`);
            react_obj.setState({
                tag_selected: "",
                searched_films: [], // user searches
                on_coll: [],
                deleted_pile:[],
            });
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
ReactDOM.render(<AdminTags />, document.querySelector("#manage_tags"));
