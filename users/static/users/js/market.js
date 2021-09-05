function market(item){
    var shown = 0;
    $(`#${item}_cl`).click(function(){
        if (shown==0){
            /*
            if ($(`#buy_${item}`).length & item!= "stage") {
            };
            */
            $(`#lr_${item}`).css("display","flex");
            $(`#cr_${item}`).css("display","none");
            $(`#tr_${item}`).css("display","none");

            shown = 1;
        } else if (shown == 1){
            $(`#lr_${item}`).css("display","none");
            $(`#cr_${item}`).css("display","none");
            $(`#tr_${item}`).css("display","flex");
            shown = 2;
        }else if (shown == 2) {
            $(`#tr_${item}`).css("display","none");
            $(`#${item}_cl`).css("height","100%");
            $(`#lr_${item}`).css("display","none");
            $(`#cr_${item}`).css("display","flex");
            shown = 0;
        };
    })
    $(`#buy_${item}`).click(function(){
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
                url: "/market/buy",
                type:"POST", 
                data: { 
                    object: this.value,
                    }, 
            success: function() {
                $("#MY_KN").load(location.href + " #MY_KN");
                location.reload();

        }
    })
})};

$(function() {
    market("stage");
    market("projector");
    market("speaker");
    market("seat");
    market("popcorn");
    //NOTE THAT YOU ARE REPEATING, THE SAME, JUST PASS A LIST ITERATING!!
});