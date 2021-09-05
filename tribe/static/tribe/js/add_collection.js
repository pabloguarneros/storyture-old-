/*
--> If already following, use it as collections you follow and then other ones that do not
*/

$(document).ready(function(){
    follow_collection();
    unfollow_collection();
    copy_collection();
});

function follow_collection(){
    $(".collection_follow").on("click",function(e){
        const button = e.target;
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
            url: `/tribe/add_collection`,
            type:"POST", 
            data:{ 
                pk:button.value,
                action:"1",
                }, 
        
        success: function() {
            $(button).hide();
            $(`#collection_${button.value} .collection_unfollow`).show();

        }
    });
    })
};

function unfollow_collection(){
    $(".collection_unfollow").on("click",function(e){
        const button = e.target
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
            url: `/tribe/add_collection`,
            type:"POST", 
            data:{ 
                pk:button.value,
                action:"0",
                }, 
        
        success: function() {
            $(button).hide();
            $(`#collection_${button.value} .collection_follow`).show();
        }
    });
    })
};

function copy_collection(){
    $(".collection_copy").one("click",function(e){
        const button = e.target
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
            url: `/tribe/add_collection`,
            type:"POST", 
            data:{ 
                pk:button.value,
                action:"2",
                }, 
        
        success: function() {
            $(button).html("ADDED");
            $(button).css({
            "background-color":"black",
            "color":"white"
            });
        }
    });
})
};