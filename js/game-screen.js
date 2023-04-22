//Colección de objeto dibujables en ThreeJS
var scene;

//dibuja los objetos que estén en una escena
var renderer;

//Es el espectador
var camera;

$(document).ready(function() {
    var tamanoCanvas = 
    {
        ancho: window.innerWidth,
        alto: window.innerHeight
    }

    //Inicializamos el renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0.5, 0, 0.8));
    renderer.setSize(tamanoCanvas.ancho, tamanoCanvas.alto);

    //Inicializamos la cámara
    camera = new THREE.PerspectiveCamera(
        75,
        tamanoCanvas.ancho / tamanoCanvas.alto,
        0.1,
        100
    );

    //Inicializamos la escena
    scene = new THREE.Scene();

    //Cambiamos de posición la cámara para poder ver lo que
    //estamos dibujando
    camera.position.set(0, 0, 2);

    //Sirve para guardar los vértices y demás
    var geometria = new THREE.BoxGeometry(1, 1, 1);

    //Sirve para guardar los datos del material
    var material = new THREE.MeshLambertMaterial({
        color: new THREE.Color(0, 0.7, 0.5)
    });

    //Combinación de geometría y material (es el objeto final)
    var miCubo = new THREE.Mesh(geometria, material);

    //Agregamos nuestro cubo (u objeto) en la escena
    scene.add(miCubo);


    var material2 = new THREE.MeshPhongMaterial({
        color: new THREE.Color(0.6, 0.2, 0.4),
        specular: new THREE.Color(1, 0, 1),
        shininess: 500
    });

    var material3 = new THREE.MeshLambertMaterial({
        color: new THREE.Color(0.6, 0.8, 0.1),
        specular: new THREE.Color(1, 0, 1),
        shininess: 500
    });
    var miCubo2 = new THREE.Mesh(geometria, material2);

    scene.add(miCubo2);

    miCubo.position.x = -2;
    miCubo2.position.x = 2;

    //Agregar fuentes de iluminación
    var luzAmbiental = new THREE.AmbientLight(
        new THREE.Color(1, 1, 1),
        1.0
    );

    var luzDireccional = new THREE.DirectionalLight(
        new THREE.Color(1, 1, 1),
        0.4
    );

    luzDireccional.position.set(0, 0, 1);

    scene.add(luzAmbiental);
    scene.add(luzDireccional);

    miCubo.name = "cubo1";
    miCubo2.name = "cubo2";

    //Clonación
    var miCubo3 = miCubo2.clone();
    miCubo3.material = material3;
    miCubo3.position.set(0,1,-2);

    scene.add(miCubo3);

    //Le indicamos a three js en dónde poner el canvas
    $("#scene-section").append(renderer.domElement);


    render(tamanoCanvas);
});
var flag = false;
function render() {
    /*
    Reproducir animaciones
    Validar colisiones
    Actualizar las posiciones de los personajes
    Detectar teclas
    */

    var miCubo01 = scene.getObjectByName("cubo1");
    var miCubo02 = scene.getObjectByName("cubo2");

    
    if (flag == true){
        miCubo01.position.x -= 0.05;
        miCubo01.rotation.y -= THREE.Math.degToRad(1);
        miCubo02.position.x += 0.05;
        miCubo02.rotation.y += THREE.Math.degToRad(1);
        if (miCubo01.position.x < -2 && miCubo02.position.x > 2){
            flag = false;
        }
    }else{
        miCubo01.position.x += 0.05;
        miCubo01.rotation.y += THREE.Math.degToRad(1);
        miCubo02.position.x -= 0.05;
        miCubo02.rotation.y -= THREE.Math.degToRad(1);
        if (miCubo01.position.x > 2 && miCubo02.position.x < -2){
            flag = true;
        }
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}