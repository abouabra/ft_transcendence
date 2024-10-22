import {THREE, GLTFLoader} from '/assets/games/space_invaders/js/three-defs.js';
import {EngineThrustEffect} from '/assets/games/space_invaders/js/Particles.js';
import { Bullet } from '/assets/games/space_invaders/js/Bullet.js';

class Opponent {
    constructor() {
        this.mesh = null;

        this.position = new THREE.Vector3(0, 0, 0);
        this.quaternion = new THREE.Quaternion();

        this.targetPosition = new THREE.Vector3();
        this.targetQuaternion = new THREE.Quaternion();
        this.smoothingSpeed = 1;  

        this.score = 0;

        this.isSprinting = false;
        
        this.thrustEffect = null;
        this.setup = null;
        
        this.health = 2000;
        this.damage = 10;
        this.moveSpeed = 0.5;
        this.isAlive = true;
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

        // Interpolate the position and quaternion towards the target values
        this.position.lerp(this.targetPosition, this.smoothingSpeed);
        this.quaternion.slerp(this.targetQuaternion, this.smoothingSpeed);

        // Update mesh position and rotation
        this.mesh.position.copy(this.position);
        this.mesh.quaternion.copy(this.quaternion);


        this.moveForward();
    
        if(this.thrustEffect) this.thrustEffect.update(deltaTime);
    }

    moveForward() {
        const direction = new THREE.Vector3(0, 0, 1).applyQuaternion(this.quaternion);
        this.position.add(direction.multiplyScalar(this.moveSpeed));
    }

    ws_update(new_position, new_quaternion) {
        // Store the target position and quaternion
        this.targetPosition.set(new_position.x, new_position.y, new_position.z);
        this.targetQuaternion.set(new_quaternion._x, new_quaternion._y, new_quaternion._z, new_quaternion._w);
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
        this.setup.player.score += 1000;    
        this.isAlive = false;
    }
}

export { Opponent };


