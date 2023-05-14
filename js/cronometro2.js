
var count = 0;
var myInterval;
var countdown = true;
var isPaused = false;
var myScore;
var oponentScore;
var isWorldReadyReal = false;

$(document).ready(function(){
    console.log("AAAAA");
    myInterval = setInterval(function(){
        if (isWorldReadyReal == true){
            cronometro();
        }
    }, 1000);
    
});

$(document).keypress(function(event){
    
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        if(countdown){
            playClick();
            countdown = false;
            clearInterval(myInterval);

            $("#scene-section").hide();
            
            $(".scene_pause").show();
            
            isPaused = true;
            
            

        }
        else if(!countdown){
            playClick();
            resume();
            console.log("2do enter");

        }
    }
    
});

function cronometro(){
    var gamemode = document.getElementById("game-mode").innerHTML;
    var level = document.getElementById("level-name").innerHTML;

    if (count>0){
        count--;
    }

    if (gamemode == 'Solo-Paint'){
        if (level == 'Brush Island'){
            if (scoreAmy  >= 99){
                localStorage.setItem("my_score", $(".score2").text());
                addScore(level, gamemode);
                window.location.replace("scores_single_player.html");
            }
        }else if(level == 'Paint Court'){
            if (scoreAmy  >= 45){
                localStorage.setItem("my_score", $(".score2").text());
                addScore(level, gamemode);
                window.location.replace("scores_single_player.html");
            }
        }else if(level == 'Color City'){
            if (scoreAmy  >= 25){
                localStorage.setItem("my_score", $(".score2").text());
                addScore(level, gamemode);
                window.location.replace("scores_single_player.html");
            }
        }
    }
    $("#countdown").empty();
    $("#countdown").append(count);
    
}

function resume(){
    countdown = true;
    myInterval = setInterval(function(){
        cronometro();
    }, 1000);
    
    $("#scene-section").show();
    
    $(".scene_pause").hide();

    isPaused = false;
}

function levelPicker(level){
    if (level == 'beach'){
        count = 62;
    }else if (level == 'city'){
        count = 32;
    }else if (level == 'court'){
        count = 62;
    }
}