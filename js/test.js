var scene;
var camera;
var renderer;
var controls;
var objects = [];
var clock;
var deltaTime;	
var keys = {};
var posAmy;

var rayCaster;
var objetosConColision=[];
var objetosConColision2=[];
var pisoConColision=[];

//Animaciones Amy
var mixers2 = [];
var run2, defeated2, victory2, idle2;
var flag2;
var Amy;

//Valores de settings
var currentSettings = JSON.parse(localStorage.getItem("settings"));
var c2 = currentSettings.p2color;

//Cubos
var cube, cube2, cube3, cube4;

//PaintPisos
var paint = [];

//Edificios
var edificios;
var hotel;
var apartment;
var hotelPequenio;
var planoPiso;
var loadingScreenPlane;

//Items
var item1;
var itemBB;
var amyBB;

var faster = {
	a:false,
	contador: 0,
	duracion: 3,
	speed: 20
};

var faster2 = {
	a:false,
	contador: 0,
	duracion: 3,
	speed: 20
};

const textureloaders = new THREE.TextureLoader();
var normales = textureloaders.load('resources/paint-normal.jpg');

//Materiales de personajes
var materialAmy = new THREE.MeshStandardMaterial({	color: new THREE.Color(c2), opacity: 0.9, transparent:true,
	normalMap:normales, metalness: 0.9, roughness: 0.4, emissive: new THREE.Color(c2), emissiveIntensity: 0.7});

//Variables de puntuaciones
var scoreAmy = 0;

var isWorldReady = [ false, false, false, false, false, false, false, false ];

$(document).ready(function() {

	$(".scene_pause").hide();

	levelPicker('city');

	const loadingScreenContainer = document.getElementById( 'loadingScreenContainer' );
	const loadingScreen = document.getElementById( 'video' );
	
	setupScene();
	
	render();
		
	document.addEventListener('keydown', onKeyDown);
	document.addEventListener('keyup', onKeyUp);		
	
});


function loadOBJWithMTL(path, objFile, mtlFile, onLoadCallback) {
	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.setPath(path);
	mtlLoader.load(mtlFile, (materials) => {
		
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.setPath(path);
		objLoader.load(objFile, (object) => {
			onLoadCallback(object);
		});

	});
}

function onKeyDown(event) {
	keys[event.keyCode] = true;
	keyCollider = String.fromCharCode(event.keyCode);
}
function onKeyUp(event) {
	keys[event.keyCode] = false;
}



