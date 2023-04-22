var pPlay = false;
var pDuration = 0.5;
var pCounter = 0;
var pSystem;
var pParticle;
var explosion;
var hit;
var pArray = [];

function pgetRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

function spawnParticleEffect(target, text, pcolor, cantidad, psize) {

    // create the particle variables
    const pt = new THREE.TextureLoader().load(text);

    pParticle = new THREE.Geometry();
    var pMaterial = new THREE.PointsMaterial({
        color: pcolor,
        size: psize,
        map: pt,
        transparent: true,
        alphaTest: 0.5
    });

    // now create the individual particles
    for (var p = 0; p < cantidad; p++) {

      // create a particle with random
      // position values, -250 -> 250
        var pX = pgetRandomArbitrary(target.x - 4, target.x + 4);
        var pY = pgetRandomArbitrary(target.y - 2, target.y + 4);
		var pZ = pgetRandomArbitrary(target.z - 4, target.z + 4);
        var particle = new THREE.Vector3(pX, pY, pZ);
         
         // create a velocity vector
      particle.velocity = new THREE.Vector3(0, -Math.random(), 0);            

      pParticle.vertices.push(particle);
    }

    // create the particle system
    pSystem = new THREE.Points(pParticle,pMaterial);

    pSystem.sortParticles = true;

    pArray.push(pSystem);
    // add it to the scene
    scene.add(pSystem);

}