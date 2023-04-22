var scene;
var camera;
var renderer;
var controls;
var objects = [];
var clock;
var deltaTime;	
var keys = {};

var worldLoaded = false;
var rayCaster;
var objetosConColision=[];
var objetosConColision2=[];
var personajesConColision=[];
var pisoConColision=[];

//Animaciones Amy
var mixers2 = [];
var run2, defeated2, victory2, idle2;
var flag2;
var Amy;

//Valores de settings
var currentSettings = JSON.parse(localStorage.getItem("settings"));
var c2 = currentSettings.p2color;


//PaintPisos
var paint = [];
var materialPaint = new THREE.MeshPhongMaterial({color: new THREE.Color(0, 1, 0), opacity: 0.0, transparent:true, shininess: 60});

//Cangrejo
var Cangrejo;
var mixers3 = [];
var walking;

//Cubos
var cubo1, cubo2, cubo3, cubo4;

//Edificios
var edificios;
var hotel;
var apartment;
var planoPiso;
var loadingScreenPlane;

//Colisiones IA
var cangrejoBC;
var cangrejoBM;
var amyBB;
var choque;

//Inmunidad
var inmunidadContadorA = 0;
var inmunidadDuracionA = 3;
var limiteA;

//Items
var item1;
var itemBB;


var faster2 = {
	a:false,
	contador: 0,
	duracion: 3,
	speed: 20,
	enemy: 12
};


const textureloaders = new THREE.TextureLoader();
var normales = textureloaders.load('resources/paint-normal.jpg');

//Materiales de personajes
	var materialAmy = new THREE.MeshStandardMaterial({	color: new THREE.Color(c2), opacity: 0.8, transparent:true,
		normalMap:normales, metalness: 0.4, roughness: 0.5, emissive: new THREE.Color(c2), emissiveIntensity: 0.3});


//Variables de puntuaciones
var scoreAmy = 0;

var isWorldReady = [ false, false, false, false, false, false, false, false, false ];

$(document).ready(function() {

	$(".scene_pause").hide();

	levelPicker('beach');

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

		if(mixers3.length > 0){
			for(var i = 0; i<mixers3.length; i++){
				mixers3[i].update(deltaTime);
			}
			walking.weight = 1;
		}

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

			forward2 = faster2.speed;
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
		&& isWorldReady[5] && isWorldReady[6] && isWorldReady[7] && isWorldReady[8]) {
			
			
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

			
			Cangrejo = scene.getObjectByName("Cangrejo");
			

			cangrejoBM = new THREE.Box3().setFromObject(Cangrejo.boxMaster);
			cangrejoBC = new THREE.Box3().setFromObject(Cangrejo.boxCol1);
			amyBB = new THREE.Box3().setFromObject(Amy.boxColAmy);
			

			
			Cangrejo.lookAt(Amy.position.x, 9.5, Amy.position.z);
			Cangrejo.translateZ(faster2.enemy * deltaTime);

			if(cangrejoBM.intersectsBox(amyBB)){

				if(Amy.inmunidad==false){
					Amy.inmunidad=true;	
					if(scoreAmy<=5){
						limiteA = scoreAmy;
						
					}
					else
					{
						limiteA = 5;
					}

					loop1:
					for(let i = 0; i<11; i++){							
						for(let j = 0; j<9; j++){
							if(paint[i][j].painted==1){
								if(limiteA>0){
									limiteA--;
									scoreAmy--;
									paint[i][j].painted=0;
									paint[i][j].material = materialPaint;
									if (!pPlay) {
										spawnParticleEffect(paint[i][j].position, "resources/white-splatter.png",
										"rgb(0, 0, 0)",10,4);
									}
								}
								if(limiteA==0){
									pPlay = true;
									break loop1;
								}
							}
						}				
					}

				}
			}

			
			if(faster2.a == false){

				var powerup = scene.getObjectByName("Item");
				itemBB = new THREE.Box3().setFromObject(powerup.boxColItem);

				/*GOLPE CON ITEMS */
				ColisionConItem(powerup, itemBB, amyBB, faster2);
				
			}
			DuracionPowerUp(faster2, deltaTime);


			if(Amy.inmunidad==true){
				inmunidadContadorA += deltaTime;
				if (inmunidadContadorA >= inmunidadDuracionA) {
					Amy.inmunidad = false;
					inmunidadContadorA = 0;
				}

			}
			

			loadingScreenContainer.style.display = "none";

			if (reproducirParticulas2) {
				contadorAnim2 += deltaTime;
				particleSystem2.rotation.y += 0.001;
				if(contadorAnim2>=duracionParticula2){
					contadorAnim2 = 0;
					reproducirParticulas2 = false;
					scene.remove(particleSystem2);
				}
				
			}

			if (pPlay) {
				pCounter += deltaTime;
				pSystem.rotation.y += 0.001;
				if(pCounter>=pDuration){
					pCounter = 0;
					pPlay = false;
					pArray.forEach(function(partic){
						scene.remove(partic);
						
					});
					pArray=[];
					//scene.remove(pArray);
				}
				
			}

		}

		$("#score2").text(scoreAmy.toString());
				
		renderer.render(scene, camera);
		isWorldReadyReal = true;
	}
	
}

