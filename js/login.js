function addUser(){
    var dataToSend = {
        action: 'addUser',
        user_name: $("#usernameR").val(),
        user_email: $("#emailR").val(),
        user_pw: $("#pwR").val()
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
                    title: 'Usuario creado',
                    showConfirmButton: false,
                    timer: 1500
                  });
                  setInterval(function(){
                    window.location.replace("index.html");
                    
                }, 1000);
                  
            }else if (data["result"] == 'error'){
                Swal.fire({
                    icon: 'error',
                    title: 'Error al registrar la cuenta, inténtelo de nuevo',
                    showConfirmButton: false,
                    timer: 1500
                  });
            }
            
            
        },
        error: function(x, y, x){
            Swal.fire({
                icon: 'error',
                title: 'El correo electrónico ya está registrado',
                showConfirmButton: false,
                timer: 1500
              });
        }
    });
}

function logIn(){
    var dataToSend = {
        action: 'login',
        user_email: $("#emailLog").val(),
        user_pw: $("#pwLog").val()
    }

    $.ajax({
        url: './web-server/db.php',
        async: true,
        type: 'POST',
        data: dataToSend,
        crossDomain: true,
        dataType: 'json',

        success: function(data){
            if (data['result'] == 'found') {
                if (data[0]["pw"] == dataToSend.user_pw) {
                    console.log(data);
                    localStorage.setItem("user", JSON.stringify(data[0]));
                    window.location.replace("menu.html");
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Credenciales incorrectas',
                        showConfirmButton: false,
                        timer: 1500
                      });
                }
            }
            else{
                Swal.fire({
                    icon: 'error',
                    title: 'El usuario no existe',
                    showConfirmButton: false,
                    timer: 1500
                  });
            }
        },
        error: function(x, y, z){
            Swal.fire({
                icon: 'error',
                title: x+y+z,
                showConfirmButton: false,
                timer: 1500
              });
        }
    });
}

function checkUser(){
    var dataToSend = {
        action: 'check',
        user_email: $("#emailR").val()
    }

    $.ajax({
        url: './web-server/db.php',
        async: true,
        type: 'POST',
        data: dataToSend,
        dataType: 'json',
        success: function(data){
            if (data["result"] == "found") {
                Swal.fire({
                    icon: 'error',
                    title: 'El correo electrónico ya está registrado',
                    showConfirmButton: false,
                    timer: 1500
                  });
            }
            else{
                addUser();
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

function activateRegister(){
    $("#registro").toggle();
    $("#login").toggle();
    $("#registerbtn").toggle();
    $("#loginbtn").toggle();
    $(".register-opt").toggle();
    $(".login-opt").toggle();
    playClick();
}
function validateInputs(){
    playClick();
    if (($("#emailLog").val().length && $("#emailLog").length) &&
        ($("#pwLog").val().length && $("#pwLog").length)){
        setTimeout(function(){logIn();},250);
        
    }else{
        setTimeout(function(){
            Swal.fire({
                icon: 'error',
                title: 'Llene todos los campos',
                showConfirmButton: false,
                timer: 1500
              });
        },100);
    }
}
function validateInputsRegister(){
    playClick();
    if (($("#usernameR").val().length && $("#usernameR").length) &&
        ($("#emailR").val().length && $("#emailR").length) &&
        ($("#pwR").val().length && $("#pwR").length)){
        setTimeout(function(){checkUser();},250);
    }else{
        setTimeout(function(){Swal.fire({
            icon: 'error',
            title: 'Llene todos los campos',
            showConfirmButton: false,
            timer: 1500
          });},100);
    }
}
$(document).ready(function(){
    /*var bgMusic = new Audio('resources/bg-music.mp3');
    bgMusic.volume = 0.01;
    bgMusic.play();*/
    $("#registro").hide();
});
