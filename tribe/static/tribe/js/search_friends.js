/* 

WHAT YOU WILL DOO:::

1) look at other react.component when you loaded the 10 divs for film, repeated the options for tags
2) use the multi select that you saw in the options in stackoverflow
3) make it pretty with the theme you chose when creating the user upload

*/

class SearchUsers extends React.Component {
    

    constructor(props) {
        super(props);

        this.state = {
            loaded:false,
       
            privacy: 1,
            description: "",
            search_value: "",
            searched_users: [], // user searches
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
    };


    handleSearchChange(event) {
        const value = event.target.value;
        // var url = `http://127.0.0.1:8000/search/api/film_by_tag?&tt=${value}`
        var url = `/search/api/find_users?&name=${value}`
        const fetchSearch = async () => {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    var searched_users = [];
                    for (var i = 0; i < data.length; i++){
                        const username = data[i]["username"];
                        const image = new Image().src=data[i]["prof_pic"];
                        if (data[i]["relationships"]!=2){
                            var add_friend = "1";
                        }else{
                            var add_friend ="0";
                        }
                        searched_users.push([username,image, add_friend]);
                        };
                    this.setState({
                            search_value: value,
                            searched_users: searched_users
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
                $(`.movie_search_${movie_ID}`).css("filter","brightness(0%)");

            }
    }}

    render(){

        return( // WHY DOES IT KEEP GOING ON AND ON AND ON AND ON
            <div className="ac fc cent">
                <div id="search_col" className="fc cent">
                    <div id="r_search" className="fc ac cent">
                        <small className="border_label"> Search </small>
                        <input type="text" value={this.state.search_value} onChange={this.handleSearchChange}></input>
                            <div id="searched_gall" className="fr ac">
                                {this.state.searched_users.map((item) => {
                                    let button;
                                    if (item[2] == "1"){
                                        button = <button value={item[0]}> Add Friend </button>
                                    }else{
                                        button = <button> You Are Friends! </button>
                                    };
                                    let user_profile = "/user/".concat(item[0]);
                                    return <div className="search_ff_container fc ac">
                                            <a className="img_cc fr ac" href={user_profile}>
                                                    <img className="prof_pic cent" src={item[1]} alt="Profile Picture"/>
                                            </a>
                                            <a href={user_profile}><p> {item[0]} </p> </a>
                                    </div>
                                })}
                            </div>
                        </div>
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
   

}

ReactDOM.render(<SearchUsers />, document.querySelector("#search_friends"));