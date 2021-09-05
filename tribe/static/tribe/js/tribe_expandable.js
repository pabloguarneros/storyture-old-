function expand(){
    var box = this.parentElement;
    var handle = this.nextElementSibling;
    var content = handle.nextElementSibling;

    if (content.style.maxHeight != "260px"){
        content.style.maxHeight = "260" + "px";
        content.style.opacity =1;
        handle.style.display="block";
        box.style.marginTop="60px";
        this.style.top = "-50px";
        this.style.transition = "top .4s ease-in-out";
        this.style.padding = "5px 12%";
        this.style.width = "70%";
        this.style.height = "34px";
        this.style.overflow = "hidden";
        this.style.maxHeight = "34px";
        box.style.border="1px black solid";
        content.style.overflow = "scroll"; 
        this.style.backgroundColor = "white";
        this.style.color = "black";
        box.style.background = "white";
        
    } else {
        content.style.maxHeight = "0px";
        handle.style.display="none";
        content.style.opacity =0;
        box.style.marginTop="10px";
        box.style.background="transparent";
        this.style.top = "0px";
        this.style.height = "40px";
        this.style.background = "black";
        this.style.color = "white";
        box.style.border="none";
        this.style.padding = "5px 10%";
        this.style.transition = "width .3s ease-in-out,top .4s ease-in-out,border .4s ease-in-out";
        this.style.width = "100%";
        

    }
}

document.addEventListener('DOMContentLoaded',function(){
    const buttons = document.getElementsByClassName("exp_label");
    for (i=0; i < buttons.length; i++){
        buttons[i].onclick = expand;
    }


});

