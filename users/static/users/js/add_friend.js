function manageAddFriend(){
    $(".add_friend").on('click',function(e){
        add_friend(e);
    })
    
}

function add_friend(e){
    const button = e.currentTarget;
    const user_to_add = button.value
    console.log(user_to_add)
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
                target: user_to_add,
                n_val: "fc_add",
                }, 
        success: function() {
            document.querySelector(`#${user_to_add}_user`).textContent = "Friend Request Sent";
            $(`#${user_to_add}_user`).addClass("added_friend");
            $(`#${user_to_add}_user`).on("animationend",function(){
                $(`#${user_to_add}_user`).css("display","none");
            });  
        }
        })            
};