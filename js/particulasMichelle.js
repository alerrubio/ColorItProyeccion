var particleCount = 15;
var reproducirParticulas = false;
var duracionParticula = 0.1;
var contadorAnim = 0;
var particleSystem;
var particles;

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

function spawnParticulas(target, pcolor) {

    // create the particle variables
    const pt = new THREE.TextureLoader().load('resources/white-splatter.png');
    
    particles = new THREE.Geometry();
    var pMaterial = new THREE.PointsMaterial({
        color: pcolor,
        size: 2.5,
        map: pt,
        transparent: true,
        alphaTest: 0.5
    });
    pMaterial.needsUpdate = true;




    // now create the individual particles
    for (var p = 0; p < particleCount; p++) {

      // create a particle with random
      // position values, -250 -> 250
        var pX = getRandomArbitrary(target.x - 4, target.x + 4);
        var pY = getRandomArbitrary(target.y - 1, target.y + 1);
		    var pZ = getRandomArbitrary(target.z - 4, target.z + 4);
        var particle = new THREE.Vector3(pX, pY, pZ);
         
         // create a velocity vector
      particle.velocity = new THREE.Vector3(0, -Math.random(), 0);            

      particles.vertices.push(particle);
    }

    // create the particle system
    particleSystem = new THREE.Points(particles,pMaterial);

    particleSystem.sortParticles = true;

    // add it to the scene
    scene.add(particleSystem);

}