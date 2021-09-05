$(document).ready(function() {
    $('#div_id_country select').select2();
    $('#div_id_language select').select2();
    $('#div_id_genre select').select2();
    $('#div_id_tags select').select2();
    $('#div_id_productions select').select2();
    crr_poster();
    $('#id_trailer').parent().append($('#id_trailer')); // puts the id trailer below the small text
});

function crr_poster(){
    const prof_a = $('#div_id_poster_pic div a')
    const link = $('#div_id_poster_pic div a').html()
    prof_a.html(`<div class='img_cont'> <img src="/media/${link}" alt='Current Poster'/> </div>`)
}