$(document).ready(function(){
    $(".level").hide();
    $("#home").hide();
    

    if (localStorage.getItem("settings") === null) {
        var color1 = "rgb(255, 48, 48)";
        var color2 = "rgb(36, 120, 255)";
        var userSettings = new Settings(color1, color2, 0.1,"wasd");
        localStorage.setItem("settings", JSON.stringify(userSettings));
    }
    
    if(localStorage.getItem("settings") != null){
    var currentSettings = JSON.parse(localStorage.getItem("settings"));
    }

    var bgMusic = new Audio('resources/menuMusic.mp3');
    bgMusic.volume = currentSettings.volume;
    setTimeout(function(){bgMusic.play();},1000);

    $(document).on("click", "#solo_paint", function(){
        $(".singleplayer").toggle();
        $(".main-menu").toggle();
        $("#home").toggle();
        $("#puntuacion").toggle();
        gamemode = true;
    });

    $(document).on("click", "#paint_for_all", function(){
        $(".second_player").toggle();
        $(".main-menu").toggle();
        $("#home").toggle();
        $("#puntuacion").toggle();
        gamemode = false;
    });
    
    $(document).on("click", "#home", function(){
        $(".level").hide();
        $(".second_player").hide();
        $(".main-menu").toggle();
        $("#home").toggle();
        $("#puntuacion").toggle();
    });
});

function addPlayerTwo(){
    if ( $("#player_2_name").val().length && $("#player_2_name").length ){
        localStorage.setItem("player_2_name", $("#player_2_name").val());
        $(".multi").toggle();
        $(".main-menu").toggle();
        $("#puntuacion").toggle();
        $("#puntuacion").toggle();
        $("#solo_paint").hide();
        $("#paint_for_all").hide();
        $(".second_player").hide();
        gamemode = false;
    }else{
        Swal.fire({
            icon: 'error',
            title: 'Escriba el nombre del jugador 2',
            showConfirmButton: false,
            timer: 1500
          });
    }
}