function setupScene() {		
	var visibleSize = { width: 1300, height: 650};
	clock = new THREE.Clock();		
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, visibleSize.width / visibleSize.height, 0.1, 300);
	camera.position.z = 60;
	camera.position.y = 50;
	camera.lookAt(0, 0, 0);

	renderer = new THREE.WebGLRenderer( {precision: "mediump" } );
	renderer.setClearColor(new THREE.Color(0, 0.933333, 1));
	renderer.setPixelRatio(visibleSize.width / visibleSize.height);
	renderer.setSize(visibleSize.width, visibleSize.height);

	var ambientLight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 1.0);
	scene.add(ambientLight);

	var directionalLight = new THREE.DirectionalLight(new THREE.Color(1, 1, 1), 0.5);
	directionalLight.castShadow = true;
	directionalLight.position.set(90, 32, -100);
	scene.add(directionalLight);


	camera.rayos = [
		new THREE.Vector3(1, 0, 0),
		new THREE.Vector3(-1, 0, 0),
		new THREE.Vector3(0, 0, 1),
		new THREE.Vector3(0, 0, -1)
	];

	rayCaster = new THREE.Raycaster();
	

	//background sprites
	const map = new THREE.TextureLoader().load( 'assets/cloud.png' );
	const material = new THREE.SpriteMaterial( { map: map } );

	const sprite = new THREE.Sprite( material );
	sprite.scale.set(40,30,40);
	sprite.position.set(0,25,-150);

	const sprite2 = sprite.clone();
	const sprite3 = sprite.clone();
	const sprite4 = sprite.clone();
	const sprite5 = sprite.clone();
	const sprite6 = sprite.clone();
	const sprite7 = sprite.clone();

	sprite2.position.set(80,25,-150);
	sprite3.position.set(-80,25,-150);
	sprite4.position.set(160,25,-150);
	sprite5.position.set(-160,25,-150);
	sprite6.position.set(230,25,-150);
	sprite7.position.set(-240,25,-150);

	scene.add( sprite );
	scene.add( sprite2 );
	scene.add( sprite3 );
	scene.add( sprite4 );
	scene.add( sprite5 );
	scene.add( sprite6 );
	scene.add( sprite7 );

	isWorldReady[0] = true;

	var normales = textureloaders.load('resources/waternormal.png');
	normales.repeat.set(6,6);
	normales.wrapS = normales.wrapT = THREE.RepeatWrapping;
	//Plano de agua
	var agua = new THREE.MeshStandardMaterial({
		color: new THREE.Color(0.203921, 0.309803, 0.921568),
		normalMap: normales,
		roughness: 0.3,
		metalness: 0.7,
		emissive: new THREE.Color("rgb(0, 102, 255)"),
		emissiveIntensity: 0.5,
	});
	var geometry = new THREE.BoxGeometry(410, 0.1, 300);
	planoPiso = new THREE.Mesh(geometry, agua);
	planoPiso.position.set(-205,-20, -80);
	planoPiso2 = planoPiso.clone();
	planoPiso2.position.set(205,-20, -80);
	scene.add(planoPiso);
	scene.add(planoPiso2);

	var materialColision = new THREE.MeshLambertMaterial({opacity: 0.0, transparent:true});
	var geometry = new THREE.BoxGeometry(25, 10, 0.2);
	cube = new THREE.Mesh(geometry, materialColision)
	cube.position.set(0,10,-38);
	cube.scale.set(5,5,25);

	cube2 = cube.clone();
	cube2.position.set(0,10,45);


	cube3 = cube.clone();
	cube3.rotation.y = THREE.Math.degToRad(90);		
	cube3.position.set(-50,10,8);

	cube4 = cube3.clone();
	cube4.position.set(60,10,8);

	scene.add(cube);
	scene.add(cube2);
	scene.add(cube3);
	scene.add(cube4);

	objetosConColision.push(cube,cube2,cube3,cube4);
	objetosConColision2.push(cube,cube2,cube3,cube4);

	
	var geometry3 = new THREE.BoxGeometry(12, 0.1, 7);

	var paintx = -44;
	var paintz = -34;

	for(let i = 0; i<11; i++){
		
		paint[i] = new Array()

		for(let j = 0; j<9; j++){
			paint[i][j] = new THREE.Mesh(geometry3, materialPaint);
			paint[i][j].position.set(paintx, 7, paintz);
			paintx += 12;
			scene.add(paint[i][j]);
			paint[i][j].name = i.toString() + " " + " " + j.toString();
			paint[i][j].painted = 0;
			pisoConColision.push(paint[i][j]);
			
		}
		paintx = -44;
		paintz += 7;
		
	}

	isWorldReady[1] = true;

	//cargando modelos
	//Cargando hotel de plataforma principal

	loadOBJWithMTL("assets/", "island.obj", "island.mtl", (isla) => {
	isla.position.set(-10, -30, -20);
		isla.scale.set(0.08,0.06,0.08);
		isla.name = 'Island';
		scene.add(isla);
		isWorldReady[2] = true;
		isWorldReady[3] = true;
		isWorldReady[4] = true;
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

		Amy.position.set(-40, 7, -28);
		Amy.scale.set(0.1,0.1,0.1);


		Amy.rayos = [
		new THREE.Vector3(1, 0.11, 0),
		new THREE.Vector3(-1, 0.11, 0),
		new THREE.Vector3(0, 0.11, 1),
		new THREE.Vector3(0, 0.11, -1)
		];


		objetosConColision2.push(Amy);
		personajesConColision.push(Amy);
		
		Amy.name = 'Amy';

		var boxCol = new THREE.BoxGeometry(70, 300, 70);
		var boxMaterial = new THREE.MeshLambertMaterial({
			color: new THREE.Color(1, 1, 1)
		});

		Amy.boxColAmy = new THREE.Mesh(boxCol, boxMaterial);

		Amy.boxColAmy.visible = false;
		Amy.add(Amy.boxColAmy);
		Amy.inmunidad = false;

		scene.add(Amy);

		isWorldReady[5] = true;
	});

	

	//Cargando los arboles
	var loader4 = new THREE.FBXLoader();
	loader4.load('assets/Tree.fbx', function(arbol){


		arbol.position.set(65, 0, -50);
		arbol.scale.set(0.01,0.01,0.01);

		arbol.name = 'Arbol';
		scene.add(arbol);

		arbol2 = arbol.clone();
		arbol2.position.set(-50, 0, -50);

		scene.add(arbol2);

		isWorldReady[6] = true;

		isWorldReady[7] = true;
	});

	//Cargando al Cangrejo
	var cangrejo_loader = new THREE.FBXLoader();
	
	cangrejo_loader.load('assets/CangrejitoCaminando.fbx', function(Cangrejo){

		Cangrejo.mixer = new THREE.AnimationMixer(Cangrejo);
		mixers3.push(Cangrejo.mixer);

		walking = Cangrejo.mixer.clipAction(Cangrejo.animations[0]);
		walking.play();
		
		Cangrejo.position.set(0, 10, 0);
		Cangrejo.scale.set(0.03,0.03,0.03);


		Cangrejo.name = 'Cangrejo';

		var boxMasterGeo = new THREE.BoxGeometry(200, 200, 200);

		var boxMaterial = new THREE.MeshLambertMaterial({
			color: new THREE.Color(1, 1, 1)
		});

		Cangrejo.boxMaster = new THREE.Mesh(boxMasterGeo, boxMaterial);
		

		Cangrejo.boxMaster.visible = false;
		Cangrejo.add(Cangrejo.boxMaster);
		

		var boxGeo1 = new THREE.BoxGeometry(900, 900, 900);

		Cangrejo.boxCol1 = new THREE.Mesh(boxGeo1, boxMaterial);

		Cangrejo.boxCol1.visible = false;
		Cangrejo.add(Cangrejo.boxCol1);


		scene.add(Cangrejo);

	});

	//Cargando ítems especiales
	var itemX = 10;
	var itemZ = 0;
	CargarItems("Item1", itemX, itemZ, 1);


	isWorldReady[8] = true;

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
		item1.position.set(x, 7, z);
		item1.boxColItem = new THREE.Mesh(boxMaster, boxMaterial);

		console.log(item1);
		//item1.boxColItem.visible = false;
		
		item1.add(item1.boxColItem);
		scene.add(item1);
	});

	
	
}

/*LÓGICA DE ITEMS */
function ColisionConItem(itemOrigi, itemBB, playerBB, fast){
	if(itemBB.intersectsBox(playerBB)){
		fast.a = true;

		//console.log(itemOrigi.name);
		switch(itemOrigi.item){

			case 'Item1':
				fast.speed = 35;
				fast.enemy = 12;
				break;

			case 'Item2':
				fast.speed = 20;
				fast.enemy = 8;
				break;
			
			case 'Item3':
				scoreAmy +=10;
				break;

			default:
				break;
		}

		scene.remove(itemOrigi);
		
	}
}

function CrearItemNuevo(){
	

	var probabilidad = (Math.floor(Math.random()*100));
	var myNumber = (Math.floor(Math.random()*90) -40);
	var myNumber2 = (Math.floor(Math.random()*63)-28);
	
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
			fast.enemy = 12;
			CrearItemNuevo();
			
		}
	}
}