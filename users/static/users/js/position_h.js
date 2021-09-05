var on_left = false;

$(document).ready(function(){
    if (window.matchMedia("(max-width: 800px)").matches & !(/Mobi|Android/i.test(navigator.userAgent))){
        $("#l_insert").append($("#prof"))
        on_left = true;
    };
    window.addEventListener("resize", matching);
    })
    
function matching(){
    if (window.matchMedia("(max-width: 800px)").matches & !(/Mobi|Android/i.test(navigator.userAgent))){
        $("#l_insert").append($("#prof"))
        on_left = true;
    }
    else {
        if (on_left == true){
            $("#r_insert").append($("#prof"))
        }
        on_left = false;
    }
}
/*


    set_user(x);
    x.addListener(set_user);
    })
    
function set_user() {
    if (x.matches) { // If media query matches
        $('#l_insert').append(user);
    } else {
        document.body.style.backgroundColor = "pink";
    }
    }
    

    */