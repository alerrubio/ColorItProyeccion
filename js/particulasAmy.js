var particleCount2 = 15;
var reproducirParticulas2 = false;
var duracionParticula2 = 0.1;
var contadorAnim2 = 0;
var particleSystem2;
var particles2;

function getRandomArbitrary2(min, max) {
    return Math.random() * (max - min) + min;
  }

function spawnParticulas2(target, pcolor) {

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



    // now create the individual particles
    for (var p = 0; p < particleCount2; p++) {

      // create a particle with random
      // position values, -250 -> 250
        var pX = getRandomArbitrary(target.x - 4, target.x + 4);
        var pY = getRandomArbitrary(target.y - 2, target.y + 2);
		    var pZ = getRandomArbitrary(target.z - 4, target.z + 4);
        var particle = new THREE.Vector3(pX, pY, pZ);
         
         // create a velocity vector
      particle.velocity = new THREE.Vector3(0, -Math.random(), 0);            

      particles.vertices.push(particle);
    }

    // create the particle system
    particleSystem2 = new THREE.Points(particles,pMaterial);

    particleSystem2.sortParticles = true;

    // add it to the scene
    scene.add(particleSystem2);

}