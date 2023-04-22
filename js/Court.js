var opponent;

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


//Animaciones Michelle
var mixers = [];
var run, defeated, victory, idle;
var flag;
var Michelle;

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
var michelleBB;
var amyBB;
var choque;

var frozenM=false;
var frozenA=false;
var duracionFrozen = 3;

//Inmunidad
var inmunidadContadorA = 0;
var inmunidadDuracionA = 5;
var inmunidadContadorM = 0;
var inmunidadDuracionM = 5;


//Items
var item1;
var itemBB;
var michelleBB;
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
var materialMichelle = new THREE.MeshStandardMaterial({color: new THREE.Color(c1), opacity: 0.8, transparent:true,
normalMap:normales, metalness: 0.6, roughness: 0.3, emissive: new THREE.Color(c1), emissiveIntensity: 0.6});
var materialAmy = new THREE.MeshStandardMaterial({	color: new THREE.Color(c2), opacity: 0.8, transparent:true,
	normalMap:normales, metalness: 0.7, roughness: 0.5, emissive: new THREE.Color(c2), emissiveIntensity: 0.8});

//Variables de puntuaciones
var scoreAmy = 0;
var scoreMichelle = 0;


var isWorldReady = [ false, false, false, false, false, false, false, false, false ];

$(document).ready(function() {
	opponent = localStorage.getItem('player_2_name');
    document.getElementById("opponent_name").innerHTML = opponent;
	
	$(".scene_pause").hide();

	levelPicker('court');

	const loadingScreenContainer = document.getElementById( 'loadingScreenContainer' );
	const loadingScreen = document.getElementById( 'video' );
	
	setupScene();

	render();
	
	document.addEventListener('keydown', onKeyDown);
	document.addEventListener('keyup', onKeyUp);		
	
});

