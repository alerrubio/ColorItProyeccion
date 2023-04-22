$(document).ready(function(){
    var user = JSON.parse(localStorage.getItem("user"));

    document.getElementById("username").innerHTML = user["username"];
});