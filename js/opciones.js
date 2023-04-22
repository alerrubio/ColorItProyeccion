$(document).ready(function(){
    $(function() {
        var rangePercent = $('[type="range"]').val();
        $('#sensibility').html(rangePercent);
        $('[type="range"], h4>span').css('filter', 'hue-rotate(-' + rangePercent + 'deg)');
        
        $('[type="range"]').on('change input', function() {
            rangePercent = $('[type="range"]').val();
            $('#sensibility').html(rangePercent);
            $('[type="range"], h4>span').css('filter', 'hue-rotate(-' + rangePercent + 'deg)');
        });
    });
});

function saveSettings(){
    var color1;
    var color2;
    var elvolumen;
    var spcontrols;

    $(document).on("click", "#saveSettings", function(){
        color1 = $("[name='color_opt1']:checked").val();
        color2 = $("[name='color_opt2']:checked").val();
        elvolumen = $('[type="range"]').val();
        spcontrols = $("[name='move_options']:checked").val();

        var userSettings = new Settings(color1, color2, elvolumen*0.002, spcontrols);
        localStorage.setItem("settings", JSON.stringify(userSettings));

        Swal.fire({
            icon: 'success',
            title: 'Ajustes guardados',
            showConfirmButton: false,
            timer: 1500
          });

    });



}

function loadSettings(){
    var currentSettings = JSON.parse(localStorage.getItem("settings"));

    switch(currentSettings.p1color) {
        case "rgb(255, 48, 48)":
            $("#c1").prop("checked", true);
          break;
        case "rgb(255, 255, 0)":
            $("#c2").prop("checked", true);
          break;
        case "rgb(0, 255, 0)":
            $("#c3").prop("checked", true);
          break;
        default:
            $("#c1").prop("checked", true);
      }

      switch(currentSettings.p2color) {
        case "rgb(36, 120, 255)":
            $("#c4").prop("checked", true);
          break;
        case "rgb(255, 43, 237)":
            $("#c5").prop("checked", true);
          break;
        case "rgb(255, 132, 0)":
            $("#c6").prop("checked", true);
          break;
        default:
            $("#c4").prop("checked", true);
      }

      $('[type="range"]').val(currentSettings.volume*500);

      if(currentSettings.controls=="wasd"){
        $("#spc1").prop("checked", true);
      } else{
        $("#spc2").prop("checked", true);
      }

}

function logOut(){
  localStorage.removeItem('settings'); 
  localStorage.removeItem('user'); 
  window.location.replace("index.html");
}

$(document).ready(saveSettings);
$(document).ready(loadSettings);
$(document).on("click", "#logOut", function(){
  logOut();
});



