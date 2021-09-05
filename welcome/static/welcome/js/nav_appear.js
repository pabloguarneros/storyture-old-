var executed = false;

$(document).ready(function () {
    transition_top();
  });


function transition_top(){
    var header = $("#header");
    var intro = $("#introduction")
    $(document).on("scroll", () => {
        if (!executed){
            border = $(window).scrollTop();
            intro_h = intro.height();
            if (intro_h - border < 0){
                header.css("animationPlayState","running");
                intro.css("display","none");
                executed=true;
            };
    }});
    };
