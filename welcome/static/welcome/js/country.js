document.querySelectorAll('#w_map button').forEach(pin => {
    pin.addEventListener('click',function(event){
        var prof = document.querySelector('#c_prof');
        if (prof.style.display ==  "flex") {
            prof.style.animationFillMode="reverse";
            prof.style.animationFillMode="running";
            prof.style.display = "none";
            remove_films();
        }
        else {
            prof.style.opacity="1";
            prof.style.top= `${event.clientY-250}px`;
            prof.style.left= `${event.clientX-300}px`;
            prof.style.display="flex";
            prof.style.animationPlayState="running";
            country_emoji(pin.className);
            load(pin.className);
        }
    })
    pin.addEventListener('mouseover',()=>{
        pin.nextElementSibling.style.filter = "invert()";
    })
    pin.addEventListener('mouseleave',()=>{
        pin.nextElementSibling.style.filter = "none";
    })
})


$(document).click(function(event) {  // hides the map
    var $target = $(event.target);
    if(!$target.closest('#w_map').length) {
        $('#c_prof').hide();
    }        
  });

function country_emoji(country){
    fetch(`search/country/?&country=${country}`)
    .then(response => response.json())
    .then(data => {
        var string=data["country"];
        document.querySelector('.tt_box').innerHTML = string;
    });
}

function remove_films(){
    document.querySelectorAll('.selectin').forEach(film => {
        film.remove();
    })
}

// Load next set of posts
function load(country) {
    fetch(`search/load/?&query=&start=0&end=25&country=${country}`)
    .then(response => response.json())
    .then(data => {
        data["posts"].forEach(add_film);
    });
}

// Add a new post with given contents to DOM
function add_film(contents) {
    const film = document.createElement('div');
    const link = document.createElement('a');
    const image = document.createElement('img');
    const title = document.createElement('small');
    title.innerHTML = contents["title"];
    link.href = `../film/${contents["movie_ID"]}`;
    if (contents["poster"] == null){
        image.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/TRAPPIST-1e_Const_CMYK_Print.png/166px-TRAPPIST-1e_Const_CMYK_Print.png";
    } else {
        image.src = contents["poster"];
    };
    image.alt = `${contents["title"]}(${contents["year"]})`;
    link.append(image);
    film.append(link);
    film.append(title);
    film.className = 'selectin';
    document.querySelector('.h_gal').append(film);
    // Create new post
    
}