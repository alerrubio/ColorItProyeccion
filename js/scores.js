var user;
var opponent;

function getScore(){

    var dataToSend = {
        action: 'getS',
        user_id: user['id']
    }

    $.ajax({
        url: './web-server/db.php',
        async: true,
        type: 'POST',
        data: dataToSend,
        dataType: 'json',
        success: function(data){
            if (data["result"] == "found") {
                var highScore = false;
                for (var key in data[0]){
                    if (highScore == false){
                        $(".player-scores").append(`
                        <div class="scores col-12 d-flex flex-row justify-content-center align-items-center">
                            <div class="mode col-4">Modo de juego: `+data[0][key]["game_mode"]+`
                            <div class="mode col-12">Personaje: `+data[0][key]["player_char"]+`</div>
                            </div>
                            <div class="level col-4">`+data[0][key]["score_level"]+`</div>
                            <div id="highScore" class="points col-4">`+data[0][key]["score"]+` puntos</div>
                        </div>
                        `);
                    }else{
                        highScore = true;
                        $(".player-scores").append(`
                        <div class="scores col-12 d-flex flex-row justify-content-center align-items-center">
                            <div class="mode col-4">Modo de juego: `+data[0][key]["game_mode"]+`
                            <div class="mode col-12">Personaje: `+data[0][key]["player_char"]+`</div>
                            </div>
                            <div class="level col-4">`+data[0][key]["score_level"]+`</div>
                            <div class="points col-4">`+data[0][key]["score"]+` puntos</div>
                        </div>
                        `);
                    }
                    
                    
                }
            }
        },
        error: function(x, y, x){
            Swal.fire({
                icon: 'error',
                title: x+y,
                showConfirmButton: false,
                timer: 1500
              });
        }
    });
}

function addScore(level, gamemode){
    var dataToSend = {
        action: 'addScore',
        my_score: $(".score2").text(),
        my_id: user['id'],
        game_mode: gamemode,
        character: 'Amy',
        level: level
    }

    $.ajax({
        url: './web-server/db.php',
        async: true,
        type: 'POST',
        data: dataToSend,
        dataType: 'json',
        success: function(data){
            if (data["result"] == 'success'){
                Swal.fire({
                    icon: 'success',
                    title: 'Game Over!',
                    showConfirmButton: false,
                    timer: 1500
                  });
            }else if (data["result"] == 'error'){
                Swal.fire({
                    icon: 'error',
                    title: 'No se pudo guardar la puntuación en la base de datos.',
                    showConfirmButton: false,
                    timer: 1500
                  });
            }
            
        },
        error: function(x, y, x){
            Swal.fire({
                icon: 'error',
                title: x,
                showConfirmButton: false,
                timer: 1500
              });
        }
    });
}

$(document).ready(function(){
    user = JSON.parse(localStorage.getItem('user'));
    opponent = localStorage.getItem('player_2_name');
    
    document.getElementById("opponent_name").innerHTML = opponent;
    
    getScore();
});