function render() {
	
	requestAnimationFrame(render);
	

	if(!isPaused){
		
	
		deltaTime = clock.getDelta();

		//AMY
		if(mixers2.length > 0){
			for(var i = 0; i<mixers2.length; i++){
				mixers2[i].update(deltaTime);
			}
			switch(flag2){
				case 1: 
					run2.weight = 1;
					defeated2.weight = 0;
					victory2.weight = 0;
					idle2.weight = 0;
				break;
				case 2: 
					run2.weight = 0;
					defeated2.weight = 1;
					victory2.weight = 0;
					idle2.weight = 0;
				break;
				case 3: 
					run2.weight = 0;
					defeated2.weight = 0;
					victory2.weight = 1;
					idle2.weight = 0;
				break;
				case 4: 
					run2.weight = 0;
					defeated2.weight = 0;
					victory2.weight = 0;
					idle2.weight = 1;
				break;
				default: 
					run2.weight = 0;
					defeated2.weight = 0;
					victory2.weight = 0;
					idle2.weight = 1;
				break;
			}
		}

		var yaw2 = 0;
		var forward2 = 0;
		
		
		//AMY
		if (keys[65]) {
			yaw2 = 3;

		} else if (keys[68]) {

			yaw2 = -3;

		}
		if (keys[87]) {
			console.log(Amy.position)
			forward2 = 0;
			flag2=1;
			if (!reproducirParticulas2) {
				reproducirParticulas2 = true;
				spawnParticulas2(Amy.position, c2);
			}

		} else if (!keys[87]) {

			forward2 = 0;
			flag2 = 4;
		}


			if (isWorldReady[0] && isWorldReady[1] && isWorldReady[2] && isWorldReady[3] && isWorldReady[4]
				&& isWorldReady[5] && isWorldReady[6] && isWorldReady[7]) {
				
			
				Amy = scene.getObjectByName("Amy");
				Amy.rotation.y += yaw2 * deltaTime;
				Amy.translateZ(forward2 * deltaTime);

				//Colisiones de Amy con los arrays
				for(var i = 0; i<Amy.rayos.length; i++){
					var rayo = Amy.rayos[i];
					rayCaster.set(Amy.position, rayo);
					var collision = rayCaster.intersectObjects(objetosConColision, true);

					if(collision.length > 0 && collision[0].distance < 4){
						//alert("sí hay colisión");
						Amy.translateZ(-forward2 * deltaTime);
					}

					//Array de piso
					var pisoPintado = rayCaster.intersectObjects(pisoConColision, true);
					if(pisoPintado.length > 0 && pisoPintado[0].distance < 2){
						//alert("sí hay colisión");
						pisoPintado[0].object.material = materialAmy;
						pisoPintado[0].needsUpdate = true;
						
						//Si es de michelle se le baja puntos a ella
						if(pisoPintado[0].object.painted==2){
							scoreMichelle--;
						}

						//Si no es de Amy se le sube puntuación
						if (pisoPintado[0].object.painted!=1){
							scoreAmy++;
						}

						pisoPintado[0].object.painted = 1;
					}
				}

				if(faster2.a == false){

					var powerup = scene.getObjectByName("Item");
					
					amyBB = new THREE.Box3().setFromObject(Amy.boxColAmy);
					//itemBB = new THREE.Box3().setFromObject(powerup.boxColItem);

					/*GOLPE CON ITEMS */
					ColisionConItem(powerup, itemBB, amyBB, faster2, 2);
					
				}
				
				DuracionPowerUp(faster2, deltaTime);

				//loadingScreenContainer.style.display = "none";

				
			if (reproducirParticulas2) {
				contadorAnim2 += deltaTime;
				particleSystem2.rotation.y += 0.001;
				if(contadorAnim2>=duracionParticula2){
					contadorAnim2 = 0;
					reproducirParticulas2 = false;
					scene.remove(particleSystem2);
				}
				
			}

			$("#score2").text(scoreAmy.toString());

		}
		renderer.render(scene, camera); 

		isWorldReadyReal = true;
	}

	
}

