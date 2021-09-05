// Start with first film
let counter = 0;

// Load posts 25 at a time
const quantity = 24;

// When DOM loads, render the first 25 posts
document.addEventListener('DOMContentLoaded', load);

// If scrolled to bottom, load the next 25 posts
window.onscroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        load();
    }
};


// Load next set of posts
function load() {
    // Set start and end post numbers, and update counter
    const start = counter;
    const end = start + quantity;
    counter = end + 1;

    const query = document.getElementById("query").textContent;
    // Get new posts and add posts
    fetch(`load/?&query=${query}&start=${start}&end=${end}&country=${query}`)
    .then(response => response.json())
    .then(data => {
        if (data["posts"] == "never_results"){
            never_more()
            window.onscroll = "return false";
        }
        else if (data["posts"] == "no_results"){
            no_more()
            window.onscroll = "return false";
        } else {data["posts"].forEach(add_film)};
    });
};

function never_more(){
    const alert = document.createElement('div');
    alert.innerText = "We got nothin' :(";
    document.querySelector('#results').append(alert);
}

function no_more(){
    const alert = document.createElement('div');
    alert.className = 'result_validation';
    alert.innerText = "There are no more results :(";
    document.querySelector('#results').append(alert);
}

// Add a new post with given contents to DOM
function add_film(contents) {
    const film = document.createElement('div');
    const link = document.createElement('a');
    const image = document.createElement('img');
    const film_ID = contents["movie_ID"];
    const query = document.getElementById("query").textContent;
    
    if (contents["poster"] == null){
        image.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/TRAPPIST-1e_Const_CMYK_Print.png/166px-TRAPPIST-1e_Const_CMYK_Print.png";
    } else {
        image.src = contents["poster"];
    };
    link.onclick = function(){
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
            url: `/search/f_tally`,
            type:"POST", 
            data:{ 
                query: query,
                film: film_ID,
                }, 
        
        success: function() {
            window.location.href = `../film/${film_ID}`;
            }}
        )};
    image.alt = `${contents["title"]}(${contents["year"]}`;
    link.append(image);
    film.append(link);
    film.className = 'selectin';
    
    document.querySelector('#results').append(film);
    // Create new post
    
};