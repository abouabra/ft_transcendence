import {THREE, GLTFLoader} from '/assets/games/space_invaders/js/three-defs.js';
import {EngineThrustEffect} from '/assets/games/space_invaders/js/Particles.js';
import { Bullet } from '/assets/games/space_invaders/js/Bullet.js';

class Player {
    constructor() {
        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.position = new THREE.Vector3(0, 0, 0);
        this.quaternion = new THREE.Quaternion();
        this.yawSpeed = 0.01; // Speed for yaw (left/right)
        this.pitchSpeed = 0.01; // Speed for pitch (up/down)
        this.pitch = 0; // Pitch in radians
        this.yaw = 0; // Yaw in radians
        this.maxPitch = Math.PI / 2 - 0.4; // Maximum pitch in radians
        this.minPitch = -Math.PI / 2; // Minimum pitch in radians
        this.isSprinting = false;
        this.cameraChangeTimeout = 0; // Timeout for camera change
        this.cameraIndex = 0; // Index of the current camera
        
        this.visualRotationZ = 0; // Current Z-axis rotation for visual effect (left/right)
        this.visualRotationX = 0; // Current X-axis rotation for visual effect (up/down)
        this.visualRotationSpeed = THREE.MathUtils.degToRad(5); // Speed of visual rotation (5 degrees)
        this.rotationRecoverySpeed = THREE.MathUtils.degToRad(2.5); // Speed of recovery back to normal (2.5 degrees)
        this.maxVisualRotation = THREE.MathUtils.degToRad(45); // Maximum visual rotation (45 degrees)

        this.raycaster = new THREE.Raycaster();  // Initialize Raycaster
        this.rayDirection = new THREE.Vector3(); // Store the shooting direction
        this.rayOrigin = new THREE.Vector3();

        this.crosshairSize = 0.3; // Make sure this matches the size set in createCrosshair()
        this.crosshairDistance = 5; // Distance from camera to crosshair
        this.crosshairOffset = new THREE.Vector3(0, 1.2, 0); // Offset from camera center, adjust as needed
        this.createCrosshair();

        // UI elements
        this.health = 100;
        this.boost = 100;
        this.damage = 10;
        this.BaseMoveSpeed = 0.5;
        this.moveSpeed = this.BaseMoveSpeed;

        this.isAlive = true;

        this.thrustEffect = null;

        this.bullets = []; // Store bullets
        this.bulletTimeout = 0; // Timeout for bullet shooting
        this.bulletDelay = 0.1; // Delay between bullets
    }

    createCrosshair() {
        const crosshairColor = 0xffffff; // White color

        const crosshairTexture = new THREE.CanvasTexture(this.generateCrosshairTexture());
        const crosshairMaterial = new THREE.SpriteMaterial({ map: crosshairTexture, color: crosshairColor });
        this.crosshair = new THREE.Sprite(crosshairMaterial);
        this.crosshair.scale.set(this.crosshairSize, this.crosshairSize, this.crosshairSize);
    }

    generateCrosshairTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        // Draw crosshair
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(32, 16);
        ctx.lineTo(32, 48);
        ctx.moveTo(16, 32);
        ctx.lineTo(48, 32);
        ctx.stroke();

