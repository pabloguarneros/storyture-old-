$(document).ready(function(){

    $("#delete_collection").on("click",function(e){
        const collection_pk = e.target.value
        const user_ID = e.target.name
        var obj = e.target;
        if ($(e.target).text()=="Delete Collection"){
            $(e.target).html("Are You Sure?");
            $(e.target).mouseleave(
                function(){
                    $("#delete_collection").html("Delete Collection");
                }
            );
        } else {
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
                url: `/collections/${collection_pk}/delete`,
                type:"POST",
            success: function() {
                $("#update_body").replaceWith(`<div id="delete_success" class='fc ac cent'> <h5> Delete successful. </h5> <button onclick="document.location='/user/${user_ID}'"> Go back to your profile </button> </div>`);
                $('html, body').animate({ scrollTop: 0 }, 0);
                //THIS IS NOT WORKING !! not scrolling to the top
            }
        });
    };
    });
})