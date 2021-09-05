class Feedback extends React.Component {
    

    constructor(props) {
        super(props);
        this.state = {
            value: "",
            film_ID: window.location.href.substr(window.location.href.lastIndexOf('/') + 1), 
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            value: event.target.value
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
            url: `/tribe/filmfeed`,
            type:"POST", 
            data:{ 
                film_ID: this.state.film_ID,
                feedback: this.state.value
                }, 
        
        success: function() {
            $("#feedback").replaceWith("<p> Thanks for submitting :) </p> ");
        }
    });

      }

    render() {
        
        return (
        <div> 
            <form className="fc ac feedback_area" onSubmit={this.handleSubmit}>
            <label>
                <textarea value={this.state.value} onChange={this.handleChange} />
            </label>
            <button
                onClick={this.handleSubmit}
                type="submit"
                value="Submit"
                >
                Submit
            </button>
            </form>
        </div>
        )
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
ReactDOM.render(<Feedback />, document.querySelector("#ff_key"));
