import {THREE} from '/assets/games/space_invaders/js/three-defs.js';

class OpponentTracker {
    constructor(setup) {
        this.setup = setup;
        // Scale configuration
        this.minScale = 0.5;     // Minimum marker scale (when very close)
        this.maxScale = 10;       // Maximum marker scale (when very far)
        this.minDistance = 10;   // Distance at which marker starts scaling up
        this.maxDistance = 300;  // Distance at which marker reaches max scale
        this.createMarker();
        this.createOffscreenIndicator();
    }

    createMarker() {
        // Create on-screen marker
        const markerCanvas = document.createElement('canvas');
        markerCanvas.width = 32;
        markerCanvas.height = 32;
        const ctx = markerCanvas.getContext('2d');
        
        // Draw a triangular marker
        ctx.beginPath();
        ctx.moveTo(16, 0);
        ctx.lineTo(32, 32);
        ctx.lineTo(16, 24);
        ctx.lineTo(0, 32);
        ctx.closePath();
        ctx.fillStyle = '#ff0000';
        ctx.fill();

        const markerTexture = new THREE.CanvasTexture(markerCanvas);
        const markerMaterial = new THREE.SpriteMaterial({ map: markerTexture });
        this.marker = new THREE.Sprite(markerMaterial);
        this.setup.scene.add(this.marker);
    }

    createOffscreenIndicator() {
        // Create the HTML element for off-screen indicator
        this.offscreenIndicator = document.createElement('div');
        this.offscreenIndicator.style.position = 'absolute';
        this.offscreenIndicator.style.width = '20px';
        this.offscreenIndicator.style.height = '20px';
        this.offscreenIndicator.style.backgroundColor = 'red';
        this.offscreenIndicator.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
        this.offscreenIndicator.style.display = 'none';
        this.offscreenIndicator.style.zIndex = '1000';
        this.offscreenIndicator.style.pointerEvents = 'none';
        document.getElementById('game-canvas').appendChild(this.offscreenIndicator);
    }

    calculateMarkerScale(distance) {
        // If distance is less than minDistance, return minScale
        if (distance <= this.minDistance) return this.minScale;
        // If distance is greater than maxDistance, return maxScale
        if (distance >= this.maxDistance) return this.maxScale;
        
        // Calculate scale based on distance using linear interpolation
        const distanceRatio = (distance - this.minDistance) / (this.maxDistance - this.minDistance);
        return this.minScale + (this.maxScale - this.minScale) * distanceRatio;
    }

    update() {
        if (!this.setup.opponent.mesh || !this.setup.camera) return;

        // Get opponent's position in world space
        const opponentPos = this.setup.opponent.position.clone();
        
        // Calculate distance to camera
        const distanceToCamera = opponentPos.distanceTo(this.setup.camera.position);
        
        // Calculate marker scale based on distance
        const scale = this.calculateMarkerScale(distanceToCamera);
        
        // Project opponent position to screen space
        const screenPosition = opponentPos.clone().project(this.setup.camera);
        
        // Get canvas dimensions
        const canvas = this.setup.renderer.domElement;
        const canvasRect = canvas.getBoundingClientRect();

        // Convert to pixel coordinates
        const x = (screenPosition.x + 1) * canvasRect.width / 2;
        const y = (-screenPosition.y + 1) * canvasRect.height / 2;

        // Check if opponent is behind the camera
        const isBehind = screenPosition.z > 1;

        // Check if position is off screen
        const isOffscreen = x < 0 || x > canvasRect.width || y < 0 || y > canvasRect.height || isBehind;

        if (isOffscreen) {
            // Hide 3D marker
            this.marker.visible = false;

            // Show off-screen indicator
            this.offscreenIndicator.style.display = 'block';

            // Calculate angle to opponent for indicator rotation
            const cameraDir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.setup.camera.quaternion);
            const toOpponent = opponentPos.clone().sub(this.setup.camera.position).normalize();
            let angle = Math.atan2(toOpponent.x, toOpponent.z) - Math.atan2(cameraDir.x, cameraDir.z);

            const padding = 40;
            let clampedX, clampedY;

            if (isBehind) {
                // When opponent is behind, position indicator in corners based on relative position
                const relativeX = toOpponent.x;
                const relativeY = toOpponent.y;
                
                // Determine which corner to use based on relative position
                if (relativeX > 0) {
                    clampedX = canvasRect.width - padding; // Right side
                } else {
                    clampedX = padding; // Left side
                }
                
                if (relativeY > 0) {
                    clampedY = padding; // Top
                } else {
                    clampedY = canvasRect.height - padding; // Bottom
                }
                
                // Adjust angle to point towards the center when in corners
                angle = Math.atan2(canvasRect.height/2 - clampedY, canvasRect.width/2 - clampedX) + Math.PI;
            } else {
                // Normal edge clamping for off-screen but not behind
                clampedX = Math.min(Math.max(padding, x), canvasRect.width - padding);
                clampedY = Math.min(Math.max(padding, y), canvasRect.height - padding);
            }

            // Position the indicator
            this.offscreenIndicator.style.left = `${clampedX - 10}px`;
            this.offscreenIndicator.style.top = `${clampedY - 10}px`;
            this.offscreenIndicator.style.transform = `rotate(${angle}rad)`;
        } else {
            // Show 3D marker and hide off-screen indicator
            this.marker.visible = true;
            this.offscreenIndicator.style.display = 'none';

            // Position the 3D marker above the opponent
            const markerPosition = opponentPos.clone().add(new THREE.Vector3(0, 2, 0));
            this.marker.position.copy(markerPosition);

            // Apply the distance-based scale
            this.marker.scale.set(scale, scale, scale);

            // Make marker face camera
            this.marker.quaternion.copy(this.setup.camera.quaternion);
        }
    }

    destroy() {
        if (this.marker) {
            this.setup.scene.remove(this.marker);
        }
        if (this.offscreenIndicator && this.offscreenIndicator.parentNode) {
            this.offscreenIndicator.parentNode.removeChild(this.offscreenIndicator);
        }
    }
}

export { OpponentTracker };