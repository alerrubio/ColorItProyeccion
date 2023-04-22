$(document).ready(function(){
    var user = JSON.parse(localStorage.getItem('user'));
    var my_score = localStorage.getItem("my_score");
    var opp_score = localStorage.getItem("opponent_score");
    
    document.getElementById("my_name").innerHTML = user["username"];
    document.getElementById("my_score").innerHTML = "Terreno pintado: " + my_score;
    document.getElementById("opponent_score").innerHTML = "Terreno pintado: " + opp_score;

});