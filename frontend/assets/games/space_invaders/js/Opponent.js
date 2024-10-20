import {THREE, GLTFLoader} from '/assets/games/space_invaders/js/three-defs.js';
import {EngineThrustEffect} from '/assets/games/space_invaders/js/Particles.js';
import { Bullet } from '/assets/games/space_invaders/js/Bullet.js';

class Opponent {
    constructor() {
        this.mesh = null;

        this.position = new THREE.Vector3(0, 0, 100);
        this.quaternion = new THREE.Quaternion();
        this.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);

        this.isSprinting = false;
        
        this.thrustEffect = null;
        this.setup = null;
        
        this.health = 100;
        this.damage = 10;
        this.moveSpeed = 0.5;

        this.bullets = []; // Store bullets
    }

    setSetup(setup) {
      this.setup = setup;

      const loader = new GLTFLoader();
        loader.load('/assets/games/space_invaders/models/yellow_spaceship_1k.glb', (gltf) => {
            this.mesh = gltf.scene;
            this.mesh.scale.set(0.2, 0.2, 0.2);
            this.mesh.position.copy(this.position);
            this.mesh.quaternion.copy(this.quaternion);
            
            this.setup.scene.add(this.mesh);
            
            this.thrustEffect = new EngineThrustEffect(this.setup.scene, this);
           
            this.setup.objectsToCheck.push(this.mesh);
            this.setup.worldObjects.push(this.mesh);

        });

    }

    update(deltaTime) {
        if (!this.mesh) return;
        if (!this.setup) return;

        this.moveForward();
    
        if(this.thrustEffect) this.thrustEffect.update(deltaTime);

        this.mesh.position.copy(this.position);

    }

    moveForward() {
        const direction = new THREE.Vector3(0, 0, 1).applyQuaternion(this.quaternion);
        this.position.add(direction.multiplyScalar(this.moveSpeed));
    }

    ws_update(new_position, new_quaternion) {
        // const vec_position = new THREE.Vector3(new_position.x, new_position.y, new_position.z);
        const vec_quaternion = new THREE.Quaternion(new_quaternion._x, new_quaternion._y, new_quaternion._z, new_quaternion._w);


        // this.position = vec_position;
        this.quaternion = vec_quaternion;
        // this.mesh.position.copy(this.position);
        this.mesh.quaternion.copy(this.quaternion);
    }

    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        this.setup.scene.remove(this.mesh);
        console.log("Opponent died");
        this.setup.player.isAlive = false;
        // this.setup.EndGame();
    }
}

export { Opponent };


