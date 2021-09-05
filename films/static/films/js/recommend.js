$(document).ready(function(){
    send_rec();
    ask_rec();
    visit_friend();
    //ask_rec();
});

function send_rec(){
    $('.send_rec').click(function() {    
        const button = $(this);
        const object = button.next();
        const check = object.next();
        /*
        const button = this;
        const object = this.nextElementSibling;
        const check = object.nextElementSibling;
        */
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
            url: "/tribe/recs",
            method: 'POST',
            data: {
                film_ID: window.location.href.substr(window.location.href.lastIndexOf('/') + 1), // data you need to pass to your function
                to_friend: this.value // username!
            },
            success: function () {   
                object.remove();
                button.remove();
                check.css("opacity","1");
            }
            });
    });

}

function ask_rec(){
    $('.ask_rec').click(function() {  
        const button = $(this);
        const object = button.next();
        const check = object.next();  
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
            url: "/tribe/rev",
            method: 'POST',
            data: {
                film_ID: window.location.href.substr(window.location.href.lastIndexOf('/') + 1), // data you need to pass to your function
                to_friend: this.value // username!
            },
            success: function () {        
                object.remove();
                button.remove();
                check.css("opacity","1");
            }
            });
    });

}
function visit_friend(){
    /*
    First section, if owner, will add one to visits to, so we can rank their popularity later on!
    Section section, sends straight to friend profile
    */
    function isDoubleClicked(element) {
        //if already clicked return TRUE to indicate this click is not allowed
        if (element.data("isclicked")) return true;
    
        //mark as clicked for 1 second
        element.data("isclicked", true);
        setTimeout(function () {
            element.removeData("isclicked");
        }, 1000);
    
        //return FALSE to indicate this click was allowed
        return false;
    };

    $(".visit_fr").on("click",function(){
        if (isDoubleClicked($(this))) return;
            const f_user = this.value;
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
                    url: "/users/add_click",
                    type:"POST", 
                    data: { 
                        f_user: f_user
                        }, 
                success: function() {
                    window.location.href=`/user/${f_user}`;
                    //ff_loading = false;
                }
                })
    });
};
