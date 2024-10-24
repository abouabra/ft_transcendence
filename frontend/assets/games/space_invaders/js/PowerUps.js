import {THREE, GLTFLoader} from '/assets/games/space_invaders/js/three-defs.js';
import {DeathExplosion} from '/assets/games/space_invaders/js/Particles.js';

class PowerUp {
    constructor(type, player, setup) {
        this.type = type;
        

        this.Reward_HP = 40;
        this.Reward_BOOST = 20;
        this.Reward_SPEED = 0.1;
        this.Reward_DAMAGE = 10;

        this.mesh = null;


        this.health = 1000;
        this.moveSpeed = 0.1;

        this.player = player;
        this.setup = setup;
        this.render();
    }

    render() {
        
        let color = 0xffffff;
        if(this.type === 'health') color = 0x00ff00;
        if(this.type === 'boost') color = 0xff0000;
        if(this.type === 'damage') color = 0x0000ff;
        if(this.type === 'speed') color = 0xffff00;

        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(10, 10, 10),
            new THREE.MeshBasicMaterial({color: color})
        );
        const types = ['health', 'boost', 'damage', 'speed'];

        this.mesh = this.setup.astroids_models[types.indexOf(this.type)].clone();
        
        this.setup.scene.add(this.mesh);
        this.setup.objectsToCheck.push(this.mesh);
        this.setup.worldObjects.push(this.mesh);


        const space = 1000;

        let random_position = null;

        while (true)
        {
            random_position = new THREE.Vector3(
                Math.random() * space - space / 2,
                Math.random() * space - space / 2,
                Math.random() * space - space / 2
            );
            if (random_position.distanceTo(this.player.position) > 5)
                break;
        }

        this.mesh.position.copy(random_position);

       
    }

    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.die();
        }
    }

    die() {

         // Create death explosion effect
        const explosionColor = this.mesh.material.color;
        const explosion = new DeathExplosion(this.setup.scene, this.mesh.position, explosionColor);

        this.setup.activeEffects.push(explosion);

        this.setup.objectsToCheck = this.setup.objectsToCheck.filter(obj => obj !== this.mesh);
        this.setup.worldObjects = this.setup.worldObjects.filter(obj => obj !== this.mesh);
        this.setup.scene.remove(this.mesh);
        this.handlePowerUp();
    }

    update()
    {
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.01;
        this.mesh.rotation.z += 0.01;

        this.handlePowerUp(true);
    }

    handlePowerUp(update = false){

        if(update == false)
        {
            this.player.score += 100;
            document.querySelector("#game-page-user-1-score").innerText = this.player.score;
        }

        if (this.type === 'health') {
            if(update == false)
                this.player.health += this.Reward_HP;
            
                this.player.health = Math.ceil(this.player.health);

            const powerup_health = document.getElementById('powerup_health');
            if(this.player.health > 2000){
                powerup_health.style.width = `${200 * (this.player.health / 2000)}px`;
                powerup_health.setAttribute("aria-valuemax", this.player.health);
            }
            
            powerup_health.setAttribute("aria-valuenow", this.player.health);
            powerup_health.querySelector('.progress-bar').style.width = `${this.player.health * 100 / 2000}%`;
            powerup_health.querySelector('.progress-bar span').innerText = `${this.player.health}`;
        }

        if (this.type === 'boost') {
            if(update == false)
                this.player.boost += this.Reward_BOOST;
            
            const powerup_boost = document.getElementById('powerup_boost');
            if(this.player.boost > 100){
                powerup_boost.style.width = `${200 * (this.player.boost / 100)}px`;
                powerup_boost.setAttribute("aria-valuemax", this.player.boost);
            }


            powerup_boost.setAttribute("aria-valuenow", this.player.boost);
            powerup_boost.querySelector('.progress-bar').style.width = `${this.player.boost.toFixed(2)}%`; 
            powerup_boost.querySelector('.progress-bar span').innerText = `${this.player.boost.toFixed(2)}`; 
        }

        if (this.type === 'speed') {
            if(update == false)
            {
                this.player.BaseMoveSpeed += this.Reward_SPEED;
                this.player.moveSpeed = this.player.BaseMoveSpeed;
                this.setup.BaseFOV += this.Reward_SPEED * 10;
                
                this.setup.camera.fov = this.setup.BaseFOV;
                this.setup.camera.updateProjectionMatrix();
            }
                
            const powerup_speed = document.getElementById('powerup_speed');
            powerup_speed.innerText = `x ${(this.player.moveSpeed / 0.5).toFixed(2)}`;
        }
        if (this.type === 'damage') {
            if(update == false)
                this.player.damage += this.Reward_DAMAGE;

            const powerup_damage = document.getElementById('powerup_damage');
            powerup_damage.innerText = `x ${(this.player.damage / 10).toFixed(2)}`;
        }
    }

}


class PowerUps {
    constructor(numberOfPowerUps, player, setup) {
        this.numberOfPowerUps = numberOfPowerUps;
        this.all_powerups = [];

        const types = ['health', 'boost', 'damage', 'speed'];
        for (let i = 0; i < this.numberOfPowerUps; i++) {
            const type = types[Math.floor(Math.random() * types.length)];
            const powerUp = new PowerUp(type, player, setup);
            this.all_powerups.push(powerUp);
        }
    }

    update() {
        this.all_powerups.forEach(powerUp => powerUp.update());
        
        if(this.all_powerups.length < this.numberOfPowerUps){
            const types = ['health', 'boost', 'damage', 'speed'];
            const type = types[Math.floor(Math.random() * types.length)];
            const powerUp = new PowerUp(type, this.player, this.setup);
            this.all_powerups.push(powerUp);
        }
    }
}

export { PowerUps };


