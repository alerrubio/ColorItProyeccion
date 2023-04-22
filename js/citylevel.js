$(document).ready(function(){
    var currentSettings = JSON.parse(localStorage.getItem("settings"));
    var user = JSON.parse(localStorage.getItem("user"));

    document.getElementById("my_name").innerHTML = user["username"];
    var bgMusic = new Audio('resources/citylevel.mp3');
    bgMusic.volume = currentSettings.volume;
    bgMusic.play();
});