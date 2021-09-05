$(document).ready(function(){
    $(".prof_pic").each(function(){
        if($(this).css("width")>$(this).css("height")){
            $(this).css("height","100%");
            $(this).css("width","auto");

        }else{
            $(this).css("height","auto");
            $(this).css("width","100%");
      }
    })
});