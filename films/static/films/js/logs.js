$(document).ready(function(){
    $("#log_act").hover(
        function(){
            this.childNodes[1].style.display="flex";
        },
        function(){
            this.childNodes[1].style.display="none";
        });
    $(".logs").click(function(){
        url = this.value;
        window.location.href=`/users/login?next=${url}`;
    });
});
