const apiUrl = "http://localhost:3000";
// console.log("in dom")
document.addEventListener("DOMContentLoaded" , function(){
//    console.log("script loaded")
    const loginBtn = document.getElementById('loginButton');

    const signupBtn = document.getElementById('signupButton');

    loginBtn.addEventListener("click" , function(event) {
        event.preventDefault();
        // console.log("---------------")
        window.location.href = `${apiUrl}/api/login`;
    })

    signupBtn.addEventListener("click" , function(event){
        event.preventDefault();
        // console.log("+++++++++++++++")
        window.location.href = `${apiUrl}/api/signup`;
    });
});