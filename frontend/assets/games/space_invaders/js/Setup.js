import {THREE, GLTFLoader, Stats} from '/assets/games/space_invaders/js/three-defs.js';
import { Controls } from '/assets/games/space_invaders/js/Controls.js';
import { PowerUps } from '/assets/games/space_invaders/js/PowerUps.js';
import {OpponentTracker} from '/assets/games/space_invaders/js/OpponentTracker.js';


class Setup {
    constructor(player, opponent) {
        this.canvas = document.getElementById('game-canvas');
        this.scene = new THREE.Scene();
        this.player = player;
        this.opponent = opponent;
        this.game_task_switch = true;

        this.opponentTracker = null;

        this.controls = new Controls(player);
        this.BaseFOV = 60; // Base field of view
        this.camera = new THREE.PerspectiveCamera(
            this.BaseFOV,
            this.canvas.clientWidth / this.canvas.clientHeight,
            0.1,
            10000
        );

        this.cameraOffsets = [
            new THREE.Vector3(0, 2, -5),
            new THREE.Vector3(0, 2, 5),
            new THREE.Vector3(0, 0.5, -1.3),
            new THREE.Vector3(0, 5, -15),
        ];
        this.cameraOffset = this.cameraOffsets[0];



        this.camera.position.copy(this.cameraOffset);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.canvas.appendChild(this.renderer.domElement);

        this.clock = new THREE.Clock();

        this.stats = new Stats();
        this.canvas.appendChild(this.stats.dom);


        
        this.planet = null;
        this.activeEffects = [];
        this.astroids_models = [];
        this.worldObjects = []; // Array to store world objects that are not powerups
        this.objectsToCheck = []; // Array to store objects that need to be checked for raycasting
        


        this.powerUPs = null;
        
        this.setupWorld();
        
        
        window.addEventListener('resize', () => this.onWindowResize());

        this.interval = setInterval(() => {
            this.animate();
        }, 1000 / 60);
    }

    setupWorld() {
        const loader = new THREE.CubeTextureLoader();
        loader.setPath('/assets/games/space_invaders/terrain/');
        const textureCube = loader.load([
            'space-posx.jpg', 'space-negx.jpg',
            'space-posy.jpg', 'space-negy.jpg',
            'space-posz.jpg', 'space-negz.jpg'
        ]);
        this.scene.background = textureCube;
    
        // Use the environment map, but with reduced intensity
        this.scene.environment = textureCube;
        this.scene.environment.intensity = 1;  // Adjust this value as needed
    
        // Reduce the intensity of the ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);  // Reduced from 2 to 0.2
        this.scene.add(ambientLight);
    
        // Add a softer directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);  // Reduced intensity
        directionalLight.position.set(1, 1, 1).normalize();
        this.scene.add(directionalLight);
    
        // Adjust renderer settings
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;  // Reduced from 1 to 0.8
    
        this.opponentTracker = new OpponentTracker(this);

        // this.load_Planet();
        this.load_astroids();
    }

    load_Planet() {
        // add the planet
        const loader = new GLTFLoader();
        loader.load('/assets/games/space_invaders/models/planet_of_phoenix.glb', (gltf) => {
            const planet = gltf.scene;
            this.planet = planet;
            planet.scale.set(1000, 1000, 1000);
            planet.position.set(4000, 4000, -2000);
            planet.rotation.set(0, 0, 1.5);


            planet.update = () => {
                planet.rotation.x += 0.001;
            }

            this.scene.add(planet);
            

            const planet_light = new THREE.DirectionalLight(0xffffff, 2);
            planet_light.position.set(300, 300, -999);
            planet_light.target = planet;

            this.scene.add(planet_light);
            this.worldObjects.push(planet);
        });

    }

    load_astroids() {
        const loader = new GLTFLoader();
        loader.load('/assets/games/space_invaders/models/stylized_asteroids.glb', (gltf) => {
            const astroids = gltf.scene;
            astroids.traverse((object) => {
                if(object.isMesh) {
                    this.astroids_models.push(object);
                }
            });

            this.powerUPs = new PowerUps(30, this.player, this);
        });

    }

    updateCamera() {
        if (this.player.isSprinting) this.camera.fov = this.BaseFOV * 1.5;
        else this.camera.fov = this.BaseFOV;

        this.camera.updateProjectionMatrix();

        this.cameraOffset = this.cameraOffsets[this.player.cameraIndex % this.cameraOffsets.length];

        // Update camera position based on player's position and orientation
        const offset = new THREE.Vector3().copy(this.cameraOffset).applyQuaternion(this.player.quaternion);
        this.camera.position.copy(this.player.position).add(offset);
        this.camera.lookAt(this.player.position); // Always look at the player
    }

    EndGame(loser) {

        if(this.opponentTracker)
        {
            this.opponentTracker.destroy();
            this.opponentTracker = null
        }


        if(!window.game_socket) 
            return;
        
        let uid = -1;

        if(loser == "player")
            uid = parseInt(localStorage.getItem("id"));
        else
            uid = parseInt(localStorage.getItem("opponent_id"));

        const current_time = new Date().getTime();
        const delta_time_in_sec = (current_time - parseInt(localStorage.getItem('starting_time'))) / 1000;
        console.log("delta time in seconds", delta_time_in_sec);

        window.game_socket.send(JSON.stringify({
            type: "game_over",
            user_id: uid,
            game_room_id: parseInt(localStorage.getItem('game_id')),
            game_time : delta_time_in_sec
        }));
        console.log("i am dead | i am ", uid);
    }

    animate() {
        if (!this.player.isAlive || !this.opponent.isAlive)
        {
            let loser = this.player.isAlive ? "opponent" : "player";
            this.EndGame(loser);
            clearInterval(this.interval);
            return;
        }

        
        // requestAnimationFrame(() => this.animate());
        
        if(!this.player.mesh || !this.opponent.mesh) return;


        if (this.opponentTracker) {
            this.opponentTracker.update();
        }



        
        const deltatime = this.clock.getDelta();

        this.controls.update();
        this.player.update(deltatime);
        this.opponent.update(deltatime);
        this.updateCamera();
        if(this.planet) this.planet.update();
        if(this.powerUPs) this.powerUPs.update();


		const timer = document.getElementById('game-page-game-timer');
		if(!timer){
            console.log('timer not found');
            return;
        } 
        const minutes = Math.floor(this.clock.elapsedTime / 60);
        const seconds = Math.floor(this.clock.elapsedTime % 60);
        
        let minutesDisplay = minutes < 10 ? '0' + minutes : minutes;
        let secondsDisplay = seconds < 10 ? '0' + seconds : seconds;
        
        timer.textContent = minutesDisplay + ' : ' + secondsDisplay;

        this.stats.update();
        this.renderer.render(this.scene, this.camera);

        if(this.game_task_switch)
        {
            console.log("sending si_clients_ready");
            this.game_task_switch = false;
            if(window.game_socket) {
                window.game_socket.send(JSON.stringify({
                    type: "si_clients_ready",
                    game_room_id: parseInt(localStorage.getItem('game_id')),
                }));
            }
        }

    }

    onWindowResize() {
        this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    }



}

export { Setup };
