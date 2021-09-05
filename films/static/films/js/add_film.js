$(document).ready(function(){
    send_log();
    buck_film();
    fav_film();
    like_film();
    dislike_film();
});

function send_log(){
    $(".logs_f").click(function(){
        url = this.value;
        window.location.href=`/users/login?next=${url}`;
    });
};

function buck_film(){
    $(".add_bucket").click(function(){
        ID = this.value,
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
                url: "/search/f_push",
                type:"POST", 
                data:{ 
                    action: "add_bucket",
                    film_id: ID,
                    }, 
            success: function() {
                $(`#f_tokens_${ID}`).html("<span> <p> Added to Bucket List </p> </span>");
                }
            })}
    );
    $(".in_buck").click(function(){
        $(`#f_tokens_${this.value}`).html("<span> <p> Already in your bucket list </p> </span>");
    });
};

function fav_film(){
    $(".add_fav").click(function(){
        ID = this.value,
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
                url: "/search/f_push",
                type:"POST", 
                data:{ 
                    action: "add_favorite",
                    film_id: ID,
                    }, 
            success: function() {
                $(`#f_tokens_${ID}`).html("<span> <p> Added to Favorites </p> </span>");
                }
            })}
    );
    $(".in_fav").click(function(){
        $(`#f_tokens_${this.value}`).html("<span> <p> Already in your favorites </p> </span>");
    });
};

function like_film(){
    $(".add_like").click(function(){
        ID = this.value,
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
                url: "/search/f_push",
                type:"POST", 
                data:{ 
                    action: "add_like",
                    film_id: ID,
                    }, 
            success: function() {
                $(`#f_tokens_${ID}`).html("<span> <p> You liked this. </p> </span>");
                }
            })}
    )
};

function dislike_film(){
    $(".add_dis").click(function(){
        ID = this.value,
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
                url: "/search/f_push",
                type:"POST", 
                data:{ 
                    action: "add_dis",
                    film_id: ID,
                    }, 
            success: function() {
                $(`#f_tokens_${ID}`).html("<span> <p> You disliked this. </p> </span>");
                }
            })}
    )
};