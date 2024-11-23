import {THREE} from '/assets/games/space_invaders/js/three-defs.js';

class EngineThrustEffect {
    constructor(scene, ship) {
        this.scene = scene;
        this.ship = ship;
        this.particles = [];
        this.particleCount = 100;

        // Load the particle texture for a more realistic effect
        const textureLoader = new THREE.TextureLoader();
        this.particleTexture = textureLoader.load('/assets/games/space_invaders/textures/fire.png');  // Adjust path to your texture

        // Sprite material to apply the texture
        this.particleMaterial = new THREE.SpriteMaterial({
            map: this.particleTexture,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.8,
            color: new THREE.Color(0xff0000)  // Start with red color
        });

        this.initParticles();
    }

    initParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            const particle = new THREE.Sprite(this.particleMaterial);
            
            particle.position.set(
                i % 2 == 0 ? 3.0 + Math.random() * 2 : -3.0 - Math.random() * 2,
                Math.random() * 2,
                -9
            );
            particle.scale.set(3.0, 3.0, 3.0);  // Adjust scale for more realistic size
            
            particle.velocity = new THREE.Vector3(0, 0, -Math.random() * 0.15);
            particle.lifespan =  Math.random();
            
            this.particles.push(particle);
            this.ship.mesh.add(particle);
        }
    }

    getColorFromSpeed(speed) {
        const red = new THREE.Color(0xc44b00);  // Red color
        const purple = new THREE.Color(0x3c00c4);  // Purple color
        
        return red.lerp(purple, speed);  // Linear interpolate from red to purple based on speed
    }

    update(deltaTime) {
        const speed = this.ship.moveSpeed;  // Assuming ship.velocity is a THREE.Vector3
        const maxSpeed = 3;  // Define your max speed for normalization
        const normalizedSpeed = Math.min(speed / maxSpeed, 1);  // Clamp speed to range [0, 1]

        // Update particle color based on speed
        const color = this.getColorFromSpeed(normalizedSpeed);
        this.particleMaterial.color.set(color);
        
        for (let i = 0; i < this.particleCount; i++) {
            const particle = this.particles[i];
            
            // Update particle position
            particle.position.add(particle.velocity);
            particle.lifespan -= deltaTime;
            // particle.scale.set(3.0 * particle.lifespan, 3.0 * particle.lifespan, 3.0 * particle.lifespan);
            
            // set opacity based on lifespan
            particle.opacity = particle.lifespan;

            // Reset particle if its lifespan ends
            if (particle.lifespan <= 0) {
                particle.position.set(
                    i % 2 == 0 ? 3.0 + Math.random() * 2 : -3.0 - Math.random() * 2,
                    Math.random() * 2,
                    -9
                );
                particle.velocity.set(0, 0, -Math.random() * 0.15);
                // particle.scale.set(3.0, 3.0, 3.0);
                particle.opacity = 0.8;
                particle.lifespan =  Math.random();
            }
        }
    }
}

export { EngineThrustEffect };



class DeathExplosion {
    constructor(scene, position, color) {
        this.scene = scene;
        this.particles = [];
        this.particleCount = 10;
        this.lifespan = 2; // Total lifespan of the explosion in seconds
        this.elapsedTime = 0;

        const textureLoader = new THREE.TextureLoader();
        this.particleTexture = textureLoader.load('/assets/games/space_invaders/textures/fire.png'); // Adjust path to your particle texture

        this.particleMaterial = new THREE.PointsMaterial({
            size: 20,
            map: this.particleTexture,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.8,
            color: color
        });

        this.initParticles(position);
    }

    initParticles(position) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const velocities = new Float32Array(this.particleCount * 3);

        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            // Position
            positions[i3] = position.x;
            positions[i3 + 1] = position.y;
            positions[i3 + 2] = position.z;

            // Velocity
            velocities[i3] = (Math.random() - 0.5) * 10;
            velocities[i3 + 1] = (Math.random() - 0.5) * 10;
            velocities[i3 + 2] = (Math.random() - 0.5) * 10;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

        this.particleSystem = new THREE.Points(geometry, this.particleMaterial);
        this.scene.add(this.particleSystem);
    }

    update(deltaTime) {
        this.elapsedTime += deltaTime;

        if (this.elapsedTime >= this.lifespan) {
            this.scene.remove(this.particleSystem);
            return false; // Indicate that the explosion has finished
        }

        const positions = this.particleSystem.geometry.attributes.position.array;
        const velocities = this.particleSystem.geometry.attributes.velocity.array;

        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;

            positions[i3] += velocities[i3] * deltaTime;
            positions[i3 + 1] += velocities[i3 + 1] * deltaTime;
            positions[i3 + 2] += velocities[i3 + 2] * deltaTime;

            // Slow down particles over time
            velocities[i3] *= 0.98;
            velocities[i3 + 1] *= 0.98;
            velocities[i3 + 2] *= 0.98;
        }

        this.particleSystem.geometry.attributes.position.needsUpdate = true;
        this.particleSystem.geometry.attributes.velocity.needsUpdate = true;

        // Fade out the particles
        const progress = this.elapsedTime / this.lifespan;
        this.particleMaterial.opacity = 1 - progress;

        return true; // Indicate that the explosion is still active
    }
}

export { DeathExplosion };