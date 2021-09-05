$(document).ready(function(){
    $(".f_grid").hover(
        function(){
            this.childNodes[1].style.display="flex";
        },
        function(){
            this.childNodes[1].style.display="none";
        })
    visit_friend();
});


function visit_friend(){
    $(".visit_fr").click(function(){
        window.location.href=this.value;
    });
};