//Función para crear los fbx que exportamos de Maya
function loadFBXwithName(nameFBX, arrayAnims, posX){
	var loader = new THREE.FBXLoader();
	loader.load('assets/'+nameFBX+'.fbx', function(personaje){

		personaje.mixer = new THREE.AnimationMixer(personaje);
		arrayAnims.push(personaje.mixer);

		run = personaje.mixer.clipAction(personaje.animations[0]);
		defeated = personaje.mixer.clipAction(personaje.animations[1]);
		victory = personaje.mixer.clipAction(personaje.animations[2]);
		idle = personaje.mixer.clipAction(personaje.animations[3]);

		run.play();
		defeated.play();
		victory.play();
		idle.play();

		isWorldReady[4] = true;

		personaje.position.set(68, 0, 0);
		personaje.rotation.y = THREE.Math.degToRad(-90);
		personaje.scale.set(0.1,0.1,0.1);

		personaje.rayos = [
			new THREE.Vector3(1, 0.11, 0),
			new THREE.Vector3(-1, 0.11, 0),
			new THREE.Vector3(0, 0.11, 1),
			new THREE.Vector3(0, 0.11, -1)
		];

		objetosConColision.push(personaje);

		personaje.name = nameFBX;

		var boxCol = new THREE.BoxGeometry(70, 300, 70);
		var boxMaterial = new THREE.MeshLambertMaterial({
			color: new THREE.Color(1, 1, 1)
		});

		personaje.inmunidad = false;

		personaje.boxColMichelle = new THREE.Mesh(boxCol, boxMaterial);

		personaje.boxColMichelle.visible = false;
		personaje.add(personaje.boxColMichelle);

		scene.add(personaje);

	});
}

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


	//MICHELLE
	if(mixers.length > 0){
		for(var i = 0; i<mixers.length; i++){
			mixers[i].update(deltaTime);
		}
		switch(flag){
			case 1: 
				run.weight = 1;
				defeated.weight = 0;
				victory.weight = 0;
				idle.weight = 0;
			break;
			case 2: 
				run.weight = 0;
				defeated.weight = 1;
				victory.weight = 0;
				idle.weight = 0;
			break;
			case 3: 
				run.weight = 0;
				defeated.weight = 0;
				victory.weight = 1;
				idle.weight = 0;
			break;
			case 4: 
				run.weight = 0;
				defeated.weight = 0;
				victory.weight = 0;
				idle.weight = 1;
			break;
			default: 
				run.weight = 0;
				defeated.weight = 0;
				victory.weight = 0;
				idle.weight = 1;
			break;
		}
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

	var yaw = 0;
	var forward = 0;

	var yaw2 = 0;
	var forward2 = 0;
	
	if(!frozenM){
		//MICHELLE
		if (keys[37]) {

			yaw = 3;

		} else if (keys[39]) {

			yaw = -3;
			
		}
		if (keys[38]) {
			
			forward = faster.speed;

			flag=1;
			if (!reproducirParticulas) {
				reproducirParticulas = true;
				spawnParticulas(personaje.position, c1);
			}

		} else if (!keys[38]) {

			forward = 0;
			flag = 4;
		}
	}

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
		
		personaje = scene.getObjectByName("Michelle");
		personaje.rotation.y += yaw * deltaTime;
		personaje.translateZ(forward * deltaTime);

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

		for(var i = 0; i<personaje.rayos.length; i++){
			var rayo = personaje.rayos[i];
			rayCaster.set(personaje.position, rayo);
			var collision = rayCaster.intersectObjects(objetosConColision2, true);

			if(collision.length > 0 && collision[0].distance < 4){
				//alert("sí hay colisión");
				personaje.translateZ(-forward * deltaTime);
			}

			//Array de piso
			var pisoPintado = rayCaster.intersectObjects(pisoConColision, true);
			if(pisoPintado.length > 0 && pisoPintado[0].distance < 2){
				//alert("sí hay colisión");
				pisoPintado[0].object.material = materialMichelle;
				pisoPintado[0].needsUpdate = true;

				//Si es de Amy se le baja puntos a ella
				if(pisoPintado[0].object.painted==1){
					scoreAmy--;
				}

				//Si no es de Michelle se le sube puntuación
				if (pisoPintado[0].object.painted!=2){
					scoreMichelle++;
				}

				pisoPintado[0].object.painted = 2;
			}
		}


		Granny = scene.getObjectByName("Granny");
			

		GrannyBM = new THREE.Box3().setFromObject(Granny.boxMaster);
		GrannyBC = new THREE.Box3().setFromObject(Granny.boxCol1);
		amyBB = new THREE.Box3().setFromObject(Amy.boxColAmy);
		michelleBB = new THREE.Box3().setFromObject(personaje.boxColMichelle);

		if(GrannyBC.intersectsBox(amyBB) || GrannyBC.intersectsBox(michelleBB)){
			var distancia = GrannyBM.distanceToPoint(Amy.position);
			var distancia2 = GrannyBM.distanceToPoint(personaje.position);

			if(distancia<distancia2){
				Granny.lookAt(Amy.position.x, 5, Amy.position.z);

				
			}
			else {
				Granny.lookAt(personaje.position.x, 5, personaje.position.z);
			}
			
			Granny.translateZ(11 * deltaTime);
			
		}

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

		if(GrannyBM.intersectsBox(michelleBB)){
			if(personaje.inmunidad==false){
				personaje.inmunidad=true;	
				frozenM = true;
				if (!pPlay) {
					pPlay = true;
					flag = 4;
					spawnParticleEffect(new THREE.Vector3(personaje.position.x, personaje.position.y+6, personaje.position.z), "resources/swish4.png",
					"rgb(102, 250, 255)",4,9);
				}
			}
		}



		if(faster.a == false && faster2.a == false){

			var powerup = scene.getObjectByName("Item");
			itemBB = new THREE.Box3().setFromObject(powerup.boxColItem);

			/*GOLPE CON ITEMS */
			ColisionConItem(powerup, itemBB, michelleBB, faster, faster2, 1);
			ColisionConItem(powerup, itemBB, amyBB, faster2, faster, 2);
			
		}
		
		DuracionPowerUp(faster, deltaTime);
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
		if(personaje.inmunidad==true){
			inmunidadContadorM += deltaTime;
			if(inmunidadContadorM >= duracionFrozen){
				frozenM = false;
			}
			if (inmunidadContadorM >= inmunidadDuracionM) {
				personaje.inmunidad = false;
				inmunidadContadorM = 0;
			}

		}

		loadingScreenContainer.style.display = "none";

		if (reproducirParticulas) {
			contadorAnim += deltaTime;
			particleSystem.rotation.y += 0.001;
			if(contadorAnim>=duracionParticula){
				contadorAnim = 0;
				reproducirParticulas = false;
				scene.remove(particleSystem);
			}
			
		}
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

		$("#score1").text(scoreMichelle.toString());
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
	
	//Cargando a Michelle
	loadFBXwithName('Michelle', mixers, -10);

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
	isWorldReady[7] = true;
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


	//Cargando al Granny
	var Granny_loader = new THREE.FBXLoader();
	
	Granny_loader.load('assets/Granny2.fbx', function(Granny){

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
function ColisionConItem(itemOrigi, itemBB, playerBB, fast, fastEnemy, player){
	if(itemBB.intersectsBox(playerBB)){

		//console.log(itemOrigi.name);
		switch(itemOrigi.item){

			case 'Item1':
				fast.a = true;
				fast.speed = 35;
				fastEnemy.speed = 20;
				break;

			case 'Item2':
				fastEnemy.a = true;
				fastEnemy.speed = 10;
				fast.speed = 20;
				break;
			
			case 'Item3':
				fast.a = true;
				if(player == 1){
					scoreMichelle += 10;
				}
				else{
					scoreAmy +=10;
				}

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
			CrearItemNuevo();
			
		}
	}
}


