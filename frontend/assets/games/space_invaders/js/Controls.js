class Controls {
    constructor(player) {
        this.player = player;
        this.activeKeys = new Set();

        window.addEventListener('keydown', (event) => {
            this.activeKeys.add(event.key.toLowerCase());
        });

        window.addEventListener('keyup', (event) => {
            if (event.key == 'Shift') this.player.StopSprint();

            this.activeKeys.delete(event.key.toLowerCase());
        });
    }

    update() {
        if (this.activeKeys.has('z') || this.activeKeys.has('w')) this.player.rotateUp();
        if (this.activeKeys.has('s')) this.player.rotateDown();
        if (this.activeKeys.has('q') || this.activeKeys.has('a')) this.player.rotateLeft();
        if (this.activeKeys.has('d')) this.player.rotateRight();
        if (this.activeKeys.has(' ')) this.player.Shoot();
        if (this.activeKeys.has('c')) this.player.changeCamera();
        if (this.activeKeys.has('shift')) this.player.Sprint();
    }
}

export { Controls };
