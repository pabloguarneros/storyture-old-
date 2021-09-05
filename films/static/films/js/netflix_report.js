$(document).ready(function(){
    played();
    net_report();

});

function played(){
    $("#play_f_btn").on("click",function(e){
        const net_code = (e.target.value);
        window.open(`http://netflix.com/watch/${net_code}`, '_blank');
        $("#net_report").show();
    });
}

function net_report(){
    $("#net_report").on("click",function(e){
        $(e.target).hide();
        $("#net_wrong_url").show(300);
        $("#net_not_live").show(300);
    });
    $("#net_wrong_url").on("click",function(e){
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
        $.ajax({
        url: "/tribe/link_alert",
        method: 'POST',
        data: {
            film_ID: window.location.href.substr(window.location.href.lastIndexOf('/') + 1), // data you need to pass to your function
            alert: button.value // username!
        },
        success: function () {   
            $(button).parent().html("<p> Got it. Thanks for helping the tribe! </p>");
            }
            });
        });
    $("#net_not_live").on("click",function(e){
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
        $.ajax({
        url: "/tribe/link_alert",
        method: 'POST',
        data: {
            film_ID: window.location.href.substr(window.location.href.lastIndexOf('/') + 1), // data you need to pass to your function
            alert: button.value // username!
        },
        success: function () {   
            $(button).parent().html("<p> Got it. Thanks for helping the tribe! </p>");
            }
            });
        });
}