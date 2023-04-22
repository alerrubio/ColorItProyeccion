var scene;
var camera;
var renderer;
var controls;
var objects = [];
var clock;
var deltaTime;	
var keys = {};

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
var c1 = currentSettings.p1color;
var c2 = currentSettings.p2color;


//Granny
var Granny;
var mixers3 = [];
var running;

//Cubos
var cubo1, cubo2, cubo3, cubo4;

//PaintPisos
var paint = [];

//Edificios
var edificios;
var hotel;
var apartment;
var planoPiso;
var loadingScreenPlane;

//Colisiones IA
var GrannyBC;
var GrannyBM;
var amyBB;
var choque;

var frozenA=false;
var duracionFrozen = 3;

//Inmunidad
var inmunidadContadorA = 0;
var inmunidadDuracionA = 5;

//Items
var item1;
var itemBB;
var amyBB;

var faster2 = {
	a:false,
	contador: 0,
	duracion: 3,
	speed: 20,
	enemy: 11
};

const textureloaders = new THREE.TextureLoader();
var normales = textureloaders.load('resources/paint-normal.jpg');

//Materiales de personajes
var materialAmy = new THREE.MeshStandardMaterial({	color: new THREE.Color(c2), opacity: 0.8, transparent:true,
	normalMap:normales, metalness: 0.7, roughness: 0.5, emissive: new THREE.Color(c2), emissiveIntensity: 0.8});

//Variables de puntuaciones
var scoreAmy = 0;


var isWorldReady = [ false, false, false, false, false, false, false, false, false ];