function setupScene() {		
	var visibleSize = { width: 1300, height: 650};
	clock = new THREE.Clock();		
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(65, visibleSize.width / visibleSize.height, 0.1, 300);
	camera.position.z = 30; //60
	camera.position.y = 0; //50
	camera.lookAt(0, 0, 0);

	renderer = new THREE.WebGLRenderer( {precision: "mediump" } );
	renderer.setClearColor(new THREE.Color(1, 1, 1));
	renderer.setPixelRatio(visibleSize.width / visibleSize.height);
	renderer.setSize(visibleSize.width, visibleSize.height);

	var ambientLight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 1.0);
	scene.add(ambientLight);

	var directionalLight = new THREE.DirectionalLight(new THREE.Color(1, 1, 1), 0.3);
	directionalLight.position.set(1, 10, 5);
	scene.add(directionalLight);

	var grid = new THREE.GridHelper(50, 10, 0xffffff, 0xffffff);
	grid.position.y = -1;
	//scene.add(grid);


	camera.rayos = [
		new THREE.Vector3(1, 0, 0),
		new THREE.Vector3(-1, 0, 0),
		new THREE.Vector3(0, 0, 1),
		new THREE.Vector3(0, 0, -1)
	];


	rayCaster = new THREE.Raycaster();
	

	//background sprites
	const map = new THREE.TextureLoader().load( 'assets/fondoCiudad.png' );
	const material = new THREE.SpriteMaterial( { map: map } );

	const sprite = new THREE.Sprite( material );
	sprite.scale.set(80,50,80);
	sprite.position.set(0,10,-130);

	const sprite2 = sprite.clone();
	const sprite3 = sprite.clone();
	const sprite4 = sprite.clone();
	const sprite5 = sprite.clone();
	const sprite6 = sprite.clone();
	const sprite7 = sprite.clone();

	sprite2.position.set(80,10,-130);
	sprite3.position.set(-80,10,-130);
	sprite4.position.set(160,10,-130);
	sprite5.position.set(-160,10,-130);
	sprite6.position.set(230,10,-130);
	sprite7.position.set(-240,10,-130);

	//scene.add( sprite );
	//scene.add( sprite2 );
	//scene.add( sprite3 );
	//scene.add( sprite4 );
	//scene.add( sprite5 );
	//scene.add( sprite6 );
	//scene.add( sprite7 );

	isWorldReady[0] = true;

	//Plano de asfalto
	var materialAsfalto = new THREE.MeshLambertMaterial({color: new THREE.Color(0.207843, 0.207843, 0.207843)});
	var geometry = new THREE.BoxGeometry(800, 0.1, 500);
	planoPiso = new THREE.Mesh(geometry, materialAsfalto);
	planoPiso.position.set(0,-20, 100);
	//scene.add(planoPiso);

	var materialColision = new THREE.MeshLambertMaterial({opacity: 0.0, transparent:true});
	var geometry2 = new THREE.BoxGeometry(25, 10, 0.2);
	cube = new THREE.Mesh(geometry2, materialColision)
	cube.position.set(0,10,-38);
	cube.scale.set(5,5,25);

	cube2 = cube.clone();
	cube2.position.set(0,10,38);


	cube3 = cube.clone();
	cube3.rotation.y = THREE.Math.degToRad(90);		
	cube3.position.set(-60,10,8);

	cube4 = cube3.clone();
	cube4.position.set(60,10,8);

	//scene.add(cube);
	//scene.add(cube2);
	//scene.add(cube3);
	//scene.add(cube4);

	objetosConColision.push(cube,cube2,cube3,cube4);
	objetosConColision2.push(cube,cube2,cube3,cube4);

	var materialPaint = new THREE.MeshPhongMaterial({color: new THREE.Color(0, 1, 0), opacity: 0.0, transparent:true, shininess: 60});
	var geometry3 = new THREE.BoxGeometry(24, 0.1, 15);

	var paintx = -44;
	var paintz = -28;

	for(let i = 0; i<5; i++){
		
		paint[i] = new Array()

		for(let j = 0; j<5; j++){
			paint[i][j] = new THREE.Mesh(geometry3, materialPaint);
			paint[i][j].position.set(paintx, 0.1, paintz);
			paintx += 24;
			//scene.add(paint[i][j]);
			paint[i][j].name = i.toString() + " " + " " + j.toString();
			paint[i][j].painted = 0;
			pisoConColision.push(paint[i][j]);
			
		}
		paintx = -44;
		paintz += 15;
		
	}
	



	isWorldReady[1] = true;

	//cargando modelos
	//Cargando hotel de plataforma principal
	loadOBJWithMTL("assets/", "Hotel(3star).obj", "Hotel(3star).mtl", (hotel) => {
		hotel.position.z = 0;
		hotel.name = 'Hotel';
		hotel.scale.set(8,5,8);
		hotel.rotation.y = THREE.Math.degToRad(90);
		hotel.position.set(0,-120,0);
		//scene.add(hotel);

		//Hotel de fondo
		hotelPequenio = hotel.clone();
		hotelPequenio.rotation.y = THREE.Math.degToRad(-90);
		hotelPequenio.scale.set(1,1,1);
		hotelPequenio.position.set(-32, -2, -55);
		//scene.add(hotelPequenio);
		
		isWorldReady[2] = true;
	});
	
	//Cargando apartamentos de fondo
	loadOBJWithMTL("assets/", "Apartment Building_26_obj.obj", "Apartment Building_26_obj.mtl", (apartment) => {
		apartment.name = 'apartment';
		apartment.scale.set(0.03,0.03,0.03);
		apartment.rotation.y = THREE.Math.degToRad(90);
		apartment.position.set(50, 0, -55);
		//scene.add(apartment);

		apartment2 = apartment.clone();
		apartment2.position.set(-60,0,-65);
		apartment2.rotation.y = THREE.Math.degToRad(-90);

		apartment3 = apartment.clone();
		apartment3.position.set(75,-2,30);
		apartment3.rotation.y = THREE.Math.degToRad(180);

		apartment4 = apartment.clone();
		apartment4.position.set(-83,-3,0);
		apartment4.scale.set(0.05,0.03,0.05);
		apartment4.rotation.y = THREE.Math.degToRad(-270);

		//scene.add(apartment2);
		//scene.add(apartment3);
		//scene.add(apartment4);

		isWorldReady[3] = true;
	});

	//Cargando a Amy
	var amy_loader = new THREE.FBXLoader();
	
	amy_loader.load('assets/Amy.fbx', function(Amy){

		Amy.mixer = new THREE.AnimationMixer(Amy);
		mixers2.push(Amy.mixer);

		run2 = Amy.mixer.clipAction(Amy.animations[0]);
		defeated2 = Amy.mixer.clipAction(Amy.animations[1]);
		victory2 = Amy.mixer.clipAction(Amy.animations[2]);
		idle2 = Amy.mixer.clipAction(Amy.animations[3]);

		run2.play();
		defeated2.play();
		victory2.play();
		idle2.play();

		Amy.position.set( 0.11175490621635953, -5, 10.027033546836014);
		Amy.scale.set(0.1,0.1,0.1);

		Amy.rayos = [
		new THREE.Vector3(1, 0.11, 0),
		new THREE.Vector3(-1, 0.11, 0),
		new THREE.Vector3(0, 0.11, 1),
		new THREE.Vector3(0, 0.11, -1)
		];

		objetosConColision2.push(Amy);

		var boxCol = new THREE.BoxGeometry(70, 300, 70);
		var boxMaterial = new THREE.MeshLambertMaterial({
			color: new THREE.Color(1, 1, 1)
		});
		Amy.boxColAmy = new THREE.Mesh(boxCol, boxMaterial);
		Amy.boxColAmy.visible = false;
		Amy.add(Amy.boxColAmy);

		Amy.name = 'Amy';
		scene.add(Amy);

		isWorldReady[4] = true;
	});

	

	//Cargando los conjuntos de edificios
	var loader3 = new THREE.FBXLoader();
	loader3.load('assets/LowPolyCITY.fbx', function(edificios){


		edificios.position.set(10, 0, -70);
		edificios.scale.set(0.2,0.2,0.1);

		edificios.name = 'City';
		//scene.add(edificios);

		edificios2 = edificios.clone();
		edificios2.scale.set(0.1,0.2,0.2);
		edificios2.position.set(-100, 0, -50);
		//scene.add(edificios2);

		edificios3 = edificios.clone();
		edificios3.scale.set(0.1,0.2,0.2);
		edificios3.position.set(82, 0, -20);
		//scene.add(edificios3);
		
		edificios4 = edificios.clone();
		edificios4.scale.set(0.2,0.2,0.2);
		edificios4.position.set(130, 0, -20);
		edificios4.rotation.y = THREE.Math.degToRad(-90);
		//scene.add(edificios4);

		edificios5 = edificios.clone();
		edificios5.scale.set(0.1,0.1,0.1);
		edificios5.position.set(-85, -3, 28);
		edificios5.rotation.y = THREE.Math.degToRad(-90);
		//scene.add(edificios5);

		isWorldReady[5] = true;
	});

	//Cargando los arboles
	var loader4 = new THREE.FBXLoader();
	loader4.load('assets/Tree.fbx', function(arbol){


		arbol.position.set(65, 0, -50);
		arbol.scale.set(0.01,0.01,0.01);

		arbol.name = 'Arbol';
		//scene.add(arbol);

		arbol2 = arbol.clone();
		arbol2.position.set(-50, 0, -50);

		arbol3 = arbol.clone();
		arbol3.position.set(-70, 0, -50);

		arbol4 = arbol.clone();
		arbol4.position.set(10, 0, -55);

		arbol5 = arbol.clone();
		arbol5.position.set(-160, 0, -50);

		arbol6 = arbol.clone();
		arbol6.position.set(-77,-9,-30);

		arbol7 = arbol.clone();
		arbol7.position.set(69, -4, 15);

		//scene.add(arbol2);
		//scene.add(arbol3);
		//scene.add(arbol4);
		//scene.add(arbol5);
		//scene.add(arbol6);
		//scene.add(arbol7);

		isWorldReady[6] = true;
	});
	
	
	//Cargando ítems especiales
	var itemX = 0;
	var itemZ = 0;
	CargarItems("Item1", itemX, itemZ, 1);

	isWorldReady[7] = true;

	$("#scene-section").append(renderer.domElement);
}