        return canvas;
    }

    setSetup(setup) {
      this.setup = setup;

      const loader = new GLTFLoader();
        loader.load('/assets/games/space_invaders/models/yellow_spaceship_1k.glb', (gltf) => {
            this.mesh = gltf.scene;
            this.mesh.scale.set(0.2, 0.2, 0.2); // yellow_spaceship
            // this.mesh.scale.set(2, 2, 2); // star_wars_ship
            this.mesh.position.copy(this.position);
            this.mesh.quaternion.copy(this.quaternion);
            this.setup.scene.add(this.mesh);
            
            this.thrustEffect = new EngineThrustEffect(this.setup.scene, this);

            // this.setup.objectsToCheck.push(this.mesh);

        });

        this.setup.scene.add(this.crosshair);

    }

    
    
    update(deltaTime) {
        if (!this.setup || !this.setup.camera) return;


        // Check for collisions
        this.checkCoallision();

        // Update player's position based on movement
        this.moveForward();

        // Update crosshair position
        this.updateCrosshairPosition();

        // limit bullet array to only have 20 bullets 
        if (this.bullets.length > 20) {
            for (let i = 0; i < this.bullets.length - 20; i++) {
                this.bullets[i].destroy();
            }
            this.bullets = this.bullets.slice(this.bullets.length - 20, this.bullets.length);
        }



        this.bullets = this.bullets.filter(bullet => bullet.update(deltaTime));
        this.bulletTimeout -= deltaTime;

        if (this.thrustEffect) {
            this.thrustEffect.update(deltaTime);
        }

        // Update active effects
        if (this.setup.activeEffects) {
            this.setup.activeEffects = this.setup.activeEffects.filter(effect => effect.update(deltaTime));
        }
        
        // Smoothly recover visual rotation back to neutral
        this.visualRotationZ = this.recoverRotation(this.visualRotationZ);
        this.visualRotationX = this.recoverRotation(this.visualRotationX);
     
        // Update mesh's position and rotation
        this.mesh.position.copy(this.position);
            
        // Create a quaternion for the actual movement
        const movementQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(this.pitch, this.yaw, 0, 'YXZ'));
        
        // Create quaternions for the visual rotation
        const visualRotationZQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), this.visualRotationZ);
        const visualRotationXQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.visualRotationX);
        
        // Combine the movement and visual rotation quaternions
        this.mesh.quaternion.copy(movementQuaternion).multiply(visualRotationZQuaternion).multiply(visualRotationXQuaternion);

    }


    updateCrosshairPosition() {
        if (this.setup && this.setup.camera) {
            // Get camera's position and direction
            const cameraPosition = this.setup.camera.position;
            const cameraDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(this.setup.camera.quaternion);

            // Calculate crosshair position with offset
            const offsetDirection = this.crosshairOffset.clone().applyQuaternion(this.setup.camera.quaternion);
            this.crosshair.position.copy(cameraPosition)
                .add(offsetDirection)
                .add(cameraDirection.multiplyScalar(this.crosshairDistance));

            // Calculate ray direction from camera to crosshair
            this.rayDirection.subVectors(this.crosshair.position, cameraPosition).normalize();

            // Set ray origin to be at the camera position
            this.rayOrigin.copy(cameraPosition);

            // Update raycaster
            this.raycaster.set(this.rayOrigin, this.rayDirection);

            // Check for intersections
            const intersects = this.raycaster.intersectObjects(this.setup.objectsToCheck, false);

            if (intersects.length > 0) {
                this.crosshair.material.color.set(0xff0000); // Red when pointing at an object
            } else {
                this.crosshair.material.color.set(0xffffff); // White otherwise
            }
        }
    }

    Shoot() {
        if (!this.setup || !this.setup.camera) return;
        if (this.bulletTimeout > 0) return;

        this.bulletTimeout = this.bulletDelay;
        
        // Ensure crosshair and ray are up to date
        this.updateCrosshairPosition();

        const left_bullet = new Bullet(this);
        const right_bullet = new Bullet(this, true);
        this.bullets.push(left_bullet);
        this.bullets.push(right_bullet);
    }


    recoverRotation(rotation) {
        if (rotation > 0) {
            return Math.max(0, rotation - this.rotationRecoverySpeed);
        } else if (rotation < 0) {
            return Math.min(0, rotation + this.rotationRecoverySpeed);
        }
        return 0;
    }

    moveForward() {
        const direction = new THREE.Vector3(0, 0, 1).applyQuaternion(this.quaternion);
        this.position.add(direction.multiplyScalar(this.moveSpeed));
    }

    rotateLeft() {
        // Move the player left (change yaw to the left)
        this.yaw += this.yawSpeed;
        this.updateQuaternion();
    
        // Handle visual animation without affecting movement
        this.visualRotationZ = Math.max(-this.maxVisualRotation, this.visualRotationZ - this.visualRotationSpeed);
    }
    
    rotateRight() {
        // Move the player right (change yaw to the right)
        this.yaw -= this.yawSpeed;
        this.updateQuaternion();
    
        // Handle visual animation without affecting movement
        this.visualRotationZ = Math.min(this.maxVisualRotation, this.visualRotationZ + this.visualRotationSpeed);
    }

    rotateUp() {
        const newPitch = this.pitch - this.pitchSpeed;
        if (newPitch >= this.minPitch) {
            this.pitch = newPitch;
            this.updateQuaternion();
            
            // Only apply visual rotation if we haven't hit the pitch limit
            this.visualRotationX = Math.max(-this.maxVisualRotation, this.visualRotationX - this.visualRotationSpeed);
        }
    }

    rotateDown() {
        const newPitch = this.pitch + this.pitchSpeed;
        if (newPitch <= this.maxPitch) {
            this.pitch = newPitch;
            this.updateQuaternion();

            // Only apply visual rotation if we haven't hit the pitch limit
            this.visualRotationX = Math.min(this.maxVisualRotation, this.visualRotationX + this.visualRotationSpeed);
        }
    }


    capPitch() {
        // Cap the pitch value to prevent flipping
        this.pitch = Math.max(this.minPitch, Math.min(this.pitch, this.maxPitch));
    }

    updateQuaternion() {
        // Create rotation quaternion from yaw and pitch
        const yawQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);
        const pitchQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.pitch);
        this.quaternion = yawQuaternion.multiply(pitchQuaternion);
    }

   

    Sprint() {
        if (this.boost <= 0)
        {
            this.boost = 0;
            this.StopSprint();
            return;
        }
        
        this.moveSpeed = this.BaseMoveSpeed * 4;
        this.isSprinting = true;
        this.yawSpeed = 0.05; // Speed for yaw (left/right)
        this.pitchSpeed = 0.05; // Speed for pitch (up/down)

        this.boost -= 0.1;

        // this.thrustEffect.particleMaterial.color.setHex(this.thrustEffect.material_thrust_color);

        const powerup_boost = document.getElementById('powerup_boost');
        powerup_boost.setAttribute("aria-valuenow", this.boost);
        powerup_boost.querySelector('.progress-bar').style.width = `${this.boost}%`;
        powerup_boost.querySelector('.progress-bar span').innerText = `${Math.floor(this.boost)}`;
    }

    StopSprint() {
        this.moveSpeed = this.BaseMoveSpeed;
        this.yawSpeed = 0.01; // Speed for yaw (left/right)
        this.pitchSpeed = 0.01; // Speed for pitch (up/down)
        this.isSprinting = false;

        // this.thrustEffect.particleMaterial.color.setHex(this.thrustEffect.material_base_color);
    }

    changeCamera() {
        // use cameraChangeTimeout to prevent rapid camera changes and to give time 500ms for every camera change
        let date = new Date();
        if (date.getTime() > this.cameraChangeTimeout) {
            this.cameraChangeTimeout = date.getTime() + 250;
            this.cameraIndex++;
        }
    }

    Die() {
        this.setup.scene.remove(this.mesh);
        this.isAlive = false;
        console.log("Player died");
    }


    // Function to detect collision
    detectCollision(obj1, obj2) {
        const obj1BoundingBox = new THREE.Box3().setFromObject(obj1);
        const obj2BoundingBox = new THREE.Box3().setFromObject(obj2);

        return obj1BoundingBox.intersectsBox(obj2BoundingBox);
    }

    checkCoallision() {
        if (!this.setup.worldObjects) return;
        if (!this.mesh) return;

        for (let i = 0; i < this.setup.worldObjects.length; i++) {
            if (this.detectCollision(this.mesh, this.setup.worldObjects[i])) {
                this.Die();
            }
        }

        if(this.detectCollision(this.mesh, this.setup.opponent.mesh)){
            this.Die();
            this.setup.opponent.die();
        }

        this.bullets.forEach(bullet => {
            for (let i = 0; i < this.setup.worldObjects.length; i++) {
                if (this.detectCollision(bullet.mesh, this.setup.worldObjects[i])) {
                    console.log('Bullet hit');
                    
                    const powerUp = this.setup.powerUPs.all_powerups.find(powerUp => powerUp.mesh === this.setup.worldObjects[i]);
                    if (powerUp) {
                        powerUp.takeDamage(this.damage);
                    }

                    if(this.setup.worldObjects[i] === this.setup.opponent.mesh){
                        this.setup.opponent.takeDamage(this.damage);
                    }

                    bullet.destroy();
                }
            }

            if(this.detectCollision(bullet.mesh, this.setup.opponent.mesh)){
                this.setup.opponent.takeDamage(this.damage);
                bullet.destroy();
            }
        });
    }

    send_ws_data()
    {
        const data = {
            type: "si_receive_data_from_client",
            user_id: parseInt(localStorage.getItem("id")),
            game_id: parseInt(localStorage.getItem("game_id")),
            position: this.position,
            quaternion: this.quaternion,

        };

        this.setup.ws.send(JSON.stringify(data));
    }


}

export { Player };
