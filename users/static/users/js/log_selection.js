

document.querySelector('#log_bttn').addEventListener("click",event=>{
    document.querySelector("#log_in").style.display="flex";
    document.querySelector("#sign_up").style.display="none";
})

document.querySelector('#reg_bttn').addEventListener("click",event=>{
    document.querySelector("#sign_up").style.display="flex";
    document.querySelector("#log_in").style.display="none";
})