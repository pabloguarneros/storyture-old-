$(document).ready(function(){
    n_feed_friend_action();
    rem_feed();
})

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
}

function n_feed_friend_action(){
    $(".add_f").on("click",(
        function(){
            if (isDoubleClicked($(this))) return;
            var obj = this;
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
                    url: "/users/change",
                    type:"POST", 
                    data: { 
                        target: obj.value, //user 
                        n_val: "fc_add", // to remove fc_cancel
                        }, 
                success: function() {
                    $(obj).css("content","Added");
                }
                })
        }))
};

function rem_feed(){
    $(".remove_feed").on("click",(
        function(){
            const obj = this;

            if (isDoubleClicked($(this))) return;
            this.hide();
        }))
    };

/*
var expanded = false;

$(document).ready(function(){
    feed_expand();
});

function feed_expand(){
    $(".i_expand").on("click",function(){
        expanded = true;
        $("#notification").css({
            "height":"70vh",
        });
        $("#notification:hover").css({
            "background": "rgb(187,51,182)",
            "background":"linear-gradient(357deg, rgba(187,51,182,1) 0%, rgba(249,140,140,1) 94%)",
        });
    })
};

$(document).click(function(event) {  // hides the map
    var $target = $(event.target);
    if(!$target.closest('#notification').length & expanded == true) {
        $("#notification").css({
            "height":"16px",
        });
        $("#notification:hover").css({
            "background": "black",
        });
        expanded=false;
    }        
  });

  */