function CargarItems(item, x, z, colores){

	loadOBJWithMTL("assets/", item+".obj", item+".mtl", (item1) => {
	
		
		var boxMaster = new THREE.BoxGeometry(5, 5, 5);

	
		var boxMaterial = new THREE.MeshLambertMaterial({
			color: colores
		});

		//item1 = new THREE.Mesh(boxMaster, boxMaterial);
		item1.scale.set(0.015, 0.015, 0.015);
		item1.name = 'Item';
		item1.item = item;
		item1.position.set(x, 5, z);
		item1.boxColItem = new THREE.Mesh(boxMaster, boxMaterial);

		console.log(item1);
		//item1.boxColItem.visible = false;
		
		item1.add(item1.boxColItem);
		//scene.add(item1);
	});

	
	
}

/*LÓGICA DE ITEMS */
function ColisionConItem(itemOrigi, itemBB, playerBB, fast){
	/* if(itemBB.intersectsBox(playerBB)){
		console.log("qué pdo?");
		fast.a = true;
		//console.log(itemOrigi.name);
		switch(itemOrigi.item){

			case 'Item1':
				fast.speed = 35;
				break;

			case 'Item2':
				fast.speed = 10;
				break;
			
			case 'Item3':
				scoreAmy +=10;
				break;

			default: 
			console.log("nothing");
				break;
		}

		scene.remove(itemOrigi);
		
	} */
}

function CrearItemNuevo(){
	

	var probabilidad = (Math.floor(Math.random()*100));
	var myNumber = (Math.floor(Math.random()*100) -50);
	var myNumber2 = (Math.floor(Math.random()*56)-28);
	
	if(probabilidad>=0 && probabilidad <=50){

		var color = new THREE.Color(1, 0, 0);
		CargarItems("Item1", myNumber, myNumber2, color);

	} 
	else if(probabilidad>50 && probabilidad <=95){

		var color = new THREE.Color(0, 1, 0);
		CargarItems("Item2", myNumber, myNumber2, color);

	}
	else if(probabilidad>96 && probabilidad <=100){

		var color = new THREE.Color(0, 0, 1);
		CargarItems("Item3", myNumber, myNumber2, color);

	}
}

function DuracionPowerUp(fast, Time){
	if(fast.a==true){

		fast.contador += Time;
		if (fast.contador >= fast.duracion) {

			fast.a = false;
			fast.speed = 20;
			fast.contador = 0;
			CrearItemNuevo();
			
		}
	}
}

