$(document).ready(function(){
    $(".one_comm").on("click",
        function(){
            var comment = this;
            if (comment.classList.contains("one_comm")){
                comment.classList.remove("one_comm")
                comment.classList.add("float");
                $("#screen").addClass("show_s");
            };
            comment.style.animation =  "rev_comment 1s ease 0s 1 normal forwards running";
    });
});

$(document).click(function(event) {  // hides the map
    var $target = $(event.target);
    if(!$target.closest('.float').length) {
        var block = $('.float')
        block.addClass("one_comm");
        block.css({
            "animation":"opac 1s ease 0s 1 normal forwards running",
            "display":"flex"
        });
        block.removeClass('float');
        $("#screen").removeClass("show_s");
    }        
  });

$(".left_comm").on("click",function(event){
    var block = $(event.target).parent().parent().parent()
    var sibling = block.prev();
    $(block[0]).css("display","none");
    $(sibling[0]).css("display","flex");
    //$('.float').addClass('one_comm').removeClass('float');
    sibling[0].classList.replace("one_comm","float");

});
$(".right_comm").on("click",function(event){
    var block = $(event.target).parent().parent().parent();
    var sibling = $(block).next();
    $(block[0]).css("display","none");
    $(sibling[0]).css("display","flex");
    //$('.float').addClass('one_comm').removeClass('float');
    sibling[0].classList.replace("one_comm","float");
    //check_prev();
    //check();
});
