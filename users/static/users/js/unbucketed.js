// Start with first film
let counter = 45;

// Load posts 15 at a time
const quantity = 22;

let max_height = 90;

// When DOM loads, render the first 25 posts
$(document).ready(function(){
    const divider = $("#f_act .film")
    divider.scroll(function(){
        if (divider.scrollTop() > max_height & counter < 300){
            max_height += 100;
            load()
        }});
    load();
    })


// Load next set of posts
function load() {
    // Set start and end post numbers, and update counter
    // Get new posts and add posts
    const start = counter;
    const end = start + quantity - 1;
    const query = "b";
    const country = "USA";
    counter = end + 1
    fetch(`/search/load/?&query=${query}&start=${start}&end=${end}&country=${country}`)
    .then(response => response.json())
    .then(data => {
        if (data["posts"] == "never_results"){
            never_more()
        } else {data["posts"].forEach(add_film)};
    });

};

function never_more(){
    const alert = document.createElement('div');
    alert.innerText = "We got nothin' :(";
    document.querySelector('#results').append(alert);
}

// Add a new post with given contents to DOM
function add_film(contents) {
    const film = document.createElement('div');
    const link = document.createElement('a');
    const image = document.createElement('img');
    const film_ID = contents["movie_ID"]
    const film_tt = contents["title"];
    const film_yy = contents["year"];
    
    image.src = contents["poster"];
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
            url: `/search/f_push`,
            type:"POST", 
            data:{ 
                action: "add_bucket",
                film_id: film_ID,
                }, 
        
        success: function() {
            $(`#${film_ID}`).css("opacity",0);
            $("#buck_desc").html(`<div id='buck_desc' class='tt'> ${film_tt} added to list &#127871 </div>`)

            }}
        )};
    image.alt = `${contents["title"]}(${contents["year"]}`;
    link.append(image);
    film.append(link);
    film.className = 'selectin';
    film.id = film_ID;
    
    document.querySelector('#results').append(film);


    // Create new post
    
};