$(document).ready(function() {
	
	$(".scene_pause").hide();

	levelPicker('court');

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
			running.weight = 1;
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

		if(!frozenA){
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
		}

		if (isWorldReady[0] && isWorldReady[1] && isWorldReady[2] && isWorldReady[3] && isWorldReady[4]
		&& isWorldReady[5] && isWorldReady[6] && isWorldReady[7]) {
			
			
			Amy = scene.getObjectByName("Amy");
			Amy.rotation.y += yaw2 * deltaTime;
			Amy.translateZ(forward2 * deltaTime);

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

			Granny = scene.getObjectByName("Granny");
				

			GrannyBM = new THREE.Box3().setFromObject(Granny.boxMaster);
			GrannyBC = new THREE.Box3().setFromObject(Granny.boxCol1);
			amyBB = new THREE.Box3().setFromObject(Amy.boxColAmy);

			
				Granny.lookAt(Amy.position.x, 5, Amy.position.z);
				Granny.translateZ(faster2.enemy * deltaTime);

			if(GrannyBM.intersectsBox(amyBB)){
				if(Amy.inmunidad==false){
					Amy.inmunidad=true;	
					frozenA = true;
					if (!pPlay) {
						pPlay = true;
						flag2 = 4;
						spawnParticleEffect(new THREE.Vector3(Amy.position.x, Amy.position.y+6, Amy.position.z), "resources/swish4.png",
						"rgb(102, 250, 255)",4,9);
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
				if(inmunidadContadorA >= duracionFrozen){
					frozenA = false;
				}
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
				pSystem.rotation.z += 0.001;
				if(pCounter>=pDuration){
					pCounter = 0;
					pPlay = false;
					scene.remove(pSystem);
					pArray=[];
				}
				
			}
			
			$("#score2").text(scoreAmy.toString());

		}

		renderer.render(scene, camera);
		isWorldReadyReal = true;
	}
}

function setupScene() {		
	var visibleSize = {  width: 1300, height: 650};
	clock = new THREE.Clock();		
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, visibleSize.width / visibleSize.height, 0.1, 300);
	camera.position.x = 0;
	camera.position.z = 60;
	camera.position.y = 60; 
	camera.lookAt(0, 0, 0);

	renderer = new THREE.WebGLRenderer( {precision: "mediump" } );
	renderer.setClearColor(new THREE.Color(0.156862, 0.623529, 0.788235));
	renderer.setPixelRatio(visibleSize.width / visibleSize.height);
	renderer.setSize(visibleSize.width, visibleSize.height);

	var ambientLight = new THREE.AmbientLight(new THREE.Color("rgb(102, 148, 176)"), 0.25);
	scene.add(ambientLight);

	var pointLight = new THREE.PointLight(new THREE.Color("rgb(252, 255, 105)"), 0.7);
	pointLight.position.set(-65, 15, 0);
	scene.add(pointLight);

	var pointLight2 = new THREE.PointLight(new THREE.Color("rgb(252, 255, 105)"), 0.3);
	pointLight2.position.set(-5, 10, 0);
	scene.add(pointLight2);

	var pointLight2 = new THREE.PointLight(new THREE.Color("rgb(252, 255, 105)"), 0.7);
	pointLight2.position.set(65, 15, 0);
	scene.add(pointLight2);



	camera.rayos = [
		new THREE.Vector3(1, 0, 0),
		new THREE.Vector3(-1, 0, 0),
		new THREE.Vector3(0, 0, 1),
		new THREE.Vector3(0, 0, -1)
	];

	rayCaster = new THREE.Raycaster();
	

	isWorldReady[0] = true;

	//Plano de asfalto
	var concretefloor = textureloaders.load('resources/concrete-floor.jpg');
	var materialAsfalto = new THREE.MeshLambertMaterial({map:concretefloor});
	var geometry = new THREE.BoxGeometry(800, 0.1, 500);
	planoPiso = new THREE.Mesh(geometry, materialAsfalto);
	planoPiso.position.set(0,-20, 100);
	scene.add(planoPiso);

	var materialColision = new THREE.MeshLambertMaterial({opacity: 0.0, transparent:true});
	var geometry = new THREE.BoxGeometry(35, 10, 0.2);
	cube = new THREE.Mesh(geometry, materialColision)
	cube.position.set(-5,10,-45);
	cube.scale.set(5,5,25);

	cube2 = cube.clone();
	cube2.position.set(5,10,45);


	cube3 = cube.clone();
	cube3.rotation.y = THREE.Math.degToRad(90);		
	cube3.position.set(-87,10,8);

	cube4 = cube3.clone();
	cube4.position.set(80,10,8);

	scene.add(cube);
	scene.add(cube2);
	scene.add(cube3);
	scene.add(cube4);

	objetosConColision.push(cube,cube2,cube3,cube4);
	objetosConColision2.push(cube,cube2,cube3,cube4);

	var materialPaint = new THREE.MeshPhongMaterial({color: new THREE.Color(0, 1, 0), opacity: 0.0, transparent:true, shininess: 60});
	var geometry3 = new THREE.BoxGeometry(18, 0.1, 17);

	var paintx = -75;
	var paintz = -34;

	for(let i = 0; i<5; i++){
		
		paint[i] = new Array()

		for(let j = 0; j<9; j++){
			paint[i][j] = new THREE.Mesh(geometry3, materialPaint);
			paint[i][j].position.set(paintx, 0.1, paintz);
			paintx += 18;
			scene.add(paint[i][j]);
			paint[i][j].name = i.toString() + " " + " " + j.toString();
			paint[i][j].painted = 0;
			pisoConColision.push(paint[i][j]);
			
		}
		paintx = -75;
		paintz += 17;
		
	}

	isWorldReady[1] = true;

	//Plano de pared de concreto
	var nightsky = textureloaders.load('resources/night_sky.jpg');
	var materialConcreto = new THREE.MeshLambertMaterial({map:nightsky, color: new THREE.Color("rgb(130,130,130)")});
	var geometry2 = new THREE.BoxGeometry(100, 100, 1);
	planoPared = new THREE.Mesh(geometry2, materialConcreto);
	planoPared.position.set(0,0, -120);

	planoPared2 = planoPared.clone();
	planoPared3 = planoPared.clone();
	planoPared4 = planoPared.clone();
	planoPared5 = planoPared.clone();
	planoPared6 = planoPared.clone();
	planoPared7 = planoPared.clone();

	planoPared2.position.set(-100,0, -120);
	planoPared3.position.set(100,0, -120);
	planoPared4.position.set(-200,0, -120);
	planoPared5.position.set(200,0, -120);
	planoPared6.position.set(300,0, -120);
	planoPared7.position.set(-300,0, -120);

	scene.add(planoPared);
	scene.add(planoPared2);
	scene.add(planoPared3);
	scene.add(planoPared4);
	scene.add(planoPared5);
	scene.add(planoPared6);
	scene.add(planoPared7);

	//cargando modelos

	isWorldReady[2] = true;
	//Cargando apartamentos de fondo
	loadOBJWithMTL("assets/", "basket.obj", "basket.mtl", (basket_court) => {
		basket_court.name = 'basket_court';
		basket_court.scale.set(2,2,2);
		basket_court.position.set(0, 0, 0);
		scene.add(basket_court);
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

		Amy.position.set(-75, 0, 0);
		Amy.rotation.y = THREE.Math.degToRad(90);
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
		Amy.inmunidad = false;
		Amy.add(Amy.boxColAmy);


		Amy.name = 'Amy';
		scene.add(Amy);

		isWorldReady[5] = true;
	});

	isWorldReady[6] = true;

	//Cargando los arboles
	loadOBJWithMTL("assets/", "fence.obj", "fence.mtl", (fence) => {
		fence.name = 'fence';
		fence.scale.set(0.5,0.5,1);
		fence.position.set(15, 0, -60);
		fence.rotation.y = THREE.Math.degToRad(180);
		scene.add(fence);

		fence1 = fence.clone();
		fence2 = fence.clone();
		fence3 = fence.clone();
		fence4 = fence.clone();
		fence5 = fence.clone();
		fence1.position.set(55, 0, -60);
		fence2.position.set(95, 0, -60);
		fence3.position.set(-25, 0, -60);
		fence4.position.set(-65, 0, -60);
		fence5.position.set(-105, 0, -60);
		fence6 = fence.clone();
		fence6.rotation.y = THREE.Math.degToRad(90);

		
		fence1.position.set(55, 0, -60);
		fence2.position.set(95, 0, -60);
		fence3.position.set(-25, 0, -60);
		fence4.position.set(-65, 0, -60);
		fence5.position.set(-105, 0, -60);
		fence7 = fence6.clone();
		fence8 = fence6.clone();
		fence8.rotation.y = THREE.Math.degToRad(-90);
		fence9= fence8.clone();

		fence6.position.set(115, 0, -40);
		fence7.position.set(115, 0, 0);
		fence8.position.set(-125, 0, -40);
		fence9.position.set(-125, 0, 0);

		scene.add(fence1);
		scene.add(fence2);
		scene.add(fence3);
		scene.add(fence4);
		scene.add(fence5);
		scene.add(fence6);
		scene.add(fence7);
		scene.add(fence8);
		scene.add(fence9);
	});

	isWorldReady[7] = true;

	//Cargando al Granny
	var Granny_loader = new THREE.FBXLoader();
	
	Granny_loader.load('assets/Granny.fbx', function(Granny){

		Granny.mixer = new THREE.AnimationMixer(Granny);
		mixers3.push(Granny.mixer);

		running = Granny.mixer.clipAction(Granny.animations[0]);
		running.play();
		
		Granny.position.set(3, 0, 0);
		Granny.scale.set(0.06,0.06,0.06);

		Granny.name = 'Granny';

		var boxMasterGeo = new THREE.BoxGeometry(90, 90, 90);

		var boxMaterial = new THREE.MeshLambertMaterial({
			color: new THREE.Color(1, 1, 1)
		});

		Granny.boxMaster = new THREE.Mesh(boxMasterGeo, boxMaterial);
		Granny.boxMaster.visible = false;
		Granny.add(Granny.boxMaster);
		
		var boxGeo1 = new THREE.BoxGeometry(750, 750, 750);

		Granny.boxCol1 = new THREE.Mesh(boxGeo1, boxMaterial);
		Granny.boxCol1.visible = false;
		Granny.add(Granny.boxCol1);

		scene.add(Granny);

		isWorldReady[8] = true;
	});

	//Cargando ítems especiales
	var itemX = 10;
	var itemZ = 0;
	CargarItems("Item1", itemX, itemZ, 1);
	isWorldReady[4] = true;

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
		
		scene.add(item1);
		item1.add(item1.boxColItem);

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
				break;

			case 'Item2':
				fast.speed = 20;
				fast.enemy = 7;
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
	var myNumber = (Math.floor(Math.random()*140)-70);
	var myNumber2 = (Math.floor(Math.random()*70)-35);
	
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
			fast.enemy = 11;
			CrearItemNuevo();
			
		}
	}
}


