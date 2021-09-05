function expand(component_id){
    if (!$(component_id).hasClass("expand")){
        $(component_id).addClass("expand");
    }
}

document.addEventListener('scroll', function() {
    const screen_scrolled = window.scrollY/document.documentElement.scrollHeight;
    if (screen_scrolled > 0.65) { expand("#about_login") } else
    if (screen_scrolled > 0.62) { expand("#about_explore") } else
    if (screen_scrolled > 0.47) { expand("#about_connect") } else
    if (screen_scrolled > 0.29) { expand("#about_personalize") };
});

