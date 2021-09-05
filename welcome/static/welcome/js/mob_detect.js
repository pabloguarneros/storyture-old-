if (/Mobi|Android/i.test(navigator.userAgent)) {
    $("#tt_mob").css("display","block");
    $(".video_intro").css("display","none");
    /*
    $("#game_lead").css({
        "position":"relative",
        "left":"-8px",
        "bottom":"0px",
        "height":"36px",
        "width":"36px",
        "padding":"0px",
        "border":"none",
        "backdrop-filter":"none"
    });
    $("#navigator").append($("#game_lead"));

    */
    
    $("#game_lead").hide();
    $("#header").removeClass("nav_down");
    $("#navigator object").css({
                    "width":"36px",
                    "height":"36px"
                    });  
    $("#navigator span").css({
                    "opacity":"1",
                    });  
    $("#navigator object.fill").css({
        "display":"none",
        }); 
    $("#navigator object.no_fill").css({
            "display":"block",
            }); 
    $("#navigator").css({
                "display":"flex",
                "top":"0px"
                });      
    $("#header").css({
                    "width":"100vw",
                    "padding":"8px 0px",
                    "margin":"0px",
                    "height":"60px",
                    "bottom":"-25px",
                    "top":"auto",
                    "border-radius":"0px",
                    "background-color":"white",
                    "border":"none",
                    "border-top":".5px solid black"
                }); 
    //$("#hover_nav").remove();
    //$("#hover_tp").remove();
    $("#title").remove();
    //$("#tt_mob").css("display","block");

    var this_page = window.location.href.substr(window.location.href.indexOf('/',8) + 1);
    /* LOADING NAVIGATION ICONS*/
    if (this_page == ""){
        $("#home object.fill").css({
            "display":"block",
            }); 
        $("#home object.no_fill").css({
                "display":"none",
                }); 
    } else if (this_page == "authentico"){
        $("#game_lead object.fill").css({
            "display":"block",
            }); 
        $("#game_lead object.no_fill").css({
                "display":"none",
                }); 
    } else if (this_page == "tribe/"){
        $("#market object.fill").css({
            "display":"block",
            }); 
        $("#market object.no_fill").css({
                "display":"none",
                }); 
    } else if (this_page.substring(0,5) == "user/"){
        $("#profile object.fill").css({
            "display":"block",
            }); 
        $("#profile object.no_fill").css({
                "display":"none",
                }); 
    } else if (this_page.substring(0,6) == "search"){
        $("#search object.fill").css({
            "display":"block",
            }); 
        $("#search object.no_fill").css({
                "display":"none",
                }); 
    } 
    /*
    This section reveals and hides the footer.
    */
    $("#footer").css("border","none");
    $("#footer").addClass('fc').removeClass('fr');
    $("#drop_foot").append($("#footer"));
    var clicked = false;
    $("#reveal_foot").on("click",function(){
        if (clicked == false){
            $("#tt_foot").css("animation","foot_reveal .4s linear 0s 1 normal forwards running");
            clicked = true;
        } else{
            $("#tt_foot").css("animation","foot_hide .4s linear 0s 1 normal forwards running");
            clicked = false;
        }
    }
    );
    window.onscroll = () => {

        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            $("#tt_foot").css("animation","butt_reveal .4s linear 0s 1 normal forwards running");
            $(document).click(function(event) {  // hides the map
                window.onscroll = () => {
                    $("#tt_foot").css("animation","foot_hide .4s linear 0s 1 normal forwards running");
                    clicked = false;
                };
                var $target = $(event.target);
                if(!$target.closest('#tt_foot').length & clicked == true) {
                    $("#tt_foot").css("animation","foot_hide .4s linear 0s 1 normal forwards running");
                    clicked = false;
                }  
              });
        }
        
    };
    

} else{
    $("#tt_foot").hide();
}