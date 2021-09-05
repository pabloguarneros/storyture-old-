function manageFriends(){
    if (/Mobi|Android/i.test(navigator.userAgent)) {
        $("#f_check").removeClass("gg");
    }else{
        $("#prof").hover(
            function(){
                $("#f_check").css("display","flex");
            },
            function(){
                $("#f_check").css("display","none");
            })
        $(".f_grid").hover(
            function(){
                this.childNodes[1].style.display="flex";
            },
            function(){
                this.childNodes[1].style.display="none";
            })
        $(".req_cont").hover(
                function(){
                    $(this).find(".f_check").css("display","flex");
                },
                function(){
                    $(this).find(".f_check").css("display","none");
        })
    };
    f_action();
    acc_req();
    visit_friend();
};

manageFriends();


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

function f_action(){
    $("#change_ff").click(
        function(){
            if (isDoubleClicked($(this))) return;
            var obj = this;
            if ($("#change_ff").text()=="Remove Friend"){
                $("#change_ff").html("Are You Sure?");
                $("#change_ff").mouseleave(
                    function(){
                        $("#change_ff").html("Remove Friend");
                    }
                );
                obj.css("pointer-events","none");
            } else {
            function get_class_name(){
                return `${obj.className}`;
            } 
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
                        target: `${$("#username span").text().trim()}`.toLowerCase(),
                        n_val: get_class_name(),
                        }, 
                success: function() {
                    if (obj.className == "fc_friends"){
                        obj.classList.remove("fc_friends");
                        obj.classList.add("fc_add");
                        obj.innerHTML = "Add Friend";
                    } else if (obj.className == "fc_cancel"){
                        obj.classList.remove("fc_cancel");
                        obj.classList.add("fc_add");
                        obj.innerHTML = "Add friend";
                    } else if (obj.className == "fc_respond"){
                        obj.classList.remove("fc_respond");
                        obj.classList.add("fc_friends");
                        obj.innerHTML = "Delete Friend";
                    } else if (obj.className == "fc_add"){
                        obj.classList.remove("fc_add");
                        obj.classList.add("fc_cancel");
                        obj.innerHTML = "Cancel Friend Request";
                    }
                    window.location.reload();
                }
                })
            obj.css("pointer-events","none");
        }})
            
};


function visit_friend(){
    /*
    First section, if owner, will add one to visits to, so we can rank their popularity later on!
    Section section, sends straight to friend profile
    */
    $(".visit_fr").on("click",function(){
        if (isDoubleClicked($(this))) return;
        if (this.name == "owner"){
            const obj = this;
            const f_user = obj.value;
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
                    window.location.href=`${f_user}`;
                    ff_loading = false;
                }
                })
        };
            window.location.href=`${this.value}`;
    });
};


function acc_req(){
    $(".f_check button").on("click",
        function(){
            if (isDoubleClicked($(this))) return;
            var obj = this;
            function get_class_name(){
                return `${obj.className}`;
            } 
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
                        target: get_class_name(),
                        n_val: "fc_respond",
                        }, 
                success: function() {
                    location.reload();
                    obj.disabled = true;
                }
                })
            })
            
};