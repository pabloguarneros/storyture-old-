$(document).ready( () => {
    $('#curtain').css("animation","curtain_off .2s ease 0s 1 forwards");
    $('#curtain').on("animationend", () => { $('#curtain').css("display","none") });
})