// const apiUrl = "http://localhost:3000";
// const apiUrl = "http://13.233.255.87:3000";
// console.log("in dom")
document.addEventListener("DOMContentLoaded" , function(){
//    console.log("script loaded")
    const loginBtn = document.getElementById('loginButton');

    const signupBtn = document.getElementById('signupButton');

    loginBtn.addEventListener("click" , function(event) {
        event.preventDefault();
        // console.log("---------------")
        window.location.href = `/api/login`;
    })

    signupBtn.addEventListener("click" , function(event){
        event.preventDefault();
        // console.log("+++++++++++++++")
        window.location.href = `/api/signup`;
    });
});
