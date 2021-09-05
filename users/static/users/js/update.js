$(document).ready(function() {
    $('select').select2();
    crr_prof_pic();
});

function crr_prof_pic(){
    const prof_a = $('#div_id_prof_pic div a')
    const link = $('#div_id_prof_pic div a').html()
    prof_a.html(`<div class='img_cont'> <img src="/media/${link}" alt='Current Profile Image'/> </div>`)
    $("#div_id_prof_pic img").each(function(){
            if($(this).css("width")>$(this).css("height")){
                $(this).css("height","100%");
                $(this).css("width","auto");
    
            }else{
                $(this).css("height","auto");
                $(this).css("width","100%");
          }
        });
}