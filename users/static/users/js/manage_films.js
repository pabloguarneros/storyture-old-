function rem_buck(){
    const user = $("#username span").text().trim()
    $(".buck_rem").click(function(){
            const object = this.parentElement.parentElement
            $.ajaxSetup({ 
                cache:false,
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
                    url: `/user/${user}/rem_bucket`,
                    type:"POST", 
                    data: { 
                        film_ID: this.value,
                        }, 
                success: function() {
                    object.style.animationPlayState = 'running'
                    

    
            }
        })

        })

};

function rem_fav(){
    const user = $("#username span").text().trim()
    $(".fav_rem").click(function(){
            const object = this.parentElement.parentElement
            $.ajaxSetup({ 
                cache:false,
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
                    url: `/user/${user}/rem_fav`,
                    type:"POST", 
                    data: { 
                        film_ID: this.value,
                        }, 
                success: function() {
                    object.style.animationPlayState = 'running'
                    
    
            }
        })

        })
 
};

function rem_coll_item(){
    $(".collection_rem").click(function(e){
            const object = this.parentElement.parentElement //to use in the animation of it
            const collection_id = e.target.name;
            const movie_id = e.target.value;
            $.ajaxSetup({ 
                cache:false,
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
                    url: `/collections/${collection_id}/rem_film`,
                    type:"POST", 
                    data: { 
                        movie_ID: movie_id,
                        }, 
                success: function() {
                    object.style.animationPlayState = 'running'      
    
            }
        })

        })
 
};

$(document).ready(function() {
    rem_buck();
    rem_fav();
    rem_coll_item();
});