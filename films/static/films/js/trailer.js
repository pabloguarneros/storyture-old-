$(document).ready(function(){
    style_vid();
    }
)

function style_vid(){
    const trailer = $("#trailer_ghost");
    trailer.hover(function(){
        trailer_frame = trailer.next()
        trailer_frame.css("height","240px");
        trailer.parent().css("height","240px");
        trailer.remove();
    }
    )};