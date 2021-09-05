if (/Mobi|Android/i.test(navigator.userAgent)) {
    $("#tt_f_mob").hide();
    $(".user").css({
        "margin-right":"auto",
        "border-radius":"0px",
        "border":"none",
        "background-color":"transparent"
    });
    $("#tt_mob").css({
        "width":"100%",
        "height":"80px",
        "border-radius":"0px",
        "border":"none",
        "border-bottom":"1px solid black",
        "padding":"0px"
    });
    $("#tt_mob").append($("#prof"));
    $("#prof").addClass("cent");
    $("#prof").css({
        "width":"inherit",
        "height":"inherit",
        "margin-bottom":"0px",
        "margin-top":"auto",
    });
    $("#prof .user").css({
        "margin-top":"auto",
        "border":"none"
    });
    $("#prof").append($("#notification"));
    $("#notification").css({
        "top":"105px",
        "position":"absolute",
    });
    $("#lcol").css({
        "margin-top":"-25px"
    });
    $("#f_check").css({
        "display":"flex",
        "top":"80px",
        "position":"absolute",
        "height":"22px",
        "background":"black",
        "border-radius":"0px",
        "border":"none",
        "opacity":"1",
    });
    $("#f_check button").css({
        "color":"white",
        "font-weight":"bold",
        "opacity":"1",
        "font-size":"10px"
    });
    $(".f_check").css({
        "display":"block",
        "position":"sticky",
        "height":"20px",
        "background":"black",
    });
    $(".no").css({
        "content":"",
    });
    /*$(".no").css({
        "width":"100px",
        "border-radius":"50px",
        "left":"24%",
        "right":"24%",
        "top":"0px",
        "bottom":"90%",
        "align-self":"flex-start",
        "background-color":"black",
    });*/
    //$("#footer").append($(".no"));
    $(".f_check button").css({
        "color":"white"
    });
    $("#acc_friends .f_check_rec").css({
        "width":"inherit",
        "border-top-left-radius":"0px",
        "border-top-right-radius":"0px",
        "border-bottom-left-radius":"20px",
        "border-bottom-right-radius":"20px",
    });
    $("#acc_friends .user.fr").css({
        "border":"1px solid black",
        "border-top-left-radius":"20px",
        "border-top-right-radius":"20px",
    });
    $("#rcol").append($("#collection_head"));
    $("#rcol").append($("#the_collections"));
    $("#rcol").append($("#create_collection"));
    if ($("#change_ff").text()=="Remove Friend"){
        $("#change_ff").css("color","grey");
    };
    
}