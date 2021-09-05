$("#about_btn").on('click',function(){
    document.querySelector('#about').scrollIntoView({ 
        behavior: 'smooth' 
    });
})

$("#bottom_divider").css("height",document.documentElement.scrollHeight-(.95*window.innerHeight))