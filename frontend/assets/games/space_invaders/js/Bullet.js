import {THREE} from '/assets/games/space_invaders/js/three-defs.js';

class Bullet {
    constructor(player, isLeftGun) {
        this.player = player;
        this.setup = player.setup;
        // Bullet geometry (oval shape)
        this.geometry = new THREE.SphereGeometry(0.1, 16, 8); // Small sphere-like shape

        // Bullet color initially set to red
        this.material = new THREE.MeshBasicMaterial({ color: 0xfd5408 });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.player = player;
        
        // Set initial position and direction based on player's current position and orientation
        const baseGunOffset = new THREE.Vector3(1.5, 0, 0);
        if (!isLeftGun) {
            baseGunOffset.x *= -1; // Mirror for right gun
        }

        // Get the current camera offset
        const cameraOffset = this.setup.cameraOffset;

        // Adjust gun offset based on camera perspective
        let adjustedGunOffset = this.adjustGunOffsetForCamera(baseGunOffset, cameraOffset);

        // Apply rotation to the offset
        adjustedGunOffset.applyQuaternion(player.mesh.quaternion);

       // Set initial position based on player's position and rotated gun offset
        this.mesh.position.copy(player.position).add(adjustedGunOffset);        
        
        // Set direction based on player's forward direction
        this.direction = player.rayDirection.clone();
        this.speed = 10.0; // Bullet speed depends on player's sprint state
        
        // Add bullet to the scene
        player.setup.scene.add(this.mesh);
        // Time-to-live (TTL) for the bullet
        this.ttl = 2; // The bullet will disappear after 5 seconds
    }

    adjustGunOffsetForCamera(baseOffset, cameraOffset) {
        let adjustedOffset = baseOffset.clone();

        // If camera is behind the ship (positive Z), flip the X offset
        if (cameraOffset.z > 0) {
            adjustedOffset.x *= -1;
        }

        // Adjust Y offset based on camera height
        adjustedOffset.y += cameraOffset.y * -0.3; // Subtle adjustment, can be tweaked

        // Adjust Z offset based on camera distance
        let zAdjustment = Math.abs(cameraOffset.z) * 0.05; // Subtle adjustment, can be tweaked
        adjustedOffset.z += cameraOffset.z > 0 ? -zAdjustment : zAdjustment;

        return adjustedOffset;
    }

    // Update the bullet position each frame
    update(deltaTime) {

        this.speed = this.player.moveSpeed * 10.0;

        // Move bullet forward in the direction it was shot
        this.mesh.position.add(this.direction.clone().multiplyScalar(this.speed));
        
        // Reduce TTL each frame
        this.ttl -= deltaTime;
        
        // Update color based on speed (red to blue)
        // const colorFactor = this.speed / 2.0; // Assuming max speed is 2.0
        // this.mesh.material.color.setRGB(1 - colorFactor, 0, colorFactor); // Transitions from red to blue
        
        // Remove bullet when TTL expires
        if (this.ttl <= 0) {
            this.destroy();
            return false; // Bullet is no longer active
        }

        return true; // Bullet is still active
    }

    // Function to destroy the bullet
    destroy() {
        this.player.setup.scene.remove(this.mesh);
        this.player.setup.objectsToCheck = this.player.setup.objectsToCheck.filter(obj => obj !== this.mesh);
        this.player.setup.worldObjects = this.player.setup.worldObjects.filter(obj => obj !== this.mesh);
    }

}

export { Bullet };